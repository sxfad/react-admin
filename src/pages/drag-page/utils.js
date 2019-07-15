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
    const loop = (node, parentNode) => {
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

export function findParentById(root, id) {
    const loop = node => {
        const {children} = node;
        if (children && children.length) {
            if (children.find(item => item.__id === id)) return node;
            for (let i = 0; i < children.length; i++) {
                const n = loop(children[i]);
                if (n) return n;
            }
        }

        return null;
    };

    return loop(root);
}



