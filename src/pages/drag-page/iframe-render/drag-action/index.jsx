import {useRef, useEffect} from 'react';
import {throttle} from 'lodash';
import {
    getDropPosition,
    isDropAccept,
    getNodeEle,
    getDroppableEle,
    setDragImage,
    handleNodeDrop,
    getDraggingNodeInfo,
} from 'src/pages/drag-page/util';

import {
    findNodeById,
} from 'src/pages/drag-page/node-util';

/**
 * 事件委托，统一添加事件，不给每个元素添加事件，提高性能
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */

export default function DragAction(props) {
    const {
        activeSideKey, // 左侧激活面板
        pageConfig,
        iframeDocument,
        draggingNode,
        dragPageAction,
        nodeSelectType,
        children,
    } = props;

    // 左侧key
    const prevSideKeyRef = useRef(null);

    function handleDragStart(e) {
        e.stopPropagation();
        const dragEle = e.target;

        if (!dragEle?.getAttribute) return;

        const componentId = dragEle.getAttribute('data-component-id');
        const node = findNodeById(pageConfig, componentId);
        if (!node) return;

        dragPageAction.setDraggingNode({
            id: node.id,
            nodeData: node,
        });
        prevSideKeyRef.current = activeSideKey;
        dragPageAction.setActiveSideKey('componentTree');

        setDragImage(e, node);
    }

    function handleDragLeave() {
        dragPageAction.setDragOverInfo(null);
    }

    function handleDragEnd(e) {
        e && e.stopPropagation();

        dragPageAction.setDragOverInfo(null);
        dragPageAction.setDraggingNode(null);
        if (prevSideKeyRef.current) {
            dragPageAction.setActiveSideKey(prevSideKeyRef.current);
            prevSideKeyRef.current = null;
        }
    }

    const THROTTLE_TIME = 50; // 如果卡顿，可以调整大一些
    const throttleOver = throttle((e) => {
        if (!draggingNode) return;
        const {toSelectTarget} = getDraggingNodeInfo({e, draggingNode});

        // 选择一个目标，非投放
        const targetElement = toSelectTarget ? getNodeEle(e.target) : getDroppableEle(e.target);

        if (!targetElement) return;

        const targetComponentId = targetElement.getAttribute('data-component-id');

        // 放在自身上
        if (draggingNode?.id === targetComponentId) return;

        const {pageX, pageY, clientX, clientY} = e;

        const position = getDropPosition({
            pageX,
            pageY,
            clientX,
            clientY,
            targetElement,
            frameDocument: iframeDocument,
        });

        if (!position) return;

        const accept = isDropAccept({
            e,
            draggingNode,
            pageConfig,
            targetComponentId,
            ...position,
        });

        if (!accept) {
            // e.dataTransfer.dropEffect = 'move';
            // e.dataTransfer.effectAllowed = 'copy';
            draggingNode.accept = false;
            dragPageAction.setDragOverInfo(null);
            return;
        }

        dragPageAction.setDragOverInfo({
            e,
            targetElement,
            targetElementId: targetComponentId,
            pageX,
            pageY,
            clientX,
            clientY,
            guidePosition: position.guidePosition,
            accept,
        });
    }, THROTTLE_TIME, {trailing: false});

    // 不要做任何导致当前页面render的操作，否则元素多了会很卡
    function handleDragOver(e) {
        e.stopPropagation();
        e.preventDefault();

        let cursor = 'move';

        const isCopy = draggingNode?.isNewAdd;
        if (isCopy) cursor = 'copy';

        const isToSetProps = draggingNode?.toSetProps;
        if (isToSetProps) cursor = 'link';

        e.dataTransfer.dropEffect = cursor;

        throttleOver(e);
    }

    function handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();

        const end = () => {
            handleDragLeave(e);
            handleDragEnd();
        };

        handleNodeDrop({
            e,
            iframeDocument,
            end,
            pageConfig,
            draggingNode,
            dragPageAction,
        });
    }

    function handleClick(e) {
        const ele = getNodeEle(e.target);
        if (!ele) return;

        const componentId = ele.getAttribute('data-component-id');

        if (nodeSelectType === 'meta' && (e.metaKey || e.ctrlKey)) {
            e.stopPropagation && e.stopPropagation();
            e.preventDefault && e.preventDefault();
            // 单纯选中节点，不进行其他操作
            dragPageAction.setSelectedNodeId(componentId);
        }

        // 单击模式
        if (nodeSelectType === 'click') {
            // e.stopPropagation && e.stopPropagation();
            // e.preventDefault && e.preventDefault();
            dragPageAction.setSelectedNodeId(componentId);
        }
    }

    function handleKeyDown(e) {
    }

    function handleKeyUp(e) {
    }

    useEffect(() => {
        if (!iframeDocument) return;
        iframeDocument.body.addEventListener('dragstart', handleDragStart);
        iframeDocument.body.addEventListener('dragover', handleDragOver);
        iframeDocument.body.addEventListener('dragleave', handleDragLeave);
        iframeDocument.body.addEventListener('dragend', handleDragEnd);
        iframeDocument.body.addEventListener('drop', handleDrop);
        iframeDocument.body.addEventListener('click', handleClick);
        iframeDocument.body.addEventListener('keydown', handleKeyDown);
        iframeDocument.body.addEventListener('keyup', handleKeyUp);

        return () => {
            iframeDocument.body.removeEventListener('dragstart', handleDragStart);
            iframeDocument.body.removeEventListener('dragover', handleDragOver);
            iframeDocument.body.removeEventListener('dragleave', handleDragLeave);
            iframeDocument.body.removeEventListener('dragend', handleDragEnd);
            iframeDocument.body.removeEventListener('drop', handleDrop);
            iframeDocument.body.removeEventListener('click', handleClick);
            iframeDocument.body.removeEventListener('keydown', handleKeyDown);
            iframeDocument.body.removeEventListener('keyup', handleKeyUp);
        };
    });

    return children;
};
