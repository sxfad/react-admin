import React from 'react'
import {DragSource, DropTarget} from 'react-dnd'
import ItemTypes from './ItemTypes'

const style = {
    border: '1px dashed gray',
    padding: '0.5rem 1rem',
    margin: '.5rem',
    backgroundColor: 'white',
    cursor: 'move',
};

// const Card = React.forwardRef(
//     ({children, isDragging, connectDragSource, connectDropTarget}, ref) => {
//         const elementRef = useRef(null);
//         connectDragSource(elementRef);
//         connectDropTarget(elementRef);
//         const opacity = isDragging ? 0 : 1;
//         useImperativeHandle(ref, () => ({
//             getNode: () => elementRef.current,
//         }));
//         return (
//             <div ref={elementRef} style={{...style, opacity}}>
//                 {children}
//             </div>
//         )
//     },
// );

class WrappedCard extends React.Component {
    componentDidUpdate(prevProps, prevState, snapshot) {
        // 可以进行移入移出判断
        if (prevProps.isOverCurrent === true && this.props.isOverCurrent === false) {
            this.props.onLeave(this.props.id);
        }
    }

    render() {
        const {
            children,
            isOverCurrent,
            isContainer,
            isOver,
            isDragging,
            connectDragSource,
            connectDropTarget,
            forwardedRef,
            dragId,
            id,
        } = this.props;
        const canDrop = isOverCurrent && isContainer && dragId !== id;


        const innerStyle = {};
        if (isDragging) {
            // innerStyle.width = 0;
            // innerStyle.height = 0;
            // innerStyle.padding = 0;
            // innerStyle.margin = 0;
            // innerStyle.overflow = 'hidden';
            // innerStyle.border = 'none';

            innerStyle.opacity = 0.4;
        }

        if (canDrop) {
            innerStyle.backgroundColor = 'green';
        }

        connectDragSource(forwardedRef);
        connectDropTarget(forwardedRef);

        return (
            <div ref={forwardedRef} style={{...style, ...innerStyle}}>
                {children}
            </div>
        );
    }
}

const Card = React.forwardRef((props, ref) => {
        return <WrappedCard {...props} forwardedRef={ref}/>;
    }
);

export default DropTarget(
    props => props.dropTypes,
    {
        drop: (props, monitor, component) => {
            const isOverCurrent = monitor.isOver({shallow: true});
            const hoverId = props.id;
            const dragId = monitor.getItem().id;

            return isOverCurrent ? {hoverId, dragId} : void 0;
        },
        hover(props, monitor, component) {
            if (!component) return;

            const isOverCurrent = monitor.isOver({shallow: true});
            if (!isOverCurrent) return;

            const dragLevel = monitor.getItem().level;
            const hoverLevel = props.level;

            const dragId = monitor.getItem().id;
            const hoverId = props.id;
            // Don't replace items with themselves
            if (dragLevel === hoverLevel) {
                return;
            }
            // Determine rectangle on screen
            const hoverBoundingRect = component.getBoundingClientRect();
            // Get vertical middle
            const hoverMiddleY =
                (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            // Determine mouse position
            const clientOffset = monitor.getClientOffset();
            // Get pixels to the top
            const hoverClientY = clientOffset.y - hoverBoundingRect.top;

            // 兄弟节点之间移动
            const isBrother = `${dragLevel}`.length === `${hoverLevel}`.length;
            console.log(dragLevel, hoverLevel, `${dragLevel}`.length, `${hoverLevel}`.length);
            if (isBrother) {
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
            props.onMove(dragId, hoverId, isBrother, props.isContainer);
            // Note: we're mutating the monitor item here!
            // Generally it's better to avoid mutations,
            // but it's good here for the sake of performance
            // to avoid expensive index searches.
            monitor.getItem().level = hoverLevel;
        },
    },
    (connect, monitor, props) => {
        // 有时候会是null
        const dragItem = monitor.getItem() || {};
        return {
            connectDropTarget: connect.dropTarget(),
            isOver: monitor.isOver(),
            isOverCurrent: monitor.isOver({shallow: true}),
            canDrop: monitor.canDrop(),
            dragId: dragItem.id,
        };
    },
)(
    DragSource(
        props => props.dragType,
        {
            beginDrag: props => ({
                id: props.id,
                index: props.index,
                level: props.level,
            }),
            endDrag(props, monitor) {
                const dropResult = monitor.getDropResult();

                if (dropResult) {
                    props.onDrop(dropResult);
                }
            },
        },
        (connect, monitor) => ({
            connectDragSource: connect.dragSource(),
            isDragging: monitor.isDragging(),
        }),
    )(Card),
)
