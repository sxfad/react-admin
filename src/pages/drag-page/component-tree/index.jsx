import React, {useState, useEffect, useRef} from 'react';
import {Tree, Tooltip} from 'antd';
import {
    AppstoreOutlined,
    ShrinkOutlined,
    ArrowsAltOutlined,
} from '@ant-design/icons';
import config from 'src/commons/config-hoc';
import TreeNode from './TreeNode';
import {scrollElement} from '../util';
import {findParentNodes} from '../node-util';
import Pane from '../pane';

import {convertNodeToTreeData} from './util';

import styles from './style.less';

export default config({
    connect: state => {
        return {
            pageConfig: state.dragPage.pageConfig,
            draggingNode: state.dragPage.draggingNode,
            selectedNodeId: state.dragPage.selectedNodeId,
            componentTreeExpendedKeys: state.dragPage.componentTreeExpendedKeys,
            refreshProps: state.dragPage.refreshProps,
        };
    },
})(function ComponentTree(props) {
    const {
        pageConfig,
        selectedNodeId,
        componentTreeExpendedKeys,
        draggingNode,
        refreshProps,
        action: {dragPage: dragPageAction},
    } = props;

    const [treeData, setTreeData] = useState([]);
    const [nodeCount, setNodeCount] = useState(0);
    const [allKeys, setAllKeys] = useState([]);
    const [isAllExpanded, setIsAllExpanded] = useState(false);
    const mainRef = useRef(null);

    useEffect(() => {
        if (!pageConfig) return;
        const {treeData, nodeCount, allKeys} = convertNodeToTreeData(pageConfig);

        setTreeData([treeData]);
        setNodeCount(nodeCount);
        setAllKeys(allKeys);

    }, [pageConfig, refreshProps]);

    function handleSelected([key]) {
        if (!key) return;

        dragPageAction.setSelectedNodeId(key);
    }

    function renderNode(nodeData) {

        return <TreeNode selectedKey={selectedNodeId} node={nodeData}/>;
    }

    function handleExpand(keys) {
        dragPageAction.setComponentTreeExpendedKeys(keys);
    }

    // 当有节点选中，展开对应父节点
    useEffect(() => {
        if (!treeData?.length) {
            dragPageAction.setComponentTreeExpendedKeys([]);
            return;
        }
        const keys = findParentNodes(treeData[0], selectedNodeId).map(item => item.id) || [];
        // 去重
        const nextKeys = Array.from(new Set([...componentTreeExpendedKeys, ...keys, selectedNodeId]));

        dragPageAction.setComponentTreeExpendedKeys(nextKeys);
    }, [selectedNodeId, treeData]);

    // 当有节点选中，树滚动到相应位置
    useEffect(() => {
        const containerEle = mainRef.current;

        if (!containerEle) return;
        const element = containerEle.querySelector(`#treeNode_${selectedNodeId}`);

        if (element) return scrollElement(containerEle, element);

        // 等待树展开
        setTimeout(() => {
            const element = containerEle.querySelector(`#treeNode_${selectedNodeId}`);

            scrollElement(containerEle, element);
        }, 200);

    }, [selectedNodeId]);

    return (
        <Pane
            header={
                <div className={styles.header}>
                    <div>
                        <AppstoreOutlined style={{marginRight: 4}}/>
                        组件树({nodeCount})
                    </div>
                    <div>
                        <Tooltip placement="top" title={isAllExpanded ? '收起所有' : '展开所有'}>
                            <div
                                className={styles.tool}
                                onClick={() => {
                                    const nextKeys = isAllExpanded ? [] : allKeys;
                                    dragPageAction.setComponentTreeExpendedKeys(nextKeys);
                                    setIsAllExpanded(!isAllExpanded);
                                }}
                            >
                                {isAllExpanded ? <ShrinkOutlined/> : <ArrowsAltOutlined/>}
                            </div>
                        </Tooltip>
                    </div>
                </div>
            }
        >
            <div
                className={{
                    [styles.root]: true,
                    [styles.hasDraggingNode]: !!draggingNode,
                }}
                ref={mainRef}
            >
                <Tree
                    expandedKeys={componentTreeExpendedKeys}
                    onExpand={handleExpand}
                    blockNode

                    draggable
                    treeData={treeData}
                    titleRender={renderNode}

                    selectable
                    selectedKeys={[selectedNodeId]}
                    onSelect={handleSelected}
                />
            </div>
        </Pane>
    );
});
