import React from "react";
import components from "./components";

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
        Component,
        componentProps: others,
        componentChildren: renderChildren,
        innerWrapper,
        ...com
    };

    return render(resultCom, options);
}
