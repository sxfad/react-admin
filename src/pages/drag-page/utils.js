import {isPlainObject, isArray} from 'lodash';

/**
 * 向目标节点中添加一个子节点
 * @param root 中体树状结构数据
 * @param targetId
 * @param childIndex
 * @param child
 */
export function addChild(root, targetId, childIndex, child) {
    const targetNode = findNodeById(root, targetId);
    if (targetNode) {
        let {children} = targetNode;
        if (!children) children = [];
        children.splice(childIndex, 0, child);

        targetNode.children = children;
    }
}

export function appendChild(root, targetId, child) {
    const targetNode = findNodeById(root, targetId);
    if (targetNode) {
        let {children} = targetNode;
        if (!children) children = [];

        const childIndex = children.length;
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

    const newKeys = Object.keys(node);
    const oldKeys = Object.keys(n);

    // 删除不存在元素
    oldKeys.forEach(key => {
        if (!newKeys.includes(key)) {
            Reflect.deleteProperty(n, key);
        }
    });

    newKeys.forEach(key => {
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

export function findSiblingsById(root, id) {
    const parent = findParentById(root, id);
    return parent?.children;
}

export const INDENT_SPACE = 4;

export function getIndentSpace(indent) {
    return Array.from({length: indent + 1}).join(' ');
}

/**
 * 获取属性字符串
 * @param props
 * @param indent
 * @returns {string}
 */
export function propsToString(props, indent = INDENT_SPACE, isSingleLine = false) {
    const indentSpace = getIndentSpace(indent);
    const finallyIndentSpace = getIndentSpace(indent - INDENT_SPACE);

    // 属性单独占用一行
    let propsArr = Object.keys(props || {}).map(key => {
        const value = props[key];

        // 值为true的属性，直接填写属性值即可
        if (value === true) return `${key}`;

        const valueStr = valueToString(value, indent);

        if (typeof value === 'string') return `${key}=${valueStr}`;

        // 如果是对象 进行格式化，并去掉属性的双引号
        if (isPlainObject(value) || isArray(value)) {
            isSingleLine = true;
        }

        return `${key}={${valueStr}}`;
    });

    if (propsArr?.length > 3 || isSingleLine) {
        return `\n${indentSpace}${propsArr.join('\n' + indentSpace)}\n${finallyIndentSpace}`;
    }

    return propsArr?.length ? ` ${propsArr.join(' ')}` : '';
}


export function valueToString(value, indent = INDENT_SPACE) {
    const indentSpace = getIndentSpace(indent);
    const valueStr = JSON.stringify(value);

    // 值为字符串，直接写入，不添加{}
    if (typeof value === 'string') {
        if (value.indexOf('this.state') > -1) return `{${value.replace('this.state.', '')}}`;

        if (value.indexOf('this.props') > -1) return `{${value.replace('this.props.', '')}}`;

        if (value.indexOf('this') > -1) return `{${value}}`;
        return valueStr;
    }

    // 如果是对象 进行格式化，并去掉属性的双引号
    if (isPlainObject(value) || isArray(value)) {
        // space上线为10
        let valueStr = JSON.stringify(value, null, INDENT_SPACE);
        valueStr = valueStr
            .split('\n')
            .map(item => {
                return item
                    .replace('"', '')
                    .replace('":', ':')
                    .replace('"', "'")
                    .replace('"', "'");
            })
            .join(`\n${indentSpace}`);
        return valueStr;
    }

    return valueStr;
}
