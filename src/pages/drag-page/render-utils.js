import React from "react";
import components from "./components";

export function renderNode(node, render, __parentId = '0', __parentDirection) {
    const {__id, __type, __level = 1000, children, content, ...others} = node;
    const com = components[__type];

    if (!com) {
        console.warn(`没有此类型组件：${__type}`);
        return null;
    }

    const {component: Component, direction, render: renderCom} = com;

    let resultCom = null;

    if (children && children.length) {
        const renderChildren = children.map((item, index) => {
            item.__level = __level * 10 + index;
            return renderNode(item, render, __id, direction);
        });

        if (renderCom) {
            resultCom = renderCom({key: __id, content, ...others, children: renderChildren});
        } else {
            resultCom = <Component key={__id} {...others}>{renderChildren}</Component>;
        }
    } else {
        if (renderCom) {
            resultCom = renderCom({key: __id, content, ...others});
        } else {
            resultCom = <Component key={__id}  {...others}/>;
        }
    }

    // 文字节点不可拖拽
    if (Component === 'text') return resultCom;

    return render(resultCom, {__id, __parentId, __parentDirection, level: __level, ...com});
}
