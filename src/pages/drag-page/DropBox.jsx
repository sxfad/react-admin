import React from 'react'
import {DropTarget} from 'react-dnd'

const DropBox = (props) => {
    const {
        children,
        canDrop,
        isOverCurrent,
        connectDropTarget,
        style = {},
        canDropStyle = {},
        activeStyle = {},
        forwardedRef,
        onMove,
        isOver,
        level,
        types,
        id,
        ...others
    } = props;

    const isActive = canDrop && isOverCurrent;
    const finalStyle = {...style, ...(canDrop ? canDropStyle : {}), ...(isActive ? activeStyle : {})};
    connectDropTarget(forwardedRef);
    return (
        <div id={`dropBox-${id}`} ref={forwardedRef} style={finalStyle} {...others}>
            {children}
        </div>
    )
};

const ForwardRefDropBox = React.forwardRef((props, ref) => {
        return <DropBox {...props} forwardedRef={ref}/>;
    }
);

export default DropTarget(
    props => props.types,
    {
        drop(props, monitor) {
            const hasDroppedOnChild = monitor.didDrop();
            if (hasDroppedOnChild) {
                return
            }

            return {id: props.id};
        },
        canDrop(props, monitor) {
            if (props.canDrop) return props.canDrop(monitor);
            return true;
        },
        hover(props, monitor, component) {
            if (!component) return;

            const isOverCurrent = monitor.isOver({shallow: true});
            if (!isOverCurrent) return;

            const hoverId = props.id;

            if (hoverId === 'delete-node') return;

            const dragLevel = monitor.getItem().level;

            if (!dragLevel) return;

            const hoverLevel = props.level;

            const dragId = monitor.getItem().id;

            // Don't replace items with themselves
            if (dragLevel === hoverLevel) return;
            if (dragId === hoverId) return;

            // 容器内组件排列方式 // vertical / horizontal
            const direction = props.direction;

            // Determine rectangle on screen
            const hoverBoundingRect = component.getBoundingClientRect();
            // Determine mouse position
            const clientOffset = monitor.getClientOffset();

            // 子元素水平排列
            if (direction === 'horizontal') {
                // Get horizontal middle
                const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2;

                // Get pixels to the left
                const hoverClientX = clientOffset.x - hoverBoundingRect.left;

                // Only perform the move when the mouse has crossed half of the items height
                // When dragging downwards, only move when the cursor is below 50%
                // When dragging upwards, only move when the cursor is above 50%
                // Dragging downwards
                if (dragLevel < hoverLevel && hoverClientX < hoverMiddleX) {
                    return;
                }
                // Dragging upwards
                if (dragLevel > hoverLevel && hoverClientX > hoverMiddleX) {
                    return;
                }

            } else {
                // 子元素垂直排列
                // Get vertical middle
                const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
                // Get pixels to the top
                const hoverClientY = clientOffset.y - hoverBoundingRect.top;

                // Only perform the move when the mouse has crossed half of the items height
                // When dragging downwards, only move when the cursor is below 50%
                // When dragging upwards, only move when the cursor is above 50%
                // Dragging downwards
                if (dragLevel < hoverLevel && hoverClientY < hoverMiddleY) {
                    return;
                }
                // Dragging upwards
                if (dragLevel > hoverLevel && hoverClientY > hoverMiddleY) {
                    return;
                }
            }

            // Time to actually perform the action
            props.onMove(dragId, hoverId);

            monitor.getItem().level = hoverLevel;
        },
    },
    (connect, monitor) => ({
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
        isOverCurrent: monitor.isOver({shallow: true}),
        canDrop: monitor.canDrop(),
    }),
)(ForwardRefDropBox)
