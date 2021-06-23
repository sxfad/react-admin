import React, {useState, useRef} from 'react';
import config from 'src/commons/config-hoc';
import {
    handleNodeDrop,
    getDropGuidePosition,
    isDropAccept,
    setDragImage,
    getDraggingNodeInfo,
} from 'src/pages/drag-page/util';
import {throttle} from 'lodash';
import classNames from 'classnames';

import styles from './style.less';

export default config({
    connect: state => {
        return {
            pageConfig: state.dragPage.pageConfig,
            draggingNode: state.dragPage.draggingNode,
            componentTreeExpendedKeys: state.dragPage.componentTreeExpendedKeys,
        };
    },
})(function TreeNode(props) {
    const {
        node,
        selectedKey,
        pageConfig,
        draggingNode,
        componentTreeExpendedKeys,
        action: {dragPage: dragPageAction},
    } = props;

    let {key, name, icon, isContainer, draggable, nodeData} = node;

    name = <span className={styles.nodeTitle}>{icon}{name}</span>;

    const hoverRef = useRef(0);
    const nodeRef = useRef(null);
    const [dragIn, setDragIn] = useState(false);
    const [accept, setAccept] = useState(true);
    const [dropPosition, setDropPosition] = useState('');

    function handleDragStart(e) {
        e.stopPropagation();

        if (!draggable) {
            e.preventDefault();
            return;
        }

        dragPageAction.setDraggingNode({
            id: nodeData.id,
            nodeData,
        });

        setDragImage(e, nodeData);
    }

    function handleDragEnter(e) {
        if (!draggable) return;

        if (draggingNode?.id === key) return;
        setDragIn(true);
        setAccept(true);
    }

    const THROTTLE_TIME = 100;
    const throttleOver = throttle(e => {
        const targetElement = e.target;

        if (!targetElement) return;

        if (draggingNode?.id === key) return;

        // 1s 后展开节点
        if (!hoverRef.current) {
            hoverRef.current = setTimeout(() => {
                if (!componentTreeExpendedKeys.some(k => k === key)) {
                    dragPageAction.setComponentTreeExpendedKeys([...componentTreeExpendedKeys, key]);
                }
            }, 300);
        }
        const {pageX, pageY, clientX, clientY} = e;

        const {position} = getDropGuidePosition({
            pageX,
            pageY,
            clientX,
            clientY,
            targetElement,
            frameDocument: window.document,
        });
        const {isTop, isBottom, isCenter} = position;

        const accept = isDropAccept({
            e,
            draggingNode,
            pageConfig,
            targetComponentId: key,
            isBefore: isTop,
            isAfter: isBottom,
            isChildren: isCenter,
        });

        // 如果父级是 wrapper_ ??

        setDropPosition('');
        setDragIn(true);
        setAccept(accept);

        if (!accept) {
            draggingNode.accept = accept;
            dragPageAction.setDragOverInfo(null);
            return;
        }

        dragPageAction.setDragOverInfo({
            e,
            targetElementId: key,
            isTree: true,
            isTop,
            isBottom,
            isCenter,
            accept,
        });

        if (isTop) setDropPosition('top');
        if (isBottom) setDropPosition('bottom');
        if (accept && isCenter) setDropPosition('center');

        const {toSelectTarget} = getDraggingNodeInfo({e, draggingNode});

        if (toSelectTarget) {
            setDropPosition(false);
        }
    }, THROTTLE_TIME, {trailing: false});

    function handleDragOver(e) {
        e.preventDefault();
        e.stopPropagation();

        let cursor = 'move';

        const isCopy = draggingNode?.isNewAdd;
        if (isCopy) cursor = 'copy';

        const isToSetProps = draggingNode?.toSetProps;
        if (isToSetProps) cursor = 'link';

        e.dataTransfer.dropEffect = cursor;

        if (!isToSetProps && !draggable) return;

        throttleOver(e);
    }

    function handleDragLeave(e) {
        setDragIn(false);
        setAccept(true);

        if (!draggable) return;

        dragPageAction.setDragOverInfo(null);

        if (hoverRef.current) {
            clearTimeout(hoverRef.current);
            hoverRef.current = 0;
        }
    }


    function handleDrop(e) {
        const end = () => {
            handleDragLeave(e);
            handleDragEnd();
        };

        if (!draggable) return end();

        e.preventDefault();
        e.stopPropagation();

        const iframeDocument = window.document;

        handleNodeDrop({
            e,
            iframeDocument,
            end,
            pageConfig,
            draggingNode,
            dragPageAction,
            isTree: true,
        });
    }

    function handleDragEnd() {
        setAccept(true);
        if (!draggable) return;
        if (hoverRef.current) {
            clearTimeout(hoverRef.current);
            hoverRef.current = 0;
        }
        dragPageAction.setDraggingNode(null);
        dragPageAction.setDragOverInfo(null);
    }

    const isSelected = selectedKey === key;
    const isDragging = draggingNode?.id === key;


    const positionMap = {
        top: '前',
        bottom: '后',
        center: '内',
    };
    return (
        <div
            ref={nodeRef}
            key={key}
            id={`treeNode_${key}`}
            className={[
                styles[dropPosition],
                {
                    [styles.treeNode]: true,
                    [styles.selected]: isSelected,
                    [styles.dragging]: isDragging,
                    [styles.dragIn]: dragIn && draggingNode,
                    [styles.unDraggable]: !draggable,
                    [styles.hasDraggingNode]: !!draggingNode,
                    [styles.unAccept]: !accept,
                },
            ]}
            draggable
            data-component-id={key}
            data-is-container={isContainer}
            onDragStart={handleDragStart}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onDragEnd={handleDragEnd}
        >
            {name}
            {dropPosition ? (
                <div className={styles.dragGuide} style={{display: dragIn && draggingNode ? 'flex' : 'none'}}>
                    <span>{positionMap[dropPosition]}</span>
                </div>
            ) : null}
        </div>
    );
});
