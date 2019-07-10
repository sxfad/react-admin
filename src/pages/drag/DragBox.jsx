import React from 'react'
import PropTypes from "prop-types";
import {DragSource} from 'react-dnd'
import './style.less';

export default class DragBox extends React.Component {
    static propTypes = {
        type: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired,
        onDropped: PropTypes.func.isRequired,
    };

    constructor(...args) {
        super(...args);
        const {type, id, children, onDropped, draggingStyle = {}, style = {}, ...others} = this.props;

        this.Com = DragSource(
            type,
            {
                beginDrag: () => ({id}), // 返回结果将作为 DropTarget 中 monitor.getItem(); 的值
                endDrag(props, monitor) {
                    const dropResult = monitor.getDropResult();

                    if (dropResult) {
                        onDropped(dropResult);
                    }
                },
            },
            (connect, monitor) => ({
                connectDragSource: connect.dragSource(),
                isDragging: monitor.isDragging(),
            }),
        )(({isDragging, connectDragSource}) => {

            const ds = isDragging ? draggingStyle : {};

            return (
                <div
                    style={{...style, ...ds}}
                    ref={connectDragSource}
                    styleName={`drag-box ${isDragging ? 'dragging' : ''}`}
                    {...others}
                >
                    {children}
                </div>
            )
        });
    }

    render() {
        const Com = this.Com;
        return <Com/>
    }
}
