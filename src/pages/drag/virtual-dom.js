import React from 'react';
import uuid from 'uuid/v4';

/**
 * 标准json数据，需要转成字符串，存储数据库
 * 虚拟 dom结构，用于生成实时页面、源码文件
 *
 * '__'开头的为自定义属性，children为子节点，其他都为组件属性
 *
 * */
const demo = {
    __type: 'div', // 节点组件类型
    __id: uuid(), // 节点的唯一标识
    style: {},
    children: [
        {
            __type: 'button',
            __id: uuid(),
        },
        {
            __type: 'UserSelect', // 自定义组件
            __id: uuid(),
            placeholder: '请选择用户',
        },
        {
            __type: 'tabs',
            __id: uuid(),
            children: [
                {
                    __type: 'temporary-container', // 临时容器，元素投放使用，不实际渲染成节点
                    __id: uuid(),
                },
            ],
        },
    ],
};

// export function render(node) {
//     const {__type, __id, children, content, ...others} = node;
//     const com = components[__type];
//
//     if (!com) return null; // fixme 更多提示？
//
//     const {component: Component} = components[__type];
//
//     if (children && children.length) {
//         const renderChildren = children.map(item => render(item));
//
//         if (Component === 'div') {
//             return <div key={__id} {...others}>{renderChildren}</div>
//         }
//
//         return <Component key={__id} {...others}>{renderChildren}</Component>
//     } else {
//
//         if (Component === 'div') return <div key={__id} {...others}/>;
//
//         if (Component === 'text') return content;
//
//         return <Component key={__id} {...others}/>
//     }
// }

/**
 * 向目标节点中添加一个子节点
 * @param root 中体树状结构数据
 * @param targetNodeId
 * @param childIndex
 * @param child
 */
export function addChild(root, targetNodeId, childIndex, child) {
    const targetNode = findNodeById(root, targetNodeId);
    if (targetNode) {
        let {children} = targetNode;
        if (!children) children = [];
        children.splice(childIndex, 0, child);

        targetNode.children = children;
    }
}

export function deleteNode(root, id) {
    const loop = (node, parentNode = {}) => {
        const {__id, children} = node;

        if (__id === id && parentNode) {
            parentNode.children = parentNode.children.filter(item => item.__id !== id);
            if (!parentNode.children.length) Reflect.deleteProperty(parentNode, 'children');
            return;
        }

        if (children && children.length) {
            children.forEach(item => {
                loop(item, node);
            })
        }
    };

    loop(root);
}

export function updateNode(root, node) {
    const {__id} = node;
    const n = findNodeById(root, __id);

    Object.keys(node).forEach(key => {
        n[key] = node[key];
    });
}

export function findNodeById(root, id) {
    const loop = node => {
        const {__id, children} = node;

        if (__id === id) return node;

        if (children && children.length) {
            for (let i = 0; i < children.length; i++) {
                const n = loop(children[i]);
                if (n) return n;
            }
        }
        return null;
    };

    return loop(root);
}



