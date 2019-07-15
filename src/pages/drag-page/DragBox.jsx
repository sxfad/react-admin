import React from 'react'
import {DragSource} from 'react-dnd'

const DragBox = (props) => {
    const {
        children,
        isDragging,
        connectDragSource,
        endDrag,
        style = {},
        draggingStyle = {},
        ...others
    } = props;

    const finalStyle = isDragging ? {...style, ...draggingStyle} : style;

    return (
        <div ref={connectDragSource} {...others} style={finalStyle}>
            {children}
        </div>
    )
};

export default DragSource(
    props => props.type,
    {
        beginDrag: props => ({
            id: props.id,
            level: props.level,
        }),
        endDrag(props, monitor) {
            const dropResult = monitor.getDropResult();
            if (dropResult) {
                if (props.endDrag) props.endDrag(dropResult);
            }
        },
    },
    (connect, monitor) => ({
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging(),
    }),
)(DragBox)
