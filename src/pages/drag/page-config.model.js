import {addChild, deleteNode, updateNode, findNodeById, findParentById} from './virtual-dom';
import uuid from "uuid/v4";
import update from "immutability-helper";

export default {
    initialState: {
        // 所有页面配置数据，持久化的，从数据库中来。 {pageId: {config}, pageId: {config}}
        pageConfigs: {
            'demo-page': {
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
    },

    addPage: ({pageId, config}, state) => {
        const pageConfigs = {...state.pageConfigs};
        pageConfigs[pageId] = config;

        return {pageConfigs};
    },

    addChild: ({pageId, targetNodeId, childIndex, child}, state) => {
        const pageConfigs = {...state.pageConfigs};
        const config = {...pageConfigs[pageId]};

        addChild(config, targetNodeId, childIndex, child);
        pageConfigs[pageId] = config;

        return {pageConfigs};
    },

    deleteNode: ({pageId, targetNodeId}, state) => {
        const pageConfigs = {...state.pageConfigs};
        const config = {...pageConfigs[pageId]};

        deleteNode(config, targetNodeId);
        pageConfigs[pageId] = config;

        return {pageConfigs};
    },

    updateNode: ({pageId, node}, state) => {
        const pageConfigs = {...state.pageConfigs};
        const config = {...pageConfigs[pageId]};

        updateNode(config, node);
        pageConfigs[pageId] = config;

        return {pageConfigs};
    },

    findNodeById: ({pageId, targetNodeId}, state) => {
        const pageConfigs = {...state.pageConfigs};
        const config = {...pageConfigs[pageId]};

        findNodeById(config, targetNodeId);
        pageConfigs[pageId] = config;

        return {pageConfigs};
    },

    sort: ({pageId, dragId, dropId}, state) => {
        const pageConfigs = {...state.pageConfigs};
        const config = {...pageConfigs[pageId]};

        const parentNode = findParentById(config, dropId);
        let children = parentNode.children;
        const dragIndex = children.findIndex(item => item.__id === dragId);
        const dropIndex = children.findIndex(item => item.__id === dropId);
        const dragCard = children[dragIndex];

        children = update(children, {
            $splice: [[dragIndex, 1], [dropIndex, 0, dragCard]],
        });

        parentNode.children = children;

        pageConfigs[pageId] = config;

        return {pageConfigs};
    },
}
