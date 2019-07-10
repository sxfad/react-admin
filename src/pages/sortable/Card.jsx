import React, {useImperativeHandle, useRef} from 'react'
import {DragSource, DropTarget} from 'react-dnd'
import ItemTypes from './ItemTypes'

const style = {
    border: '1px dashed gray',
    padding: '0.5rem 1rem',
    marginBottom: '.5rem',
    backgroundColor: 'white',
    cursor: 'move',
};

export default class DragDrop extends React.Component {
    constructor(...args) {
        super(...args);

        const {id, onMove, direction, children} = this.props;

        this.Com = DropTarget(
            ItemTypes.CARD,
            {
                hover(props, monitor, component) {
                    if (!component) {
                        return null
                    }

                    // HTML元素
                    const node = component.getNode();
                    if (!node) {
                        return null
                    }

                    const dragId = monitor.getItem().id;
                    const hoverId = id;

                    // 如果是拖拽到元素本身，不进行移动
                    if (dragId === hoverId) {
                        return
                    }

                    // 方向，两种，水平或垂直，用于判断触发位置
                    // const direction = 'horizontal'; // 水平
                    // const direction = 'vertical'; // 垂直


                    if (direction === 'vertical') {

                        // 被悬停元素矩形对象
                        const hoverBoundingRect = node.getBoundingClientRect();

                        // 垂直中间位置
                        const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

                        // 鼠标在悬停元素中的位置
                        const clientOffset = monitor.getClientOffset();

                        // 被悬停元素距顶部位置
                        const hoverClientY = clientOffset.y - hoverBoundingRect.top;

                        // 放入被悬停元素上面
                        if (hoverClientY < hoverMiddleY) {
                            onMove(dragId, hoverId, 'before');
                        } else { // 放入被悬停元素下面
                            onMove(dragId, hoverId, 'after');
                        }
                        //
                        // // Only perform the move when the mouse has crossed half of the items height
                        // // When dragging downwards, only move when the cursor is below 50%
                        // // When dragging upwards, only move when the cursor is above 50%
                        // // Dragging downwards
                        // if (dragId < hoverId && hoverClientY < hoverMiddleY) {
                        //     return;
                        // }
                        // // Dragging upwards
                        // if (dragId > hoverId && hoverClientY > hoverMiddleY) {
                        //     return;
                        // }
                        // // Time to actually perform the action
                        // onMove(dragId, hoverId);
                        // // Note: we're mutating the monitor item here!
                        // // Generally it's better to avoid mutations,
                        // // but it's good here for the sake of performance
                        // // to avoid expensive index searches.
                        // monitor.getItem().index = hoverId;
                    } else {
                        // 水平布局
                    }
                },
            },
            connect => ({
                connectDropTarget: connect.dropTarget(),
            }),
        )(
            DragSource(
                ItemTypes.CARD,
                {
                    beginDrag: () => ({
                        id: id,
                    }),
                },
                (connect, monitor) => ({
                    connectDragSource: connect.dragSource(),
                    isDragging: monitor.isDragging(),
                }),
            )(React.forwardRef(
                ({isDragging, connectDragSource, connectDropTarget}, ref) => {
                    const elementRef = useRef(null);
                    connectDragSource(elementRef);
                    connectDropTarget(elementRef);
                    const opacity = isDragging ? 0 : 1;

                    useImperativeHandle(ref, () => ({
                        getNode: () => elementRef.current,
                    }));

                    return (
                        <div ref={elementRef} style={{...style, opacity}}>
                            {children}
                        </div>
                    )
                },
            )),
        )
    }

    render() {
        const Com = this.Com;
        return <Com/>
    }
}


