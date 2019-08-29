import React from "react";
import components from "./components";
import {
    findNodeById,
    findSiblingsById,
    findParentById,
    propsToString,
    getIndentSpace,
    INDENT_SPACE,
} from "@/pages/drag-page/utils";
import uuid from "uuid/v4";


/**
 * 是否可编辑，如果可编辑，返回当前节点编辑配置信息。
 * @param pageConfig
 * @param __id
 */
export function canEdit(pageConfig, __id, e) {
    const node = findNodeById(pageConfig, __id) || {};
    const {__type} = node;
    const com = components[__type];

    if (!com) return null;

    const {tagName, editType} = com;
    const nodeChildren = node.children || [];

    // 子节点中只存在一个文本节点
    const nodeTextChildren = nodeChildren.filter(item => item.__type === 'text');
    if (nodeTextChildren && nodeTextChildren.length === 1) {
        const content = nodeTextChildren[0].content || '';
        const dom = document.getElementById(`dropBox-${__id}`).childNodes[0];

        return {
            __id,
            content,
            dom,
            editType,
        };
    }

    // 表单元素的label
    if (tagName === 'FormElement') {
        const {label: content} = node;
        const dom = document.getElementById(`dropBox-${__id}`).childNodes[0];

        return {
            __id,
            content,
            dom,
            editType,
            getNewProps: inputValue => {
                if (!inputValue) return;

                return {label: inputValue};
            },
        }
    }

    // 表格
    if (__type === 'Table') {
        let dom;
        let content;
        if (e) {
            if (e.target.parentNode.tagName !== 'TH') return;

            dom = e.target.parentNode;
            content = e.target.innerHTML;
        } else {
            dom = document.getElementById(`dropBox-${__id}`).querySelector('th');
            content = dom.innerText;
        }

        const getNewProps = (inputValue, editDom) => {
            if (editDom) dom = editDom;
            const ths = Array.from(dom.parentNode.querySelectorAll('th'));
            const columnIndex = ths.indexOf(dom);
            let {columns} = node;

            if (!inputValue) {
                columns = columns.filter((item, index) => !(item.title === '新增列' && index === columnIndex));
            } else {
                const column = columns[columnIndex];

                column.title = inputValue;
            }
            return {columns};
        };

        const getNextEditConfig = (editDom, cb) => {
            const ths = Array.from(editDom.parentNode.querySelectorAll('th'));
            const columnIndex = ths.indexOf(editDom);

            let index = columnIndex + 1;
            let dom = ths[index];
            let content = dom?.innerText;

            // 新增一列
            if (content === '操作' || !dom) {
                const {columns} = node;

                content = '新增列';
                columns.splice(index, 0, {id: index, title: content, dataIndex: `dataIndex${index}`, width: 100});

                if (cb) {
                    setTimeout(() => {
                        const ths = Array.from(editDom.parentNode.querySelectorAll('th'));
                        const dom = ths[index];

                        cb({
                            __id,
                            content,
                            title: '表格',
                            dom,
                            getNewProps: inputValue => getNewProps(inputValue, dom),
                            getNextEditConfig,
                        });
                    });
                }

                return {
                    newProps: {columns},
                };
            }
            // 选取下一个
            if (cb) {
                cb({
                    __id,
                    content,
                    title: '表格',
                    dom,
                    getNewProps: inputValue => getNewProps(inputValue, dom),
                    getNextEditConfig,
                });
            }
            return null;
        };

        return {
            __id,
            content,
            title: '表格',
            dom,
            getNewProps,
            getNextEditConfig,
        };
    }

    return null;
}

/**
 * 获取下一个可编辑节点，如果找到了，返回节点的编辑信息， 如果未找到，返回null
 * @param pageConfig
 * @param __id
 */
export function findNextCanEdit(pageConfig, __id) {
    const loopChildren = (node) => {
        const {__id, children} = node;
        const canEditNode = canEdit(pageConfig, __id);

        if (canEditNode) return canEditNode;

        if (children && children.length) {
            for (let i = 0; i < children.length; i++) {
                const node = loopChildren(children[i]);
                if (node) return node;
            }
        }

        return null;
    };

    const loopParent = (node) => {
        const {__id} = node;
        // 首先查找兄弟节点中是否有可编辑节点
        const siblings = findSiblingsById(pageConfig, __id);
        if (siblings && siblings.length) {
            const currentIndex = siblings.findIndex(item => item.__id === __id);

            for (let i = 0; i < siblings.length; i++) {
                const sib = siblings[i];

                // 排除自己及以前元素
                if (i <= currentIndex) continue;

                const node = loopChildren(sib);
                if (node) return node;
            }
        }

        const parentNode = findParentById(pageConfig, __id);

        if (parentNode) {
            return loopParent(parentNode);
        }

        return null;
    };

    return loopParent({__id});
}

export function canDrop(dragType, dropType) {
    const dragCom = components[dragType];
    const dropCom = components[dropType];
    if (!dragCom) return true;

    const {targetTypes} = dragCom;
    if (typeof targetTypes === 'string') return targetTypes === dropType;

    if (Array.isArray(targetTypes)) return targetTypes.includes(dropType);

    const {acceptTypes} = dropCom;
    if (typeof acceptTypes === 'string') return dragType === acceptTypes;

    if (Array.isArray(acceptTypes)) return acceptTypes.includes(dragType);

    return true;
}

export function getTagName(key, com) {
    const {component, tagName} = com;

    if (tagName) return tagName;

    if (typeof component === 'string') return component;

    return key;
}

export function renderNode(node, render, __parentId = '0', __parentDirection) {
    const {__id, __type, __level = 1000, __TODO, children, content, ...others} = node;
    const com = components[__type];

    if (!com) {
        console.warn(`没有此类型组件：${__type}`);
        return null;
    }

    const {
        component: Component,
        noWrapper,
        innerWrapper,
        direction,
        render: renderCom,
        tagName,
    } = com;

    let renderChildren = null;
    if (children && children.length) {
        renderChildren = children.map((item, index) => {
            item.__level = __level * 10 + index;
            return renderNode(item, render, __id, direction);
        });
    }

    let resultCom = null;
    if (renderCom) {
        resultCom = renderCom({key: __id, content, ...others, children: renderChildren});
    } else {
        resultCom = <Component key={__id} {...others}>{renderChildren}</Component>;
    }

    // 文字节点不可拖拽
    if (noWrapper) return resultCom;

    const options = {
        __id,
        __type,
        __parentId,
        __parentDirection,
        level: __level,
        tagName,
        Component,
        componentProps: others,
        componentChildren: renderChildren,
        innerWrapper,
        ...com
    };

    return render(resultCom, options);
}

export function virtualDomToString({virtualDom, path, indent = INDENT_SPACE * 3}) {
    const imports = [];
    const indentSpace = getIndentSpace(INDENT_SPACE);
    const indentSpace2 = getIndentSpace(INDENT_SPACE * 2);
    const indentSpace3 = getIndentSpace(INDENT_SPACE * 3);
    // 装饰器
    const decorators = [
        `@config({path: '${path}'})`,
    ];

    // 初始化 state
    const initStates = [];

    // 类属性
    const attributes = [];

    // 方法
    const methods = [
        `${indentSpace}componentDidMount() {
    
${indentSpace}}`,
    ];

    // render中state
    const states = [];

    const loop = virtualDom => {
        if (!virtualDom?.__type) return '';

        // 添加缩进
        if (!virtualDom.__indent) virtualDom.__indent = indent;

        const {__type, __id, children, __indent, __level, __TODO, ...props} = virtualDom;
        const com = components[__type];

        // 获取标签（组件）名
        let {tagName, component, toSource, dependence} = com;
        if (!tagName) {
            if (typeof component === 'string') {
                tagName = component;
            } else {
                tagName = __type;
            }
        }

        if (!tagName) return '';

        if (dependence) imports.push({tagName, dependence});

        let propsString = propsToString(props, __indent + INDENT_SPACE);

        const indentSpace = getIndentSpace(__indent);

        const todo = __TODO ? `${indentSpace}{/* TODO ${__TODO} */}\n` : '';
        let childrenJsx = '';
        if (children?.length) {
            childrenJsx = children.map(item => {
                item.__indent = __indent + INDENT_SPACE;
                return loop(item);
            }).join('\n');
        }

        if (toSource) {
            const componentJsx = toSource({
                props: {...props, children},
                tagName,
                todo,
                indentSpace,
                __indent,
                imports,
                decorators,
                initStates,
                attributes,
                methods,
                states,
            });
            return `${todo}${indentSpace}${componentJsx}`;
        }

        if (children?.length) {
            return `${todo}${indentSpace}<${tagName}${propsString}>
${childrenJsx}
${indentSpace}</${tagName}>`
        }

        return `${todo}${indentSpace}<${tagName}${propsString}/>`
    };

    const jsx = loop(virtualDom);
    let importsStrArray = [
        "import React, {Component} from 'react';",
        "import config from '@/commons/config-hoc';",
    ];
    if (imports?.length) {
        const tagNameDependence = {};
        imports.forEach(item => {
            const {tagName, dependence} = item;
            if (!tagNameDependence[dependence]) {
                tagNameDependence[dependence] = new Set();
            }
            tagNameDependence[dependence].add(tagName);
        });
        Object.keys(tagNameDependence).forEach(key => {
            const tagNames = Array.from(tagNameDependence[key]);
            importsStrArray.push(`import {${tagNames.join(', ')}} from '${key}';`);
        });
    }


    return {
        imports: `${importsStrArray.join('\n')}\n`,
        decorators: decorators.join('\n'),
        initStates: `${indentSpace}state = {\n${indentSpace2}${initStates.join(', \n' + indentSpace2)},\n${indentSpace}};\n`,
        attributes: `${indentSpace}${attributes.join('\n' + indentSpace)}`,
        methods: methods.join('\n'),
        states: `${indentSpace2}const {\n${indentSpace3}${states.join(', \n' + indentSpace3)},\n${indentSpace2}} = this.state;\n`,
        jsx,
    };
}

function getClassContent(options) {
    const {
        imports = '',
        decorators = '',
        initStates = '',
        attributes = '',
        methods = '',
        states = '',
        props = '',
        jsx = '',
        componentName = 'index',
    } = options;
    return `${imports}
${decorators}
export default class ${componentName} extends Component {
${initStates}
${attributes}
${methods}
    render() {
${props}${states}
        return (
${jsx}        
        );            
    }
}
    `;
}

const testVirtualDom = {
    __type: 'PageContent', // 节点组件类型
    __id: '1', // 节点的唯一标识
    children: [
        {
            __type: 'QueryBar',
            __id: '01',
            children: [
                {
                    __type: 'FormRow',
                    __id: uuid(),
                    children: [
                        {
                            __type: 'FormInput',
                            __id: uuid(),
                            label: '输入框',
                            style: {paddingLeft: 16},
                            width: '200px',
                        },
                        {
                            __type: 'FormSelect',
                            __id: uuid(),
                            type: 'select',
                            label: '下拉框',
                            style: {paddingLeft: 16},
                            width: '200px',
                            options: [
                                {value: '1', label: '下拉项1'},
                                {value: '2', label: '下拉项2'},
                            ],
                        },
                        {
                            __type: 'FormElement',
                            __id: uuid(),
                            layout: true,
                            style: {paddingLeft: 16},
                            width: 'auto',
                            children: [
                                {
                                    __type: 'Button',
                                    __id: uuid(),
                                    type: 'primary',
                                    style: {marginRight: 8},
                                    children: [
                                        {
                                            __type: 'text',
                                            __id: uuid(),
                                            content: '查询',
                                        }
                                    ],
                                },
                                {
                                    __type: 'Button',
                                    __id: uuid(),
                                    type: 'default',
                                    children: [
                                        {
                                            __type: 'text',
                                            __id: uuid(),
                                            content: '重置',
                                        }
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            __type: 'ToolBar',
            __id: '11',
            children: [
                {
                    __type: 'Button',
                    __id: '111',
                    children: [
                        {
                            __type: 'text',
                            __id: '1111',
                            content: '默认按钮',
                        }
                    ],
                },
                {
                    __type: 'Button',
                    __id: '112',
                    type: 'primary',
                    children: [
                        {
                            __type: 'text',
                            __id: '1121',
                            content: '主按钮',
                        }
                    ],
                },
                {
                    __type: 'Button',
                    __id: '113',
                    type: 'danger',
                    children: [
                        {
                            __type: 'text',
                            __id: '1131',
                            content: '危险按钮',
                        }
                    ],
                },
            ],
        },
        {
            __type: 'Table',
            __id: '12',
            total: 50,
            columns: [
                {title: '姓名', dataIndex: 'name', width: 100,},
                {title: '年龄', dataIndex: 'age', width: 100},
                {title: '操作', dataIndex: '__operator'},
            ],
            dataSource: [
                {name: 1, age: 2},
                {name: 1, age: 2},
                {name: 1, age: 2},
            ],
        },
    ],
};

console.log(getClassContent(virtualDomToString({virtualDom: testVirtualDom, path: '/test', fileName: 'test.jsx'})));
