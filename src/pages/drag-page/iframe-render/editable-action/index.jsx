import {useEffect} from 'react';
import {getComponentConfig} from 'src/pages/drag-page/component-config';
import {debounce} from 'lodash';
import {v4 as uuid} from 'uuid';
import {/*isNode,*/ loopNode} from 'src/pages/drag-page/node-util';
// import {getTextFromClipboard} from 'src/pages/drag-page/util';

export default function EditableAction(props) {
    const {
        pageConfig,
        iframeDocument,
        dragPageAction,
    } = props;

    const loop = cb => loopNode(pageConfig, node => {
        const componentId = node.id;
        const className = `id_${componentId}`;
        const nodeConfig = getComponentConfig(node.componentName);
        const {editableContents} = nodeConfig;
        if (editableContents?.length) {
            editableContents.forEach(item => {
                let {selector} = item;

                let elements;
                if (selector) {
                    if (typeof selector === 'function') {
                        elements = iframeDocument.querySelectorAll(selector({node, pageConfig}));
                    } else {
                        elements = iframeDocument.querySelectorAll(`.${className} ${selector}`);
                    }
                } else {
                    elements = iframeDocument.querySelectorAll(`.${className}`);
                }

                if (!elements?.length) return;

                elements.forEach((ele, index) => cb({elements, ele, index, node, item}));
            });
        }
    });

    useEffect(() => {
        if (!iframeDocument) return;

        const actions = {};

        let tabIndex = 1000;
        loop(({elements, ele, index, node, item}) => {
            // 如果没有纯文本节点，直接返回
            const hasText = Array.from(ele.childNodes).some(node => node.nodeType === Node.TEXT_NODE);
            if (!hasText) return;

            let {onInput, onBlur, onClick, propsField} = item;
            tabIndex++;

            let handleInput = () => undefined;

            if (propsField) {
                handleInput = (e) => {
                    // 多个，说明设置的是子节点
                    if (!node.props) node.props = {};
                    let props = node.props;
                    if (elements.length > 1 && node.children?.length) {
                        const childNode = node.children[index];
                        if (!childNode.props) childNode.props = {};
                        props = childNode.props;
                    }

                    if (!props[propsField] || typeof props[propsField] !== 'object') {
                        props[propsField] = e.target.innerText.trim();
                    }
                };
            }

            // 只能输入纯文本
            // ele.style.webkitUserModify = 'read-write-plaintext-only';

            ele.setAttribute('contenteditable', 'plaintext-only');
            ele.setAttribute('tabindex', tabIndex);
            // 清除 元素 focus 样式
            const prevOutline = window.getComputedStyle(ele).outline;
            const prevStyleOutline = ele.style.outline;

            const options = {index, node, pageConfig, dragPageAction, iframeDocument};

            function handleClick(e) {
                e.preventDefault();
                onClick && onClick(e)(options);
            }

            function handleFocus(e) {
                ele.style.outline = prevOutline;

                // 获取焦点之后，选中所有文本
                const iframe = document.getElementById('dnd-iframe');
                const contentWindow = iframe.contentWindow;

                if (iframeDocument.selection) {
                    const range = iframeDocument.body.createTextRange();
                    range.moveToElementText(e.target);
                    range.select();
                } else if (contentWindow.getSelection) {
                    const range = iframeDocument.createRange();
                    range.selectNodeContents(e.target);
                    contentWindow.getSelection().removeAllRanges();
                    contentWindow.getSelection().addRange(range);
                }
            }

            let changed = false;
            const handleInputDebounce = debounce(e => {
                if (onInput) {
                    onInput(e)(options);
                } else {
                    handleInput(e);
                }
                changed = true;
            }, 300);

            function handleBlur(e) {
                ele.style.outline = prevStyleOutline;
                if (onBlur) {
                    onBlur(e)(options);
                }

                // 失去焦点，如果有改变内容，触发渲染
                if (changed) {
                    dragPageAction.render(true);
                    changed = false;
                }
            }

            async function handleKeydown(e) {
                // const {key, metaKey, ctrlKey} = e;
                // const mc = metaKey || ctrlKey;
                // if (mc && key === 'v') {
                //     e.preventDefault();
                //     try {
                //         const text = await getTextFromClipboard();
                //         const cloneNode = JSON.parse(text);
                //         console.log(cloneNode);
                //         // 是节点
                //         if (isNode(cloneNode)) {
                //             e.preventDefault();
                //         }
                //     } catch (e) {
                //
                //     }
                // }
            }

            const eventMap = {
                click: handleClick,
                focus: handleFocus,
                input: handleInputDebounce,
                blur: handleBlur,
                keydown: handleKeydown,
            };

            Object.entries(eventMap)
                .forEach(([action, handler]) => {
                    ele.addEventListener(action, handler);
                });

            const actionKey = uuid();
            ele.setAttribute('data-actionKey', actionKey);

            actions[actionKey] = eventMap;
        });
        return () => {
            loop(({ele}) => {
                // ele.style.userModify = '';
                ele.removeAttribute('contenteditable');
                ele.removeAttribute('tabindex');
                const actionKey = ele.getAttribute('data-actionKey');

                const eventMap = actions[actionKey] || {};

                Object.entries(eventMap)
                    .forEach(([action, handler]) => {
                        ele.removeEventListener(action, handler);
                    });
            });
        };
    }, [
        pageConfig,
        iframeDocument,
    ]);

    return null;
}
