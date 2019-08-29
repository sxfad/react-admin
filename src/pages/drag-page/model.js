import {appendChild, addChild, deleteNode, updateNode, findParentById, findNodeById} from './utils';
import {cloneDeep} from 'lodash';
import update from "immutability-helper";
import uuid from "uuid/v4";

// model 中不能引入components，否则会报错
// import components from "@/pages/drag-page/components";

const isEmpty = value => {
    return value === '' || value === null || value === void 0;
};

export default {
    initialState: {
        // 所有页面配置数据，持久化的，从数据库中来。
        pageConfig: {
            __type: 'PageContent', // 节点组件类型
            __id: '1', // 节点的唯一标识
            children: [
                {
                    __type: 'QueryBar',
                    __id: '01',
                    children: [
                        {
                            __type: 'FormRow',
                            __id: uuid(),
                            children: [
                                {
                                    __type: 'FormInput',
                                    __id: uuid(),
                                    label: '输入框',
                                    width: '200px',
                                },
                                {
                                    __type: 'FormSelect',
                                    __id: uuid(),
                                    type: 'select',
                                    label: '下拉框',
                                    width: '200px',
                                    options: [
                                        {value: '1', label: '下拉项1'},
                                        {value: '2', label: '下拉项2'},
                                    ],
                                },
                                {
                                    __type: 'FormElement',
                                    __id: uuid(),
                                    layout: true,
                                    width: 'auto',
                                    children: [
                                        {
                                            __type: 'Button',
                                            __id: uuid(),
                                            type: 'primary',
                                            children: [
                                                {
                                                    __type: 'text',
                                                    __id: uuid(),
                                                    content: '查询',
                                                }
                                            ],
                                        },
                                        {
                                            __type: 'Button',
                                            __id: uuid(),
                                            type: 'default',
                                            children: [
                                                {
                                                    __type: 'text',
                                                    __id: uuid(),
                                                    content: '重置',
                                                }
                                            ],
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
                {
                    __type: 'ToolBar',
                    __id: '11',
                    children: [
                        {
                            __type: 'Button',
                            __id: '111',
                            children: [
                                {
                                    __type: 'text',
                                    __id: '1111',
                                    content: '默认按钮',
                                }
                            ],
                        },
                        {
                            __type: 'Button',
                            __id: '112',
                            type: 'primary',
                            children: [
                                {
                                    __type: 'text',
                                    __id: '1121',
                                    content: '主按钮',
                                }
                            ],
                        },
                        {
                            __type: 'Button',
                            __id: '113',
                            type: 'danger',
                            children: [
                                {
                                    __type: 'text',
                                    __id: '1131',
                                    content: '危险按钮',
                                }
                            ],
                        },
                    ],
                },
            ],
        },
        currentId: null, // 当前点击选中的元素id
        currentNode: null,
        showGuideLine: true, // 是否显示辅助线
    },

    // 设置所有属性
    setProps: ({targetId, newProps, propsConfigs = []}, state) => {
        const config = cloneDeep(state.pageConfig);
        const node = findNodeById(config, targetId);

        const newNode = {...node, ...newProps};

        // 如果属性与默认属性相同或者为空，则删除
        Object.keys(newNode).forEach(key => {
            const propsConfig = propsConfigs.find(item => item.attribute === key);

            if (!propsConfig) return;

            const {defaultValue, allowEmpty} = propsConfig;
            const value = newNode[key];
            if (defaultValue === value) {
                Reflect.deleteProperty(newNode, key);
            }

            if (!allowEmpty && isEmpty(value)) {
                Reflect.deleteProperty(newNode, key);
            }
        });

        updateNode(config, newNode);

        return {pageConfig: config, currentNode: newNode};
        // return {pageConfig: config};
    },

    setGuideLine: showGuideLine => ({showGuideLine}),

    setCurrentId: (currentId, state) => {
        const currentNode = cloneDeep(findNodeById(state.pageConfig, currentId));
        return {currentId, currentNode};
    },

    setPageConfigs: (pageConfig) => ({pageConfig}),

    appendChild: ({targetId, child}, state) => {
        const config = cloneDeep(state.pageConfig);

        appendChild(config, targetId, cloneDeep(child));

        return {pageConfig: config};
    },

    addChild: ({targetId, childIndex, child}, state) => {
        const config = cloneDeep(state.pageConfig);

        addChild(config, targetId, childIndex, cloneDeep(child));

        return {pageConfig: config};
    },

    deleteNode: (targetId, state) => {
        const config = cloneDeep(state.pageConfig);

        deleteNode(config, targetId);

        return {pageConfig: config};
    },

    deleteNodeAndSelectOther: (targetId, state) => {
        const config = cloneDeep(state.pageConfig);
        const parentNode = findParentById(config, targetId);

        deleteNode(config, targetId);

        // 选中下一个节点
        let currentId = null;

        if (parentNode) {
            if (parentNode.children && parentNode.children.length) {
                currentId = parentNode.children[parentNode.children.length - 1].__id;
            } else {
                currentId = parentNode.__id;
            }
        }

        return {pageConfig: config, currentId};
    },

    updateNode: (node, state) => {
        const config = cloneDeep(state.pageConfig);

        updateNode(config, cloneDeep(node));

        return {pageConfig: config};
    },

    setContent: ({targetId, content}, state) => {
        const config = cloneDeep(state.pageConfig);
        const node = findNodeById(config, targetId);

        if (node && node.children && node.children.length === 1 && node.children[0].__type === 'text') {
            node.children[0].content = content;

            return {pageConfig: config, currentNode: {...node}};
        }
    },

    sort: ({dragId, hoverId}, state) => {
        const config = cloneDeep(state.pageConfig);

        const parentNode = findParentById(config, hoverId);
        let children = parentNode.children;
        const dragIndex = children.findIndex(item => item.__id === dragId);
        const dropIndex = children.findIndex(item => item.__id === hoverId);
        const dragCard = children[dragIndex];

        children = update(children, {
            $splice: [[dragIndex, 1], [dropIndex, 0, dragCard]],
        });

        parentNode.children = children;

        return {pageConfig: config};
    },
}
