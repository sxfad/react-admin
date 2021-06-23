import jp from 'jsonpath';
import {v4 as uuid} from 'uuid';

/**
 * 节点操作工具
 * 节点会出现的位置
 *
 *  对象属性 props.icon 为对象属性情况
 *  数组元素 children wrapper props.actions 等情况，都认为是数组
 *
 * */

function isObject(obj) {
    if (!obj) return false;
    if (Array.isArray(obj)) return false;

    return typeof obj === 'object';
}

/**
 * 递归 node 查找任意位置节点，children wrapper props等
 * @param node
 * @param cb 如果 返回值不是 undefined 结束递归
 */
export function loopNode(node, cb) {
    // 是节点，调用cb函数
    if (isNode(node)) {
        const result = cb(node);
        if (result !== undefined) return result;
    }

    // 是对象，递归对象所有的value
    if (isObject(node)) {
        const values = Object.values(node);

        if (values?.length) {
            for (const value of values) {

                const result = loopNode(value, cb);
                if (result !== undefined) return result;
            }
        }
    }

    // 是数组，递归数组所有的元素
    if (Array.isArray(node)) {
        if (node?.length) {
            for (const value of node) {
                const result = loopNode(value, cb);
                if (result !== undefined) return result;
            }
        }
    }
}

/**
 * 获取 id对应的node 在 root 中出现的 属性路径
 * @param root
 * @param id
 */
export function findNodeFieldPaths(root, id) {
    if (!id) return;

    let result = jp.paths(root, `$[?(@.id==='${id}')]`);
    if (!result?.length) result = jp.paths(root, `$..*[?(@.id==='${id}')]`);

    return result[0];
}

/**
 * 判断 obj 是否是节点
 * @param obj
 * @returns {boolean}
 */
export function isNode(obj) {
    if (!isObject(obj)) return false;

    return 'componentName' in obj;
}

/**
 * 根据id，查找节点
 * @param node
 * @param id
 * @returns {{}}
 */
export function findNodeById(node, id) {

    return loopNode(node, node => {
        if (node.id === id) return node;
    });
}

/**
 * 获取父节点，只根据children
 * @param root
 * @param id
 * @returns {{}}
 */
export function findParentNodeById(root, id) {
    const paths = findNodeFieldPaths(root, id);
    if (!paths) return null;
    const key1 = paths.pop();
    const key2 = paths.pop();

    if (/^\d+$/.test(key1) && key2 === 'children') {
        const result = jp.query(root, jp.stringify(paths));
        return result[0] || null;
    }
}

/**
 * 获取所有的父节点，只根据 children
 * @param root
 * @param id
 */
export function findParentNodes(root, id) {
    const data = Array.isArray(root) ? root : [root];

    // 深度遍历查找
    function dfs(data, id, parents) {
        for (let i = 0; i < data.length; i++) {
            const item = data[i];
            // 找到id则返回父级id
            if (item.id === id) return parents;
            // children不存在或为空则不递归
            if (!item.children || !item.children.length) continue;
            // 往下查找时将当前id入栈
            parents.push(item);

            if (dfs(item.children, id, parents).length) return parents;
            // 深度遍历查找未找到时当前id 出栈
            parents.pop();
        }
        // 未找到时返回空数组
        return [];
    }

    return dfs(data, id, []);
}

/**
 * 获取 名字为 componentName 的父节点，只根据 children
 * @param root
 * @param componentName
 * @param id
 */
export function findParentNodeByName(root, componentName, id) {
    const parentNode = findParentNodeById(root, id);

    if (!parentNode) return null;

    if (parentNode.componentName === componentName) return parentNode;

    return findParentNodeByName(root, componentName, parentNode.id);
}

/**
 * 获取 node 节点下所有 名字为 componentName 的节点，只根据 children
 * @param root
 * @param componentName
 */
export function findNodesByName(root, componentName) {
    const nodes = [];
    const loop = node => {
        if (node.componentName === componentName) {
            nodes.push(node);
        }

        if (node?.children?.length) {
            node.children.forEach(item => loop(item));
        }
    };

    root.children.forEach(item => loop(item));

    return nodes;
}

/**
 * 根据id，删除对应的节点
 * @param root
 * @param id
 * @returns {{}} 删除的节点
 */
export function deleteNodeById(root, id) {
    // 如果是 属性中的，删除属性
    // 如果是数组中的，删除后，数组为空，删除数组对应的属性

    const paths = findNodeFieldPaths(root, id);
    if (!paths) return null;

    const node = jp.query(root, jp.stringify(paths))[0];

    const key = paths.pop();

    const query = jp.stringify(paths);

    const result = jp.query(root, query)[0];

    if (Array.isArray(result)) {
        result.splice(key, 1);

    }
    if (isObject(result)) {
        Reflect.deleteProperty(result, key);
    }
    return node;

}

/**
 * 替换节点 将 targetNode 替换为 sourceNode
 * @param root
 * @param targetNode
 * @param sourceNode
 */
export function replaceNode(root, sourceNode, targetNode) {
    if (!root || !sourceNode?.id || !targetNode?.id) return;

    // sourceNode 有可能是别处移动过来的，先删掉
    deleteNodeById(root, sourceNode.id);

    const paths = findNodeFieldPaths(root, targetNode.id);
    if (!paths) return;
    const key = paths.pop();
    const result = jp.query(root, jp.stringify(paths));
    const node = result[0];
    if (node) node[key] = sourceNode;
}

/**
 * 获取 targetNode 所在的结合中，有可能是 wrapper children props.actions 等数组
 * @param root
 * @param id
 * @returns {*[]}
 */
export function findNodeCollection(root, id) {
    const paths = findNodeFieldPaths(root, id);
    if (!paths) return null;

    const key = paths.pop();
    if (/^\d+$/.test(key)) {
        const result = jp.query(root, jp.stringify(paths));

        return result[0];
    }
}

/**
 * 将 sourceNode 插入 targetNode之前
 * @param root
 * @param sourceNode
 * @param id
 */
export function insertBefore(root, sourceNode, id) {
    if (!sourceNode) return null;

    // 如果存在，先删除，相当于移动位置
    deleteNodeById(root, sourceNode.id);

    const paths = findNodeFieldPaths(root, id);
    if (!paths) return null;

    const key = paths.pop();
    if (/^\d+$/.test(key)) {
        const collection = jp.query(root, jp.stringify(paths))[0];
        collection.splice(key, 0, sourceNode);
    }
}

/**
 * 将 sourceNode 插入 targetNode之后
 * @param root
 * @param sourceNode
 * @param id
 */
export function insertAfter(root, sourceNode, id) {
    if (!sourceNode) return null;

    // 如果存在，先删除，相当于移动位置
    deleteNodeById(root, sourceNode.id);

    const paths = findNodeFieldPaths(root, id);
    if (!paths) return null;

    const key = paths.pop();
    if (/^\d+$/.test(key)) {
        const collection = jp.query(root, jp.stringify(paths))[0];
        collection.splice(key + 1, 0, sourceNode);
    }
}

/**
 * 将节点转换为源码
 * @param node
 * @returns {string}
 */
export function convertNodeToCode(node) {
    // TODO
    return '';
}

/**
 * 将源码转换为节点
 * @param code
 * @returns {{}}
 */
export function convertCodeToNode(code) {

    // TODO
    return {};
}

/**
 * 设置node节点id
 * @param node
 * @param force 强制设置，会覆盖已存在id
 */
export function setNodeId(node, force) {
    loopNode(node, node => {
        if (force) {
            node.id = uuid();
        } else {
            if (!node.id) node.id = uuid();
        }
    });
}

/**
 * 删除 node节点id
 * @param node
 */
export function deleteNodeId(node) {
    loopNode(node, node => {
        Reflect.deleteProperty(node, 'id');
    });
}
