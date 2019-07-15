import {addChild, deleteNode, updateNode, findParentById} from './utils';
import uuid from "uuid/v4";
import {cloneDeep} from 'lodash';
import update from "immutability-helper";

export default {
    initialState: {
        // 所有页面配置数据，持久化的，从数据库中来。
        pageConfig: {
            __type: 'PageContent', // 节点组件类型
            __id: uuid(), // 节点的唯一标识
            children: [
                {
                    __type: 'ToolBar',
                    __id: uuid(),
                    children: [
                        {
                            __type: 'Button',
                            __id: uuid(),
                            children: [
                                {
                                    __type: 'text',
                                    __id: uuid(),
                                    content: '默认按钮',
                                }
                            ],
                        },
                        {
                            __type: 'ButtonPrimary',
                            __id: uuid(),
                            type: 'primary',
                            children: [
                                {
                                    __type: 'text',
                                    __id: uuid(),
                                    content: '主按钮',
                                }
                            ],
                        },
                    ],
                },
                {
                    __type: 'div',
                    __id: uuid(),
                    children: [
                        {
                            __type: 'text', // 临时容器，元素投放使用，不实际渲染成节点
                            __id: uuid(),
                            content: '文字节点内容',
                        },
                    ],
                },
            ],
        }
    },

    setPageConfigs: (pageConfig) => ({pageConfig}),

    addChild: ({targetNodeId, childIndex, child}, state) => {
        const config = cloneDeep(state.pageConfig);

        addChild(config, targetNodeId, childIndex, cloneDeep(child));

        return {pageConfig: config};
    },

    deleteNode: (targetNodeId, state) => {
        const config = cloneDeep(state.pageConfig);

        deleteNode(config, targetNodeId);

        return {pageConfig: config};
    },

    updateNode: (node, state) => {
        const config = cloneDeep(state.pageConfig);

        updateNode(config, cloneDeep(node));

        return {pageConfig: config};
    },

    sort: ({pageId, dragId, dropId}, state) => {
        const config = cloneDeep(state.pageConfig);

        const parentNode = findParentById(config, dropId);
        let children = parentNode.children;
        const dragIndex = children.findIndex(item => item.__id === dragId);
        const dropIndex = children.findIndex(item => item.__id === dropId);
        const dragCard = children[dragIndex];

        children = update(children, {
            $splice: [[dragIndex, 1], [dropIndex, 0, dragCard]],
        });

        parentNode.children = children;

        return {pageConfig: config};
    },
}
