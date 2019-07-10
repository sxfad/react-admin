import React from 'react'
import PropTypes from 'prop-types';
import {DropTarget} from 'react-dnd'
import './style.less';

export default class DropBox extends React.Component {
    static propTypes = {
        type: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired,
    };

    constructor(...args) {
        super(...args);

        const {type, id, children, ...others} = this.props;

        this.Com = DropTarget(
            type,
            {
                // 返回值将作为DragSource 中 monitor.getDropResult() 的值
                drop: (props, monitor, component) => {
                    const isOver = monitor.isOver({shallow: true});

                    return isOver ? {id} : void 0;
                },
                // hover: (props, monitor, component) => {
                //     const isOver = monitor.isOver({shallow: true});
                //     return isOver;
                // },
            },
            (connect, monitor) => ({
                connectDropTarget: connect.dropTarget(),
                isOver: monitor.isOver({shallow: true}),
                canDrop: monitor.canDrop(),
            }),
        )((props) => {
            const {canDrop, isOver, connectDropTarget} = props;
            const isActive = canDrop && isOver;

            return (
                <div
                    ref={connectDropTarget}
                    styleName={`drop-box ${isActive ? 'active' : ''} ${canDrop ? 'can-drop' : ''}`}
                    {...others}
                >
                    {children}
                </div>
            )
        })
    }

    render() {
        const Com = this.Com;
        return <Com/>
    }
}
