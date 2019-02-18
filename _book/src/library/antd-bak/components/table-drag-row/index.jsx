import React, {Component} from 'react';
import PropTypes from "prop-types";
import {DragDropContext, DragSource, DropTarget} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import classnames from 'classnames';

function dragDirection(dragIndex,
                       hoverIndex,
                       initialClientOffset,
                       clientOffset,
                       sourceClientOffset,) {
    const hoverMiddleY = (initialClientOffset.y - sourceClientOffset.y) / 2;
    const hoverClientY = clientOffset.y - sourceClientOffset.y;
    if (dragIndex < hoverIndex && hoverClientY > hoverMiddleY) {
        return 'downward';
    }
    if (dragIndex > hoverIndex && hoverClientY < hoverMiddleY) {
        return 'upward';
    }
}

let BodyRow = (props) => {
    const {
        isOver,
        connectDragSource,
        connectDropTarget,
        moveRow,
        dragRow,
        clientOffset,
        sourceClientOffset,
        initialClientOffset,
        ...restProps
    } = props;
    const style = {...restProps.style, cursor: 'move'};

    let className = restProps.className;
    if (isOver && initialClientOffset) {
        const direction = dragDirection(
            dragRow.index,
            restProps.index,
            initialClientOffset,
            clientOffset,
            sourceClientOffset
        );
        className = classnames(className, {
            'drop-over-downward': direction === 'downward',
            'drop-over-upward': direction === 'upward',
        });
    }

    return connectDragSource(
        connectDropTarget(
            <tr
                {...restProps}
                className={className}
                style={style}
            />
        )
    );
};

const rowSource = {
    beginDrag(props) {
        return {
            index: props.index,
        };
    },
};

const rowTarget = {
    drop(props, monitor) {
        const dragIndex = monitor.getItem().index;
        const hoverIndex = props.index;

        // Don't replace items with themselves
        if (dragIndex === hoverIndex) {
            return;
        }

        // Time to actually perform the action
        props.moveRow(dragIndex, hoverIndex);

        // Note: we're mutating the monitor item here!
        // Generally it's better to avoid mutations,
        // but it's good here for the sake of performance
        // to avoid expensive index searches.
        monitor.getItem().index = hoverIndex;
    },
};

BodyRow = DropTarget('row', rowTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    sourceClientOffset: monitor.getSourceClientOffset(),
}))(
    DragSource('row', rowSource, (connect, monitor) => ({
        connectDragSource: connect.dragSource(),
        dragRow: monitor.getItem(),
        clientOffset: monitor.getClientOffset(),
        initialClientOffset: monitor.getInitialClientOffset(),
    }))(BodyRow)
);


export default function DragRow(OriTable) {

    @DragDropContext(HTML5Backend)
    class DragRowTable extends Component {
        constructor(props) {
            super(props);
            const {components} = this.props;

            this.components = {
                body: {
                    row: BodyRow,
                },
            };

            if (components && components.body) {
                this.components.body = {
                    ...components.body,
                    cell: BodyRow,
                };
            }

            if (components) {
                this.components = {...components, ...this.components};
            }
        }

        static propTypes = {
            onRowMoved: PropTypes.func.isRequired,
        };

        onMove = (dragIndex, hoverIndex) => {
            const {dataSource, onRowMoved} = this.props;
            const dragRow = dataSource[dragIndex];

            const newDataSource = update({dataSource}, {
                dataSource: {
                    $splice: [[dragIndex, 1], [hoverIndex, 0, dragRow]],
                },
            }).dataSource;

            if (onRowMoved) onRowMoved(newDataSource, dragIndex, hoverIndex);
        };

        render() {
            const {
                className,
                onRowMoved,
                components,
                onRow,
                ...others
            } = this.props;
            const classNames = classnames(className, 'sx-table-drag-row');

            return (
                <OriTable
                    {...others}
                    className={classNames}
                    components={this.components}
                    onRow={(record, index) => {
                        const {onRow} = this.props;
                        let onRowResult = {};

                        if (onRow) {
                            onRowResult = onRow(record, index);
                        }

                        return {
                            ...onRowResult,
                            index,
                            moveRow: this.onMove,
                        };
                    }}
                />
            );
        }
    }

    return DragRowTable;
}

