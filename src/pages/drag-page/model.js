import {v4 as uuid} from 'uuid';
import {cloneDeep} from 'lodash';
import {getComponentConfig} from 'src/pages/drag-page/component-config';
import {
    syncObject,
} from './util';
import {
    insertAfter,
    insertBefore,
    setNodeId,
    findNodeById,
    findParentNodeById,
    findParentNodeByName,
    findNodesByName,
    deleteNodeById,
    replaceNode,
} from './node-util';

// 历史记录数量
const LIMIT = 20;

const rootHolderNode = () => ({id: uuid(), componentName: 'RootDragHolder'});
const rootPageNode = () => ({
    id: uuid(),
    componentName: 'PageContent',
    children: [
        {
            id: uuid(),
            componentName: 'DragHolder',
        },
    ],
});

const pageConfigInitialState = {
    draggingNode: null, // 正在拖动的节点 key
    dragOverInfo: null, // 悬停节点信息
    arrowLines: [
        {
            startX: 0,
            startY: 0,
            endX: 0,
            endY: 0,
            showEndPoint: false, // 显示结束点
        },
    ],
    showArrowLines: false,
    refreshArrowLines: null,
    refreshProps: null,
    pageConfigHistory: [],
    historyCursor: 0,
    selectedNodeId: null,
    selectedNode: null,
    pageConfig: rootHolderNode(),
};

const initialState = {
    menus: [],
    currentMenuKey: null,
    contentEditable: true,
    activeToolKey: 'layout', // 头部激活 key

    nodeSelectType: 'meta', // 画布上节点选中方式 click: 单击 or  meta: mate(ctrl) + 单击
    showCode: false, // 显示代码
    // showSide: false, // 左侧是否显示
    showSide: true,
    // activeSideKey: null, // 左侧激活key
    activeSideKey: 'componentStore',
    sideWidth: 300,
    // activeSideKey: 'schemaEditor',
    // activeTabKey: 'style', // 右侧激活tab key
    activeTabKey: 'props',
    componentTreeExpendedKeys: [], // 组件树 展开节点
    rightSideWidth: 385,
    rightSideExpended: true,
    canvasWidth: '100%', // 画布尺寸，指的是iframe尺寸
    canvasHeight: '100%',
    canvasScale: 100,
    iframeDocument: null,

    ...pageConfigInitialState,
};

const syncStorage = {
    showSide: true,
    sideWidth: true,
    rightSideWidth: true,
    rightSideExpended: true,
    canvasScale: true,
    // currentMenuKey: true,

    // contentEditable: true,
    // nodeSelectType: true,
    // canvasWidth: true,
    // canvasHeight: true,

    pageConfig: true,
    pageConfigHistory: true,
    historyCursor: true,
};

export default {
    initialState,
    syncStorage,
    initDesignPage: (options) => {
        let {pageConfig, ...others} = options;

        if (!pageConfig) pageConfig = rootPageNode();

        return {
            ...cloneDeep(pageConfigInitialState),
            ...others,
            pageConfig,
        };
    },
    setMenus: menus => ({menus}),
    setCurrentMenuKey: currentMenuKey => {
        return {currentMenuKey};
    },
    setSideWidth: sideWidth => ({sideWidth}),
    setContentEditable: contentEditable => ({contentEditable}),
    setArrowLines: arrowLines => ({arrowLines}),
    setShowArrowLines: (showArrowLines, state) => {

        if (showArrowLines === undefined) return {showArrowLines: !state.showArrowLines};

        return {showArrowLines};
    },
    setRefreshArrowLines: refreshArrowLines => ({refreshArrowLines}),
    showDraggingArrowLine: (options, state) => {
        const {arrowLines = []} = state;
        const index = arrowLines.findIndex(item => item.dragging);

        if (index > -1) arrowLines.splice(index, 1);

        if (options) {
            options.dragging = true;
            arrowLines.push(options);
        }

        return {arrowLines: [...arrowLines]};
    },
    setNodeSelectType: nodeSelectType => ({nodeSelectType}),
    setIFrameDocument: iframeDocument => ({iframeDocument}),
    setDragOverInfo: dragOverInfo => ({dragOverInfo}),
    setCanvasWidth: canvasWidth => ({canvasWidth}),
    setCanvasHeight: canvasHeight => ({canvasHeight}),
    setCanvasScale: canvasScale => ({canvasScale}),
    setRightSideExpended: rightSideExpended => ({rightSideExpended}),
    setRightSideWidth: rightSideWidth => ({rightSideWidth}),
    setComponentTreeExpendedKeys: componentTreeExpendedKeys => ({componentTreeExpendedKeys}),
    setDraggingNode: draggingNode => {
        const node = cloneDeep(draggingNode);

        if (node) {
            const componentConfig = getComponentConfig(node?.nodeData?.componentName);
            const {isWrapper, freezeIsWrapper} = componentConfig;

            if (!('isWrapper' in node)) node.isWrapper = isWrapper;
            if (!('freezeIsWrapper' in node)) node.freezeIsWrapper = freezeIsWrapper;
        }

        return {draggingNode: node};
    },
    setActiveTabKey: activeTabKey => {
        return {activeTabKey};
    },
    setActiveSideKey: (activeSideKey) => {
        if (!activeSideKey) return {activeSideKey, showSide: false};

        return {activeSideKey};
    },
    showSide: (showSide) => {
        return {showSide};
    },
    showCode: (showCode) => {
        return {showCode};
    },
    addPageConfigHistory: (pageConfig, state) => {
        const {historyCursor, pageConfigHistory} = state;

        const historyConfig = cloneDeep(pageConfig);

        let nextHistory = [];

        if (pageConfigHistory?.length) {
            nextHistory = pageConfigHistory.slice(0, historyCursor + 1);
        }

        nextHistory.push(historyConfig);

        if (nextHistory.length > LIMIT) nextHistory.shift();

        const nextCursor = nextHistory.length - 1;

        // console.log('addPageConfigHistory', nextHistory);

        return {pageConfigHistory: nextHistory, historyCursor: nextCursor};
    },
    prevStep: (_, state) => {
        const {pageConfigHistory, historyCursor, selectedNodeId} = state;

        let nextCursor = historyCursor - 1;

        if (nextCursor >= 0 && nextCursor < pageConfigHistory?.length) {

            const pageConfig = cloneDeep(pageConfigHistory[nextCursor]);

            const selectedNode = findNodeById(pageConfig, selectedNodeId);

            return {
                pageConfig,
                selectedNode,
                refreshProps: {},
                historyCursor: nextCursor,
            };
        }
    },
    nextStep: (_, state) => {
        const {pageConfigHistory, historyCursor, selectedNodeId} = state;

        let nextCursor = historyCursor + 1;

        if (nextCursor >= 0 && nextCursor <= pageConfigHistory?.length) {

            const pageConfig = cloneDeep(pageConfigHistory[nextCursor]);

            const selectedNode = findNodeById(pageConfig, selectedNodeId);

            return {
                pageConfig,
                selectedNode,
                historyCursor: nextCursor,
            };
        }
    },

    saveSchema: () => {
        // TODO
        console.log('TODO saveSchema');
    },
    save: () => {
        // TODO
        console.log('TODO save');
    },
    setActiveTookKey: activeToolKey => {
        return {activeToolKey};
    },
    // 不要写这样的代码
    // 这样调用 dragPageAction.setSelectedNode({...selectedNode})
    // 慎用，会使 selectedNode 脱离 pageConfig 导致意外bug
    setSelectedNode: selectedNode => ({selectedNode}),
    setSelectedNodeId: (selectedNodeId, state) => {
        let {pageConfig = []/*, activeSideKey*/} = state;

        const selectedNode = findNodeById(pageConfig, selectedNodeId);

        if (selectedNode?.componentName === 'RootDragHolder') {
            return {
                selectedNodeId: null,
                selectedNode: null,
            };
        }

        // const nextActiveKey = activeSideKey === 'schemaEditor' ? activeSideKey : 'componentTree';

        return {
            selectedNodeId,
            selectedNode,
            // activeSideKey: nextActiveKey,
        };
    },

    setNewProps: ({componentId, newProps = {}}, state) => {
        const {pageConfig} = state;

        const node = findNodeById(pageConfig, componentId);
        if (node) {
            if (!node.props) node.props = {};
            node.props = {
                ...node.props,
                ...newProps,
                // key: uuid(), // 设置新key，保证组件重新创建
            };
        }
        return {pageConfig: {...pageConfig}, refreshProps: {}};
    },
    syncOffspringProps: (options, state) => {
        const {pageConfig} = state;

        const {
            node, // 当前
            ancestorComponentName, // 祖先
            props, // 要同步的属性
        } = options;
        const {componentName} = node;

        // 祖先节点
        let ancestorNode = findParentNodeByName(pageConfig, ancestorComponentName, node.id);

        // 不存在，就从根节点开始
        if (!ancestorNode) ancestorNode = pageConfig;

        // 获取祖先下所有同名节点
        const nodes = findNodesByName(ancestorNode, componentName);

        // 设置新属性
        nodes.forEach(item => {
            if (!item.props) item.props = {};
            syncObject(item.props, props);
        });

        return {pageConfig: {...pageConfig}};
    },
    render: (refreshProps, state) => {
        const {pageConfig} = state;
        if (refreshProps) return {pageConfig: {...pageConfig}, refreshProps: {}};

        return {pageConfig: {...pageConfig}};
    },
    refreshProps: () => ({refreshProps: {}}),
    setPageConfig: pageConfig => {
        if (!pageConfig) {
            return {pageConfig: rootHolderNode()};
        }

        return {pageConfig};
    },
    deleteNodeById: (id, state) => {
        let {pageConfig, selectedNodeId, selectedNode} = state;

        if (selectedNodeId === id) {
            selectedNodeId = null;
            selectedNode = null;
        }

        // 删除的是根节点
        if (id === pageConfig.id) {
            return {pageConfig: rootHolderNode(), selectedNodeId, selectedNode};
        }

        const node = findNodeById(pageConfig, id);

        if (!node) return {selectedNode: null, selectedNodeId: null};

        const nodeConfig = getComponentConfig(node.componentName);

        const parentNode = findParentNodeById(pageConfig, id) || {};
        const parentNodeConfig = getComponentConfig(parentNode.componentName);

        const {beforeDelete, afterDelete} = nodeConfig.hooks || {};

        const {beforeDeleteChildren, afterDeleteChildren} = parentNodeConfig.hooks || {};

        const args = {node, targetNode: parentNode, pageConfig};
        const result = beforeDelete && beforeDelete(args);

        if (result === false) return {pageConfig};

        const pargs = {node: parentNode, targetNode: node, pageConfig};

        const res = beforeDeleteChildren && beforeDeleteChildren(pargs);

        if (res === false) return {pageConfig};

        const targetCollection = findChildrenCollection(pageConfig, id) || [];

        const deleteIndex = targetCollection.findIndex(item => item.id === id);

        deleteNodeById(pageConfig, id);

        // 添加占位符
        addDragHolder(parentNode);

        afterDelete && afterDelete(args);
        afterDeleteChildren && afterDeleteChildren({node: parentNode, targetNode: node});

        // 删空了，选择父级
        if (!targetCollection?.length) {
            selectedNodeId = parentNode.id;
            selectedNode = parentNode;
        } else {
            // 选择下一个兄弟节点
            const nextNode = targetCollection[deleteIndex];
            if (nextNode) {
                selectedNodeId = nextNode.id;
                selectedNode = nextNode;
            } else {
                // 选择上一个兄弟节点
                const prevNode = targetCollection[deleteIndex - 1];
                if (prevNode) {
                    selectedNodeId = prevNode.id;
                    selectedNode = prevNode;
                }
            }
        }

        return {pageConfig: {...pageConfig}, selectedNodeId, selectedNode};
    },
    moveWrapper: (options, state) => {
        const {pageConfig} = state;

        const {sourceId, targetId} = options;

        const sourceNode = deleteNodeById(pageConfig, sourceId);
        const targetNode = findNodeById(pageConfig, targetId);

        if (!targetNode) return;

        if (!targetNode?.wrapper?.length) targetNode.wrapper = [];

        targetNode.wrapper.push(sourceNode);


        return {pageConfig: {...pageConfig}, refreshProps: {}};
    },
    addWrapper: (options, state) => {
        const {pageConfig} = state;
        const {node, targetId} = options;

        // 新增节点，添加id
        setNodeId(node, true);

        const targetNode = findNodeById(pageConfig, targetId);

        if (!targetNode) return;

        if (!targetNode?.wrapper?.length) targetNode.wrapper = [];
        targetNode.wrapper.push(node);

        return {pageConfig: {...pageConfig}, refreshProps: {}};
    },
    moveReplace: (options, state) => {
        const {pageConfig} = state;

        const {sourceId, targetId} = options;

        const parentNode = findParentNodeById(pageConfig, sourceId);
        const sourceNode = deleteNodeById(pageConfig, sourceId);

        // 添加占位符
        addDragHolder(parentNode);

        const targetNode = findNodeById(pageConfig, targetId);

        replaceNode(pageConfig, sourceNode, targetNode);

        return {pageConfig: {...pageConfig}, refreshProps: {}};
    },
    addReplace: (options, state) => {
        const {pageConfig} = state;
        const {node: sourceNode, targetId} = options;

        // 新增节点，添加id
        setNodeId(sourceNode, true);

        const targetNode = findNodeById(pageConfig, targetId);

        replaceNode(pageConfig, sourceNode, targetNode);

        return {pageConfig: {...pageConfig}, refreshProps: {}};
    },
    addOrMoveNode: (options, state) => {
        const {pageConfig} = state;
        const {
            sourceNode,
            targetNodeId,
            isBefore,
            isAfter,
            isChildren,
        } = options;

        const isAdd = !findNodeById(pageConfig, sourceNode.id);
        const sourceNodeConfig = getComponentConfig(sourceNode.componentName);
        const {
            beforeAdd,
            afterAdd,
            beforeMove,
            afterMove,
        } = sourceNodeConfig.hooks || {};

        const sourceParentNode = findParentNodeById(pageConfig, sourceNode.id);

        const targetNode = findNodeById(pageConfig, targetNodeId);
        const targetNodeConfig = getComponentConfig(targetNode.componentName);

        const targetParentNode = findParentNodeById(pageConfig, targetNodeId);
        const targetParentNodeConfig = getComponentConfig(targetParentNode?.componentName);

        const args = {
            node: sourceNode,
            targetNode: isChildren ? targetNode : targetParentNode,
            pageConfig,
        };
        if (isAdd) {
            const res = beforeAdd && beforeAdd(args);
            if (res === false) return;
        } else {
            const res = beforeMove && beforeMove(args);
            if (res === false) return;
        }

        const afterAddOrRemove = ({pageConfig}) => {
            if (isAdd) {
                afterAdd && afterAdd({...args, pageConfig});
            } else {
                // 移动节点，父节点有可能移动空，尝试添加占位符
                addDragHolder(sourceParentNode);
                afterMove && afterMove({...args, pageConfig});
            }
        };

        // 目标节点为 根占位
        if (targetNode.componentName === 'RootDragHolder') {
            const result = {pageConfig: {...sourceNode}};

            afterAddOrRemove(result);

            return result;
        }

        if (isChildren) {
            const {beforeAddChildren, afterAddChildren} = targetNodeConfig.hooks || {};

            const args = {node: targetNode, targetNode: sourceNode, pageConfig};

            const res = beforeAddChildren && beforeAddChildren(args);
            if (res === false) return {pageConfig};

            // 删除原先位置的节点
            deleteNodeById(pageConfig, sourceNode.id);

            if (!targetNode?.children?.length) targetNode.children = [];
            targetNode.children.push(sourceNode);

            // 清除占位符
            if (targetNode.children?.length > 1) {
                targetNode.children = targetNode.children.filter(item => item.componentName !== 'DragHolder');
            }

            const result = {pageConfig: {...pageConfig}, refreshProps: {}};
            afterAddChildren && afterAddChildren({...args, ...result});
            afterAddOrRemove(result);

            return result;
        }

        if (isBefore || isAfter) {
            const {beforeAddChildren, afterAddChildren} = targetParentNodeConfig.hooks || {};
            const args = {node: targetParentNode, targetNode: sourceNode, pageConfig};
            const result = beforeAddChildren && beforeAddChildren(args);
            if (result === false) return;

            if (isBefore) {
                insertBefore(pageConfig, sourceNode, targetNodeId);
            } else if (isAfter) {
                insertAfter(pageConfig, sourceNode, targetNodeId);
            }

            // 清除占位符
            if (targetParentNode?.children?.length > 1) {
                targetParentNode.children = targetParentNode.children.filter(item => item.componentName !== 'DragHolder');
            }

            const res = {pageConfig: {...pageConfig}, refreshProps: {}};
            afterAddChildren && afterAddChildren({...args, ...res});
            afterAddOrRemove(res);

            return res;
        }
    },
};

/**
 * 获取id节点所在集合
 * @param root
 * @param id
 * @returns {*|null}
 */
function findChildrenCollection(root, id) {
    if (root.id === id) return null;

    if (!root.children) return null;

    if (root.children.some(item => item.id === id)) {
        return root.children;
    } else {
        for (let node of root.children) {
            const result = findChildrenCollection(node, id);
            if (result) return result;
        }
    }
}

// 添加占位符
function addDragHolder(node) {
    if (!node) return;

    const {componentName, children} = node;
    const nodeConfig = getComponentConfig(componentName);
    const {isContainer, withHolder, holderProps} = nodeConfig;

    if (isContainer && withHolder && !children?.length) {
        node.children = [
            {
                id: uuid(),
                componentName: 'DragHolder',
                props: {...holderProps},
            },
        ];
    }
}
