import {useEffect, useRef} from 'react';
import config from 'src/commons/config-hoc';
import styles from './style.less';
import {
    getDropGuidePosition,
    LINE_SIZE,
    /*TRIGGER_SIZE,*/
    usePrevious,
    getDraggingNodeInfo,
} from 'src/pages/drag-page/util';

export default config({
    connect: state => {
        return {
            dragOverInfo: state.dragPage.dragOverInfo,
            draggingNode: state.dragPage.draggingNode,
            iframeDocument: state.dragPage.iframeDocument,
        };
    },
})(function DragOver(props) {
    const {
        dragOverInfo,
        draggingNode,
        iframeDocument,
    } = props;
    const guideLineRef = useRef(null);
    const guideBgRef = useRef(null);
    const timeRef = useRef(0);
    const prevDragOverInfo = usePrevious(dragOverInfo);

    useEffect(() => {
        if (!iframeDocument) return;

        guideLineRef.current = iframeDocument.getElementById('drop-guide-line');
        guideBgRef.current = iframeDocument.getElementById('drop-guide-bg');
    }, [iframeDocument]);

    useEffect(() => {
        if (!guideLineRef.current) return;

        if (dragOverInfo) {
            let {
                e,
                targetElement,
                guidePosition,

                isTree,
                targetElementId,
                isTop,
                isBottom,
                isCenter,
                accept,
            } = dragOverInfo;

            const {toSelectTarget} = getDraggingNodeInfo({e, draggingNode});

            if (isTree) {
                targetElement = iframeDocument.querySelector(`[data-component-id="${targetElementId}"]`);
                guidePosition = getDropGuidePosition({
                    targetElement,
                    frameDocument: iframeDocument,
                });
                guidePosition.position = {
                    isTop,
                    isBottom,
                    isCenter,
                };

                const {target: {targetY, targetX, targetWidth, targetHeight}} = guidePosition;

                const halfY = targetY + targetHeight / 2;
                let top = isTop ? targetY : null;
                top = isBottom ? targetY + targetHeight - LINE_SIZE : top;
                top = isCenter ? halfY - LINE_SIZE / 2 : top;

                guidePosition.guideLine = {
                    left: targetX,
                    top,
                    width: targetWidth,
                    height: LINE_SIZE,
                };
            }

            if (toSelectTarget) guidePosition.guideLine = false;

            clearTimeout(timeRef.current);
            showDropGuideLine(guidePosition);
            overElement({
                targetElement,
                targetRect: guidePosition.target.targetRect,
            });

            if (draggingNode) {
                draggingNode.targetElementId = targetElementId;
                draggingNode.targetElement = targetElement;
                draggingNode.isTree = isTree;
                draggingNode.accept = accept;
                Object.entries(guidePosition.position)
                    .forEach(([key, value]) => {
                        draggingNode[key] = value;
                    });
            }

        } else if (prevDragOverInfo) {
            let {
                targetElement,
                isTree,
                targetElementId,
            } = prevDragOverInfo;

            if (isTree) {
                targetElement = iframeDocument.querySelector(`[data-component-id="${targetElementId}"]`);
            }

            leaveElement(targetElement);
            timeRef.current = setTimeout(() => hideDropGuide(), 100);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dragOverInfo, draggingNode, iframeDocument]);

    return null;
});

function leaveElement(targetElement) {
    if (!targetElement) return;
    targetElement.classList.remove(styles.largeY);
    targetElement.classList.remove(styles.largeX);
    targetElement.classList.remove(styles.dragOver);
}

function overElement(options) {
    const {
        targetElement,
        // targetRect,
    } = options;

    if (!targetElement) return;

    targetElement.classList.add(styles.dragOver);
    const isContainer = targetElement.getAttribute('data-is-container') === 'true';

    // 如果是容器 鼠标悬停 放大
    if (isContainer) {
        // if (targetRect.height < TRIGGER_SIZE * 3) {
        //     targetElement.classList.add(styles.largeY);
        // }
        // if (targetRect.width < TRIGGER_SIZE * 3) {
        //     targetElement.classList.add(styles.largeX);
        // }
    }

}

function showDropGuideLine(position) {
    let {
        guideLine,
        position: {
            isCenter,
            isLeft,
            isRight,
            isTop,
            isBottom,
        },
        target: {
            targetElement,
            targetHeight,
            targetWidth,
            targetX,
            targetY,
        },
    } = position;

    if (isLeft || isRight) {
        isCenter = false;
        isTop = false;
        isBottom = false;
    }

    const frameDocument = document.getElementById('dnd-iframe').contentDocument;
    const guideLineEle = frameDocument.getElementById('drop-guide-line');

    if (!guideLineEle) return;

    const guideBgEle = frameDocument.getElementById('drop-guide-bg');
    const componentDisplayName = targetElement?.getAttribute('data-component-display-name');

    guideBgEle.setAttribute('data-component-display-name', componentDisplayName);
    guideBgEle.classList.add(styles.guideBgActive);
    if (guideLine) {
        guideBgEle.classList.remove(styles.selectTarget);
    } else {
        guideBgEle.classList.add(styles.selectTarget);
    }
    guideBgEle.style.top = `${targetY}px`;
    guideBgEle.style.left = `${targetX}px`;
    guideBgEle.style.width = `${targetWidth}px`;
    guideBgEle.style.height = `${targetHeight}px`;

    const guildTipEle = guideLineEle.querySelector('span');

    if (!guideLine) {
        guideLineEle.classList.remove(styles.guideActive);
        return;
    }

    guideLineEle.classList.add(styles.guideActive);
    guideLineEle.classList.remove(styles.gLeft);
    guideLineEle.classList.remove(styles.gRight);

    if (isLeft) {
        guildTipEle.innerHTML = '前';
        guideLineEle.classList.add(styles.gLeft);
    }
    if (isRight) {
        guildTipEle.innerHTML = '后';
        guideLineEle.classList.add(styles.gRight);
    }
    if (isTop) guildTipEle.innerHTML = '前';
    if (isBottom) guildTipEle.innerHTML = '后';
    if (isCenter) guildTipEle.innerHTML = '内';

    Object.entries(guideLine).forEach(([key, value]) => {
        if (isLeft || isRight) {
            if (key === 'top') value = value - 1;
            if (key === 'height') value = value + 2;

            if (isLeft && key === 'left') value = value - 2;
            if (isRight && key === 'left') value = value + 1;
        } else {
            if (key === 'left') value = value - 1;
            if (key === 'width') value = value + 2;

            if (isTop && key === 'top') value = value - 2;
            if (isBottom && key === 'top') value = value + 1;
        }
        guideLineEle.style[key] = `${value}px`;
    });
}

function hideDropGuide() {
    const frameDocument = document.getElementById('dnd-iframe').contentDocument;

    const guideLineEle = frameDocument.getElementById('drop-guide-line');
    const guideBgEle = frameDocument.getElementById('drop-guide-bg');

    guideBgEle && guideBgEle.classList.remove(styles.guideBgActive);
    guideBgEle && guideBgEle.classList.remove(styles.selectTarget);
    guideLineEle && guideLineEle.classList.remove(styles.guideActive);
}
