import React, {createElement} from 'react';
import classNames from 'classnames';
import {getComponent, isFunctionString, getFieldOption} from '../../util';
import {isNode} from 'src/pages/drag-page/node-util';
import {getComponentDisplayName, getComponentConfig} from 'src/pages/drag-page/component-config';
import {cloneDeep} from 'lodash';
import styles from './style.less';

function getDragInfo(options) {
    const {config, selectedNodeId, draggingNode} = options;
    const {componentName, id: componentId} = config;
    const componentConfig = getComponentConfig(componentName);

    let {
        draggable,
        isContainer,
    } = componentConfig;

    const componentDisplayName = getComponentDisplayName(config);

    const dragClassName = classNames({
        [`id_${componentId}`]: true,
    });

    const dragProps = {
        draggable,
        'data-component-display-name': componentDisplayName,
        'data-component-id': componentId,
        'data-is-container': isContainer,

        // 控制样式，将相关样式通过属性控制，可以解决有些组件className被修改，样式丢失问题，比如 Tabs.Panel
        'data-draggable-element': true,
        'data-draggable-selected': selectedNodeId === componentId,
        'data-draggable-dragging': draggingNode?.id === componentId,
        'data-draggable-un-draggable': !draggable,
    };

    return {dragProps, dragClassName};
}

export default function NodeRender(props) {
    let {
        config,
        pageConfig,
        selectedNodeId,
        draggingNode,
        dragPageAction,
        activeSideKey, // 左侧激活面板
        nodeSelectType, // 节点选中方式
        iframeDocument,
        isPreview = true,
        state,
        contentEditable,
        ...others
    } = props;

    if (!config) return null;

    if (typeof config !== 'object' || Array.isArray(config)) return config;

    let {
        wrapper,
        componentName,
        children,
        props: componentProps,
    } = config;

    if (!componentName) return null;

    // 预览模式不显示DragHolder
    if (isPreview && componentName === 'DragHolder') return null;

    const componentConfig = getComponentConfig(componentName);

    let {
        render,
        // withWrapper,
        // wrapperStyle = {},
        actions = {},
        childrenDraggable,
        hooks = {},
        withDragProps,
        // fields,
    } = componentConfig;

    componentProps = cloneDeep(componentProps || {});
    if (!componentProps.className) componentProps.className = '';

    const isRender = hooks.beforeRender && hooks.beforeRender({
        node: config,
        props: componentProps,
        dragPageAction,
        iframeDocument,
        NodeRender,
        renderProps: props,
    });

    if (isRender === false) return null;
    if (render === false) return null;

    const component = getComponent(config).component;


    const loop = (obj, cb) => {
        if (typeof obj !== 'object' || obj === null) return;

        if (Array.isArray(obj)) {
            obj.forEach(item => loop(item, cb));
        } else {
            Object.entries(obj)
                .forEach(([key, value]) => {
                    if (typeof value === 'object' && !isNode(value)) {
                        loop(value, cb);
                    } else {
                        cb(obj, key, value);
                    }
                });
        }
    };

    loop(componentProps, (obj, key, value) => {
        // 属性中的state数据处理
        if (typeof value === 'string' && value.startsWith('state.')) {
            try {
                // eslint-disable-next-line
                obj[key] = eval(value);
            } catch (e) {
                console.error(e);
            }
        }

        const fieldOption = getFieldOption(config, key);

        // 字段是函数类型
        if (fieldOption?.functionType) {
            if (isNode(value)) {
                obj[key] = () => (
                    <NodeRender
                        {..._props}
                        config={value}
                    />
                );
            } else {
                obj[key] = () => value;
            }
        }

        // 属性中的函数
        if (isFunctionString(value)) {
            let fn;
            try {
                // eslint-disable-next-line
                eval(`fn = ${value}`);

                if (typeof fn === 'function') {
                    obj[key] = fn;
                }
            } catch (e) {
                console.error(e);
            }
        }
    });

    const {dragClassName, dragProps} = getDragInfo({config, selectedNodeId, draggingNode});

    const _props = Object.entries(props).reduce((prev, curr) => {
        const [key, value] = curr;

        if (!Object.keys(others).includes(key)) {
            prev[key] = value;
        }

        return prev;
    }, {});

    // 处理属性中的节点
    Object.entries(componentProps)
        .filter(([, value]) => isNode(value) || (Array.isArray(value) && value.every(item => isNode(item))))
        .forEach(([key, value]) => {
            if (Array.isArray(value)) {
                componentProps[key] = value.map(item => {
                    return (
                        <NodeRender
                            {..._props}
                            config={item}
                        />
                    );
                });
            } else {
                componentProps[key] = (
                    <NodeRender
                        {..._props}
                        config={value}
                    />
                );
            }
        });

    // 处理子节点
    let childrenEle = children?.length ? children.map(item => {
        const childrenIsPreview = isPreview || !childrenDraggable;

        // 比较特殊，需要作为父级的直接子节点，不能使用 NodeRender
        if (['Tabs.TabPane'].includes(item.componentName)) {
            const itemConfig = getComponentConfig(item.componentName);
            let {hooks = {}, withDragProps} = itemConfig;
            const {dragClassName, dragProps} = getDragInfo({config: item, selectedNodeId, draggingNode});
            const isRender = hooks.beforeRender && hooks.beforeRender({node: item, dragPageAction, iframeDocument});

            if (isRender === false) return null;

            if (hooks.afterRender) {
                setTimeout(() => {
                    hooks.afterRender({
                        node: item,
                        iframeDocument,
                        dragProps: withDragProps ? dragProps : {},
                        dragClassName,
                        dragPageAction,
                        pageConfig,
                        styles,
                        isPreview: childrenIsPreview,
                    });
                });
            }

            const Component = getComponent(item).component;
            return (
                <Component {...dragProps} {...item.props}>

                    {item?.children?.map(it => {
                        return (
                            <NodeRender
                                {..._props}
                                config={it}
                                isPreview={childrenIsPreview}
                            />
                        );
                    })}

                </Component>
            );
        }

        return (
            <NodeRender
                {..._props}
                config={item}
                isPreview={childrenIsPreview}
            />
        );
    }) : undefined;

    // Form.Item 会用到
    if (childrenEle?.length === 1) childrenEle = childrenEle[0];

    // 处理当前节点上的包装节点
    if (wrapper?.length) {
        wrapper = cloneDeep(wrapper);

        wrapper[0].children = [{...config, wrapper: null}];

        const nextConfig = wrapper.reduce((prev, wrapperConfig) => {
            wrapperConfig.children = [prev];

            return wrapperConfig;
        });

        return (
            <NodeRender
                {..._props}
                config={nextConfig}
            />
        );
    }

    // 组件配置中定义的事件
    const componentActions = Object.entries(actions)
        .reduce((prev, curr) => {
            const [key, value] = curr;
            prev[key] = (...args) => value(...args)({
                pageConfig,
                dragPageAction,
                node: config,
            });
            return prev;
        }, {});
    const commonProps = {
        ...others,
        children: childrenEle,
        ...componentActions,
    };

    if (hooks.afterRender) {
        setTimeout(() => {
            hooks.afterRender({
                node: config,
                iframeDocument,
                dragProps,
                dragClassName,
                dragPageAction,
                styles,
                isPreview,
            });
        });
    }

    if (isPreview) {
        return createElement(component, {
            ...commonProps,
            ...componentProps,
            className: [dragClassName, componentProps.className].join(' '),
        });
    }
    /*
    if (withWrapper) {
        let {style = {}} = componentProps;
        const wStyle = {...wrapperStyle};

        style = {...style}; // 浅拷贝一份 有可能会修改

        // 同步到 wrapper 的样式
        const syncTopWStyle = [
            'display',
            'width',
            'height',
        ];

        // 移动到 wrapper上的样式
        const removeTopWStyle = [
            'marginTop',
            'marginRight',
            'marginBottom',
            'marginLeft',
        ];

        syncTopWStyle.forEach(key => {
            if (!(key in style)) return;

            wStyle[key] = style[key];
        });

        removeTopWStyle.forEach(key => {
            if (!(key in style)) return;

            wStyle[key] = style[key];
            style[key] = undefined;
        });

        return createElement('div', {
            ...dragProps,
            className: dragClassName + ' dragWrapper',
            style: wStyle,
            children: [
                createElement(component, {
                    ...commonProps,
                    ...componentProps,
                    style,
                }),
            ],
        });
    }
*/

    return createElement(component, {
        ...commonProps,
        ...componentProps,
        ...(withDragProps ? dragProps : {}),
        className: [dragClassName, componentProps.className].join(' '),
    });
}

