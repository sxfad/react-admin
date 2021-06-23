import {cloneDeep} from 'lodash';
import {getComponentConfig, getComponentDisplayName} from 'src/pages/drag-page/component-config';
import {deleteNodeById, findNodeFieldPaths, loopNode} from 'src/pages/drag-page/node-util';

/**
 * 将节点转换为树结构数据
 * @param node
 * @returns {{allKeys: [], nodeCount: number, treeData: *}}
 */
export function convertNodeToTreeData(node) {

    const root = cloneDeep(node);
    let nodeCount = 0;
    const allKeys = [];

    const loop = node => {
        const {id, componentName, wrapper, name, props} = node;
        const nodeConfig = getComponentConfig(componentName);
        const {isContainer, draggable, icon} = nodeConfig;
        const componentDisplayName = getComponentDisplayName(node);
        const nodeData = cloneDeep(node);

        nodeCount++;
        allKeys.push(id);

        node.key = id;
        node.title = '';
        node.icon = icon;
        node.name = name || componentDisplayName;
        node.isContainer = isContainer;
        node.draggable = draggable;
        node.nodeData = nodeData;

        // 处理wrapper
        if (wrapper?.length) {

            // 删除 children
            wrapper.forEach(item => Reflect.deleteProperty(item, 'children'));

            const wrapperNode = {
                id: 'wrapper_' + id,
                name: 'wrapper',
                isContainer: true,
                draggable: false,
                children: wrapper,
            };
            if (!node?.children) node.children = [];
            node.children.unshift(wrapperNode);
        }

        // 处理props
        const result = [];

        while (true) {
            const r = loopNode(props, node => {
                const paths = findNodeFieldPaths(props, node.id);
                deleteNodeById(props, node.id);
                return [paths.join('.'), node];
            });

            if (r) {
                result.push(r);
            } else {
                break;
            }
        }

        if (result?.length) {
            if (!node.children) node.children = [];
            result.forEach(([key, item]) => {
                const componentDisplayName = getComponentDisplayName(item);
                const propsNode = {
                    ...item,
                    name: `${key}:${componentDisplayName}`,
                };
                node.children.unshift(propsNode);
            });
        }

        if (node?.children?.length) {
            node.children.forEach(item => loop(item));
        }
    };

    loop(root);

    return {treeData: root, allKeys, nodeCount};

    // wrapper isContainer true
    // props.actions isContainer true
    /*
    {
        key: node.id,
        id: node.id,
        title: '',
        name: node.componentDisplayName,
        isContainer: true,
        draggable: true,
        nodeData: node, // 这个不要加吧
        children: [
            {
                key: 'wrapper_' + node.id,
                id: 'wrapper_' + node.id,
                title: '',
                name: 'wrapper',
                isContainer: true,
                draggable: false,
                children: [...],
            },
            {
                key: 'icon_' + node.id,
                id: 'icon_' + node.id,
                title: '',
                name: 'icon:' + node.componentDisplayName
                isContainer: node.isContainer,
                draggable: node.isDraggable,
            },
            {
                // 深层展开
                key: 'field.field.field_' + node.id,
                id: 'field.field.field_' + node.id,
                title: '',
                name: 'field.field.field:' + node.componentDisplayName
                isContainer: node.isContainer,
                draggable: node.isDraggable,
            }
        ]

    }
    * */
    // TODO
}
