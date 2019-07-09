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
        const {type, id, children, onDropped, ...others} = this.props;

        this.Com = DragSource(
            type,
            {
                beginDrag: () => ({id}),
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

            return (
                <div
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
