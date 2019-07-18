import React from 'react'
import {DragSource} from 'react-dnd'

const DragBox = (props) => {
    const {
        children,
        isDragging,
        connectDragSource,
        style = {},
        draggingStyle = {},
        beginDrag,
        endDrag,
        level,
        type,
        id,
        ...others
    } = props;

    const finalStyle = isDragging ? {...style, ...draggingStyle} : style;

    return (
        <div id={`dragBox-${id}`} ref={connectDragSource} {...others} style={finalStyle}>
            {children}
        </div>
    )
};

export default DragSource(
    props => props.type,
    {
        beginDrag: props => {
            if (props.beginDrag) props.beginDrag();

            return {
                id: props.id,
                level: props.level,
            };
        },
        endDrag(props, monitor) {
            const dropResult = monitor.getDropResult();

            if (props.endDrag) props.endDrag(dropResult);
        },
    },
    (connect, monitor) => ({
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging(),
    }),
)(DragBox)
