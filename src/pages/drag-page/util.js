import {useRef, useEffect, createElement} from 'react';
import ReactDOM from 'react-dom';
import inflection from 'inflection';
import * as raLibComponent from '@ra-lib/admin';
import * as components from './components';
import * as antdComponent from 'antd/es';
import * as antdIcon from '@ant-design/icons';
import {getComponentConfig, setNodeDefault} from 'src/pages/drag-page/component-config';
import {findNodeById, findParentNodeByName, findNodesByName, findParentNodeById, isNode, setNodeId, loopNode} from 'src/pages/drag-page/node-util';
import {debounce, cloneDeep} from 'lodash';
import componentImage from './component-16.png';

export const OTHER_HEIGHT = 0;

export const LINE_SIZE = 1;
export const TRIGGER_SIZE = 20;
export const isMac = /macintosh|mac os x/i.test(navigator.userAgent);

// 获取字段配置信息
export function getFieldOption(node, field) {
    const config = getComponentConfig(node?.componentName);
    if (!config) return null;

    const {fields} = config;


    const loopFields = fields => {
        if (!fields?.length) return null;
        for (let opt of fields) {
            if (opt.field === field) return opt;

            if (Array.isArray(opt.type)) {
                const fs = opt.type.find(item => item.value === 'object');
                if (fs) {
                    const result = loopFields(fs.fields);
                    if (result) return result;
                }
            }

            if (typeof opt.type === 'object' && opt.type.value === 'object') {
                const result = loopFields(opt.type.fields);
                if (result) return result;
            }
        }
    };

    return loopFields(fields);
}

// 获取label宽度
export function getLabelWidth(label) {
    if (!label?.length) return 0;

    // 统计汉字数，不包括标点符号
    const fontSize = 14;
    const m = label.match(/[\u4e00-\u9fff\uf900-\ufaff]/g);
    const chineseCount = (!m ? 0 : m.length);
    const otherCount = label.length - chineseCount;
    return (chineseCount + otherCount / 2) * fontSize + 30;
}

const toggleIsWrapper = debounce((draggingNode) => {
    if (draggingNode.freezeIsWrapper) return;
    draggingNode.isWrapper = !draggingNode.isWrapper;
}, 100);

const toggleIsToSetProps = debounce((draggingNode) => {
    if (!draggingNode?.nodeData?.propsToSet) return;

    draggingNode.toSetProps = !draggingNode.toSetProps;
}, 100);

const toggleIsReplace = debounce((draggingNode) => {
    draggingNode.isReplace = !draggingNode.isReplace;
}, 100);

/**
 * 获取拖拽信息，拖拽过程中，根据用户点击键盘，进行投放模式切换
 *      ctrl(command)：wrapper切换
 *      alt 设置属性切换
 *      shift 替换节点切换
 *
 * @param e
 * @param draggingNode
 * @returns {{}}
 */
export function getDraggingNodeInfo({e, draggingNode}) {
    if (!e || !draggingNode) return draggingNode || {};

    const isMetaOrCtrl = (e.metaKey || e.ctrlKey);
    const isAltKey = e.altKey;
    const isShiftKey = e.shiftKey;

    if (isMetaOrCtrl) {
        toggleIsWrapper(draggingNode);
    }

    if (isAltKey) {
        toggleIsToSetProps(draggingNode);
    }

    if (isShiftKey) {
        toggleIsReplace(draggingNode);
    }

    const {isWrapper, toSetProps, isReplace} = draggingNode;
    draggingNode.toSelectTarget = isWrapper || toSetProps || isReplace;

    return draggingNode || {};
}

// 判断字符串是否是函数
export function isFunctionString(value) {
    return value
        && typeof value === 'string'
        && (value.includes('function') || value.includes('=>'));
}

// 获取obj中字段名，比如 field = visible, obj中存在obj.visible,将得到 visible2
export function getNextField(obj, field) {
    if (typeof obj === 'object' && !Array.isArray(obj) && !(field in obj)) return field;

    const nums = [0];
    const keys = Array.isArray(obj) ? obj : Object.keys(obj);
    keys.forEach(key => {
        const result = RegExp(`${field}(\\d+$)`).exec(key);
        if (result) {
            nums.push(window.parseInt(result[1]));
        }
    });

    const num = Math.max(...nums) + 1;

    return `${field}${num}`;
}

// 节点渲染之后，统一处理函数，用于给没有透传props属性的组件，添加拖拽相关属性
export function fixDragProps(options) {
    const {node, dragProps, iframeDocument, isPreview, element} = options;
    if (!iframeDocument) return;
    const {id} = node;

    const ele = element || iframeDocument.querySelector(`.id_${id}`);

    if (!ele) return;

    Object.entries(dragProps)
        .forEach(([key, value]) => {
            if (isPreview) {
                ele.removeAttribute(key);
            } else {
                ele.setAttribute(key, value);
            }
        });
}

// 设置拖拽图片
export function setDragImage(e, node) {
    const img = new Image();
    // img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQYV2NgAAIAAAUAAarVyFEAAAAASUVORK5CYII=';
    img.src = componentImage;
    img.style.width = '30px';
    e.dataTransfer.setDragImage(img, 0, 16);
}

// 同步设置对象，将newObj中属性，对应设置到oldObj中
export function syncObject(oldObj, newObj) {
    const cloneNewObj = cloneDeep(newObj);
    Object.entries(cloneNewObj)
        .forEach(([key, value]) => {
            if (typeof value !== 'object') {
                oldObj[key] = value;
            } else {
                if (!(key in oldObj) || typeof oldObj[key] !== 'object') {
                    oldObj[key] = value;
                } else {
                    if (oldObj[key]) {
                        syncObject(oldObj[key], value);
                    }
                }
            }
        });
}

// 删除所有非关联id
export function deleteUnLinkedIds(nodeConfig, keepIds = []) {
    let linkedIds = findLinkSourceComponentIds(nodeConfig);

    linkedIds = linkedIds.concat(keepIds);

    loopNode(nodeConfig, node => {
        if (!linkedIds.includes(node.id)) Reflect.deleteProperty(node, 'id');
    });
}

// 获取含有关联元素的ids
export function findLinkSourceComponentIds(pageConfig) {
    const ids = [];
    loopNode(pageConfig, node => {
        const propsToSet = node.propsToSet;
        const componentId = node.id;

        if (propsToSet) {
            const targetIds = Object.entries(propsToSet)
                .filter(([, value]) => (typeof value === 'string'))
                .map(([key, value]) => {
                    return findLinkTargetComponentIds({
                        key,
                        value,
                        pageConfig,
                    });
                }).flat();

            // 存在target
            if (targetIds?.length) {
                ids.push(componentId);
            }
        }
    });

    return ids;
}

// 获取所有关联目标组件id
function findLinkTargetComponentIds(options) {
    const {
        key,
        value,
        pageConfig,
    } = options;

    const result = [];

    loopNode(pageConfig, node => {
        let {props} = node;
        if (!props) props = {};

        if (props[key] === value) {
            const targetComponentId = node?.id;
            result.push(targetComponentId);
        }
    });

    return result;
}

// 获取关联元素位置
export function findLinkTargetsPosition(options) {
    const {pageConfig, selectedNode, iframeDocument} = options;

    if (!iframeDocument) return [];

    if (!selectedNode) return [];

    const {id: componentId, propsToSet} = selectedNode;

    if (!propsToSet) return [];

    return Object.entries(propsToSet)
        .map(([key, value]) => {
            return findElementPosition({
                pageConfig,
                key,
                value,
                componentId,
                iframeDocument,
            }) || [];
        }).flat();
}

// 获取位置
function findElementPosition(options) {
    const {
        key,
        value,
        componentId: sourceComponentId,
        iframeDocument,
        pageConfig,
    } = options;

    const targetIds = findLinkTargetComponentIds({
        key,
        value,
        pageConfig,
    });

    return targetIds.map(targetComponentId => {
        let ele = iframeDocument.querySelector(`[data-component-id="${targetComponentId}"]`);
        if (!ele) {
            ele = document.getElementById(`sourceLinkPoint_${sourceComponentId}`);
        }
        if (!ele) return false;

        const {x, y, width, height} = ele.getBoundingClientRect();
        return {
            key: `${value}__${targetComponentId}`,
            propsKey: key,
            propsValue: value,
            endX: x + width / 2,
            endY: y + height / 2,
            targetComponentId,
            sourceComponentId,
        };
    }).filter(item => !!item);
}

// css 样式字符串 转 js 样式对象
export function cssToObject(css) {
    if (!css) return {};

    css = css.replace(/"/g, '');

    const ele = document.createElement('div');
    ele.innerHTML = `<div style="${css}"></div>`;

    const style = ele.childNodes[0].style || {};

    const cssKeys = css.split(';').map(item => {
        const cssKey = item.split(':')[0].replace(/-/g, '_');
        const key = inflection.camelize(cssKey, true);

        return key.trim();
    }).filter(item => !!item);

    return cssKeys.reduce((prev, key) => {
        const value = style[key];
        if (
            value === ''
            || value === 'initial'
            || key.startsWith('webkit')
            || !window.isNaN(key) // key 是数字
        ) return prev;

        prev[key] = value;
        return prev;
    }, {});
}

// js 样式对象 转 css 字符串
export async function objectToCss(style) {
    return new Promise((resolve, reject) => {

        if (!style) return resolve('');

        const ele = document.createElement('div');
        ele.style.position = 'fixed';
        ele.style.zIndex = -999;
        ele.style.top = '-1000px';

        document.body.append(ele);

        ReactDOM.render(createElement('div', {style}), ele);

        setTimeout(() => {
            const css = ele.childNodes[0].style.cssText;

            ele.remove();

            resolve(css);
        });
    });
}

// 表单值转换，纯数字字符串，转换为数字 并不允许输入空格
export function getNumberValueFromEvent(e) {
    let {value} = e.target;
    if (!value) return value;

    // 不允许输入空格
    value = value.replace(/\s/g, '');

    if (value.endsWith('.')) return value;

    // 为纯数字 直接转换为数字
    if (!window.isNaN(value)) {
        return window.parseFloat(value);
    }

    return value;
}

// 表单值转换，不允许输入空格
export function getNoSpaceValueFromEvent(e) {
    let {value} = e.target;
    if (!value) return value;

    // 不允许输入空格
    value = value.replace(/\s/g, '');

    return value;
}

// 树过滤函数
export function filterTree(array, filter) {
    const getNodes = (result, node) => {
        if (filter(node)) {
            result.push(node);
            return result;
        }
        if (Array.isArray(node.children)) {
            const children = node.children.reduce(getNodes, []);
            if (children.length) result.push({...node, children});
        }
        return result;
    };

    return array.reduce(getNodes, []);
}

// 记录前一次渲染时数据
export function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
}

// 获取元素中间位置
export function getEleCenterInWindow(element) {
    if (!element) return null;

    const {x, y, width, height} = element.getBoundingClientRect();

    return {
        x: x + width / 2,
        y: y + height / 2,
    };
}

// 元素是否在可视窗口内
export function elementIsVisible(containerEle, element) {
    if (!element || !containerEle) return {};

    const containerHeight = containerEle.clientHeight;
    const containerScrollTop = containerEle.scrollTop;
    const elementRect = element.getBoundingClientRect();
    const containerRect = containerEle.getBoundingClientRect();
    const {y, height: elementHeight} = elementRect;
    const elementTop = y - containerRect.y + containerScrollTop;

    const elementBottom = elementTop + elementHeight;
    const containerShownHeight = containerScrollTop + containerHeight;

    // 可见
    const visible = !(elementTop > containerShownHeight
        || elementBottom < containerScrollTop);

    return {
        visible,
        elementTop,
        elementBottom,
        containerHeight,
        containerScrollTop,
        containerShownHeight,
    };

}

// 果冻元素到可视窗口内
export function scrollElement(containerEle, element, toTop, force, offset = 0) {
    if (!element) return;

    const {
        visible,
        elementTop,
        containerHeight,
    } = elementIsVisible(containerEle, element);

    const scroll = () => {
        if (toTop) {
            // 滚动到顶部
            containerEle.scrollTop = elementTop + offset;
        } else {
            // 滚动到中间
            containerEle.scrollTop = elementTop - containerHeight / 2 + offset;
        }
    };

    if (force) {
        scroll();
        return;
    }
    // 非可见
    if (!visible) {
        scroll();
    }
}

// 获取节点元素
export function getNodeEle(target) {
    if (!target) return target;

    if (typeof target.getAttribute !== 'function') return null;

    let isNodeEle = target.getAttribute('data-component-id');

    if (isNodeEle) return target;

    return getNodeEle(target.parentNode);
}

// 可投放元素 自身是容器，或则父级组件是容器
export function getDroppableEle(target) {
    if (!target) return target;

    // 获取节点元素
    const nodeEle = getNodeEle(target);

    if (!nodeEle) return null;

    // 当前是容器
    let isContainer = nodeEle.getAttribute('data-is-container') === 'true';
    if (isContainer) return nodeEle;

    // 父组件是容器
    const parentNodeEle = getNodeEle(nodeEle.parentNode);
    const parentNodeIsContainer = parentNodeEle?.getAttribute('data-is-container') === 'true';

    if (parentNodeIsContainer) return nodeEle;

    // 继续向上找
    return getDroppableEle(parentNodeEle);
}

// 节点投放事件处理函数
export function handleNodeDrop(options) {
    const {
        e,
        end,
        draggingNode,
        dragPageAction,
    } = options;

    let {
        isReplace,
        isWrapper,
        toSetProps,
        targetElement,
        targetElementId: targetComponentId,

        isBottom,
        isCenter,
        isLeft,
        isRight,
        isTop,

        accept,
        isNewAdd,
        nodeData,
    } = getDraggingNodeInfo({e, draggingNode});

    if (isLeft || isRight) {
        isCenter = false;
        isTop = false;
        isBottom = false;
    }

    const isBefore = isTop || isLeft;
    const isAfter = isBottom || isRight;
    const isChildren = isCenter;

    if (!targetElement && !targetComponentId) return end();

    const sourceNodeId = nodeData.id;

    // 设置目标属性
    if (toSetProps) {
        const propsToSet = draggingNode.nodeData.propsToSet;
        // 组件节点
        const newProps = typeof propsToSet === 'string' ? JSON.parse(propsToSet) : propsToSet;

        // 如果是组件节点，设置id
        Object.values(newProps)
            .filter(value => isNode(value))
            .forEach(value => {
                setNodeDefault(value);
                setNodeId(value, true);
            });

        dragPageAction.setNewProps({componentId: targetComponentId, newProps});

        return end();
    }

    // 包裹目标
    if (isWrapper) {
        if (!isNewAdd) {
            dragPageAction.moveWrapper({
                sourceId: sourceNodeId,
                targetId: targetComponentId,
            });
            return end();
        }

        if (isNewAdd) {
            dragPageAction.addWrapper({
                targetId: targetComponentId,
                node: nodeData,
            });
            return end();
        }
    }

    // 替换目标
    if (isReplace) {
        if (!isNewAdd) {
            dragPageAction.moveReplace({
                sourceId: sourceNodeId,
                targetId: targetComponentId,
            });
            return end();
        }

        if (isNewAdd) {
            dragPageAction.addReplace({
                targetId: targetComponentId,
                node: nodeData,
            });
            return end();
        }
    }

    // 放在自身上
    if (targetComponentId === sourceNodeId) return end();
    if (!accept) return end();

    dragPageAction.addOrMoveNode({
        sourceNode: nodeData,
        targetNodeId: targetComponentId,
        isBefore,
        isAfter,
        isChildren,
    });
    end();
}

// 获取组件投放位置
export function getDropPosition(options) {
    const guidePosition = getDropGuidePosition(options);

    const {position} = guidePosition;

    if (!position) return;

    let {
        isTop,
        isLeft,
        isBottom,
        isRight,
        isCenter: isChildren,
    } = position;

    if (isLeft || isRight) {
        isTop = false;
        isBottom = false;
        isChildren = false;
    }

    const isBefore = isTop || isLeft;
    const isAfter = isBottom || isRight;

    return {
        ...position,
        isBefore,
        isAfter,
        isChildren,
        guidePosition,
    };
}

// 是否接受放入
export function isDropAccept(options) {
    const {
        e,
        draggingNode,
        pageConfig,
        targetComponentId,
        isBefore,
        isAfter,
        isChildren,
    } = options;

    if (!draggingNode) return false;

    const {toSelectTarget, isReplace} = getDraggingNodeInfo({e, draggingNode});

    if (toSelectTarget && !isReplace) return true;

    let targetNode;
    if (isChildren) targetNode = findNodeById(pageConfig, targetComponentId);
    if (isBefore || isAfter || isReplace) targetNode = findParentNodeById(pageConfig, targetComponentId);
    if (!targetNode) return false;

    // 不能允许放到自身
    if (draggingNode?.id === targetNode?.id) return false;

    // 不允许父节点拖入子节点
    if (isChildrenNode(draggingNode?.nodeData, targetNode)) return false;

    const targetConfig = getComponentConfig(targetNode.componentName);
    const sourceConfig = getComponentConfig(draggingNode?.nodeData?.componentName);

    const {isContainer = true} = targetConfig;

    if (!isContainer) return false;

    let {dropInTo} = sourceConfig;

    const args = {
        draggingNode,
        targetNode,
        pageConfig,
    };

    if (typeof dropInTo === 'function') {
        if (!dropInTo(args)) return false;
    }

    if (typeof dropInTo === 'string') dropInTo = [dropInTo];

    if (Array.isArray(dropInTo)) {
        if (!dropInTo.includes(targetNode.componentName)) return false;
    }

    let {dropAccept} = targetConfig;

    if (typeof dropAccept === 'function') {

        return dropAccept(args);
    }

    if (typeof dropAccept === 'string') dropAccept = [dropAccept];

    if (!Array.isArray(dropAccept)) return true;

    const componentName = draggingNode?.nodeData?.componentName;

    return dropAccept.some(name => name === componentName);
}

// 检查是否是某个节点的子节点
export function isChildrenNode(parentNode, childrenNode) {
    if (!parentNode) return false;
    if (!childrenNode?.id) return false;
    if (parentNode.id === childrenNode.id) return false;

    return !!findNodeById(parentNode, childrenNode.id);
}

// 获取拖放提示位置
export function getDropGuidePosition(options) {
    const {
        pageX = 0,
        pageY = 0,
        clientX = 0,
        clientY = 0,
        targetElement,
        frameDocument,
    } = options;

    if (!targetElement) return {
        position: {
            isTop: false,
            isRight: false,
            isBottom: false,
            isLeft: false,
            isCenter: false,
        },
        guideLine: {
            left: 0,
            top: 0,
            width: 0,
            height: 0,
        },
        target: {
            targetElement,
            targetHeight: 0,
            targetWidth: 0,
            targetX: 0,
            targetY: 0,
            targetRect: {},
        },
    };

    const targetIsContainer = targetElement.getAttribute('data-is-container') === 'true';
    const targetRect = targetElement.getBoundingClientRect();

    const documentElement = frameDocument.documentElement || frameDocument.body;
    const windowHeight = documentElement.clientHeight;
    const windowWidth = documentElement.clientWidth;

    const scrollX = documentElement.scrollLeft;
    const scrollY = documentElement.scrollTop;

    const x = pageX - scrollX || clientX;
    const y = pageY - scrollY || clientY;

    let {
        left: targetX,
        top: targetY,
        width: targetWidth,
        height: targetHeight,
    } = targetRect;

    // 获取可视范围
    if (targetY < 0) {
        targetHeight = targetHeight + targetY;
        targetY = 0;
    }
    if (targetHeight + targetY > windowHeight) targetHeight = windowHeight - targetY;

    if (targetX < 0) {
        targetWidth = targetWidth + targetX;
        targetX = 0;
    }
    if (targetWidth + targetX > windowWidth) targetWidth = windowWidth - targetX;

    const triggerSizeHeight = targetHeight > TRIGGER_SIZE * 3 ? TRIGGER_SIZE : targetHeight / 3;
    const triggerSizeWidth = targetWidth > TRIGGER_SIZE * 3 ? TRIGGER_SIZE : targetWidth / 3;

    const halfY = targetY + targetHeight / 2;
    const halfX = targetX + targetWidth / 2;

    let isTop;
    let isBottom;
    let isLeft;
    let isRight;
    let isCenter = false;

    if (targetIsContainer) {
        isTop = y < targetY + triggerSizeHeight;
        isRight = x > targetX + targetWidth - triggerSizeWidth;
        isBottom = y > targetY + targetHeight - triggerSizeHeight;
        isLeft = x < targetX + triggerSizeWidth;
        isCenter = y >= targetY + triggerSizeHeight && y <= targetY + targetHeight - triggerSizeHeight;
    } else {
        isTop = y < halfY;
        isBottom = !isTop;
        isLeft = x < halfX;
        isRight = !isLeft;
    }

    let guidePosition;
    if (isLeft || isRight) {
        const left = isLeft ? targetX : targetX + targetWidth - LINE_SIZE;

        guidePosition = {
            left,
            top: targetY,
            height: targetHeight,
            width: LINE_SIZE,
        };
    } else {
        let top = isTop ? targetY : null;
        top = isBottom ? targetY + targetHeight - LINE_SIZE : top;
        top = isCenter ? halfY - LINE_SIZE / 2 : top;

        guidePosition = {
            left: targetX,
            top,
            width: targetWidth,
            height: LINE_SIZE,
        };
    }

    const position = {
        isTop,
        isRight,
        isBottom,
        isLeft,
        isCenter,
    };

    const target = {
        targetElement,
        targetHeight,
        targetWidth,
        targetX,
        targetY,
        targetRect,
    };

    return {
        position,
        guideLine: guidePosition,
        target,
    };
}

// 根据 componentName 获取组件
export function getComponent(options) {
    let {componentName} = options;
    const componentConfig = getComponentConfig(componentName);
    const {renderComponentName, componentType} = componentConfig;

    componentName = renderComponentName || componentName;

    const [name, subName] = componentName.split('.');

    const com = (Com, packageName) => {
        if (subName) Com = Com[subName];

        return {
            component: Com,
            packageName,
            name: subName || name,
            subName,
            exportName: name,
            dependence: {
                destructuring: true, // 解构方式
            },
        };
    };

    if (componentType === '@ra-lib/admin') {
        const raCom = raLibComponent[name];
        if (raCom) return com(raCom, '@ra-lib/admin');
    }

    const Com = components[name];
    if (Com) return com(Com);

    const AntdCom = antdComponent[name];
    if (AntdCom) return com(AntdCom, 'antd');

    const AntdIcon = antdIcon[name];
    if (AntdIcon) return com(AntdIcon, '@ant-design/icons');

    return com(name);
}

// 复制兼容函数
function fallbackCopyTextToClipboard(text) {
    var textArea = document.createElement('textarea');
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.position = 'fixed';

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        document.execCommand('copy');
    } catch (err) {
    }

    document.body.removeChild(textArea);
}

// 复制到剪切板
export function copyTextToClipboard(text) {
    if (!window.navigator.clipboard) {
        fallbackCopyTextToClipboard(text);
        return;
    }

    // 返回promise
    window.navigator.clipboard.writeText(text);
}

// 获取剪切板中内容
export function getTextFromClipboard() {
    return window.navigator.clipboard.readText();
}

// 设置表单元素name
export function getFormItemName(itemNode, pageConfig) {
    const formNode = findParentNodeByName(pageConfig, 'Form', itemNode.id);
    const items = findNodesByName(formNode, 'Form.Item');
    if (!items?.length) return itemNode.props.name;
    const names = items.map(node => node?.props?.name).filter(item => !!item);
    return getNextField(names, 'field');
}

export function getColumnDataIndex(columnNode, pageConfig) {
    const tableNode = findParentNodeByName(pageConfig, 'Table', columnNode.id);
    const columns = findNodesByName(tableNode, 'Table.Column');

    if (!columns?.length) return columnNode.props.dataIndex;

    const names = columns.map(item => item.props.dataIndex);
    return getNextField(names, 'field');
}
