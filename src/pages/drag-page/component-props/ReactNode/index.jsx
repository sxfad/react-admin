import React, {useState} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import config from 'src/commons/config-hoc';
import styles from './style.less';
import {findNodeById, deleteNodeById} from 'src/pages/drag-page/node-util';
import {getComponentConfig, getComponentDisplayName} from 'src/pages/drag-page/component-config';
import {action} from 'src/models';

const ReactNode = config({
    connect: state => {

        return {
            pageConfig: state.dragPage.pageConfig,
            draggingNode: state.dragPage.draggingNode,
        };
    },
})(props => {
    const {
        node,
        pageConfig,
        draggingNode,
        value,
        onChange,
        action: {dragPage: dragPageAction},
    } = props;

    const [dragIn, setDragIn] = useState(false);

    function handleDragEnter(e) {
        setDragIn(true);
    }

    function handleDragOver(e) {
        e.stopPropagation();
        e.preventDefault();
    }

    function handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();

        const {isNewAdd, nodeData} = draggingNode;
        const sourceNodeId = nodeData.id;

        setDragIn(false);
        dragPageAction.setDraggingNode(null);

        // 移动
        if (!isNewAdd) {
            // 拖过来的是 当前节点
            if (sourceNodeId === node.id) return;

            const sourceNode = findNodeById(pageConfig, sourceNodeId);
            // 拖过来的是当前节点的父级

            if (findNodeById(sourceNode, node.id)) return;

            // 删除拖过来的节点
            deleteNodeById(pageConfig, sourceNodeId);

            const {dragPage: dragPageAction} = action;
            dragPageAction.render(true);

            // 等待属性改变完成，右侧表单更新
            setTimeout(() => onChange(sourceNode));
        }

        // 新增
        if (isNewAdd) {
            onChange(nodeData);
        }
    }

    function handleDragLeave(e) {
        setDragIn(false);
    }

    function handleClick(e) {
        if (value?.id) {
            dragPageAction.setSelectedNodeId(value.id);
        }
    }

    const cls = classNames({
        [styles.root]: true,
        [styles.dragIn]: dragIn,
    });

    const currentName = getComponentDisplayName(value);
    let icon = getComponentConfig(value?.componentName).icon;
    const placeholder = currentName ? <span>当前：{icon} {currentName}</span> : '请拖入组件';

    return (
        <div
            className={cls}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={handleClick}
        >
            {placeholder}
        </div>
    );
});

ReactNode.propTypes = {
    value: PropTypes.object,
    onChange: PropTypes.func,
};

export default ReactNode;
