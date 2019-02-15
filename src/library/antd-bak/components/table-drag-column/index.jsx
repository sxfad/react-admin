import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {DragDropContext, DragSource, DropTarget} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import classnames from 'classnames';

function dragDirection(dragIndex,
                       hoverIndex,
                       initialClientOffset,
                       clientOffset,
                       sourceClientOffset,) {
    const hoverMiddleX = (initialClientOffset.x - sourceClientOffset.x) / 2;
    const hoverClientX = clientOffset.x - sourceClientOffset.x;
    if (dragIndex < hoverIndex && hoverClientX > hoverMiddleX) {
        return 'rightward';
    }
    if (dragIndex > hoverIndex && hoverClientX < hoverMiddleX) {
        return 'leftward';
    }
}

let Title = (props) => {
    const {
        isOver,
        connectDragSource,
        connectDropTarget,
        onMove, // 虽然没用到，但是为了从restProps中去除onMove
        dragCol,
        clientOffset,
        sourceClientOffset,
        initialClientOffset,
        ...restProps
    } = props;

    const style = {...restProps.style, cursor: 'move'};

    let className = classnames(restProps.className, 'drag-column-cursor');
    if (isOver && initialClientOffset) {
        const direction = dragDirection(
            dragCol.index,
            restProps.index,
            initialClientOffset,
            clientOffset,
            sourceClientOffset
        );
        className = classnames(className, {
            'drop-over-rightward': direction === 'rightward',
            'drop-over-leftward': direction === 'leftward',
        });
    }

    return connectDragSource(
        connectDropTarget(
            <th
                {...restProps}
                className={className}
                style={style}
            />
        )
    );
};

const colSource = {
    beginDrag(props) {
        return {
            index: props.index,
        };
    },
};

const colTarget = {
    drop(props, monitor) {
        const dragIndex = monitor.getItem().index;
        const hoverIndex = props.index;
        // Don't replace items with themselves
        if (dragIndex === hoverIndex) {
            return;
        }

        // Time to actually perform the action
        props.onMove(dragIndex, hoverIndex);

        // Note: we're mutating the monitor item here!
        // Generally it's better to avoid mutations,
        // but it's good here for the sake of performance
        // to avoid expensive index searches.
        monitor.getItem().index = hoverIndex;
    },
};

Title = DropTarget('col', colTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    sourceClientOffset: monitor.getSourceClientOffset(),
}))(
    DragSource('col', colSource, (connect, monitor) => ({
        connectDragSource: connect.dragSource(),
        dragCol: monitor.getItem(),
        clientOffset: monitor.getClientOffset(),
        initialClientOffset: monitor.getInitialClientOffset(),
    }))(Title)
);

export default function DragColumn(OriTable) {

    @DragDropContext(HTML5Backend)
    class DragColumnTable extends Component {
        constructor(props) {
            super(props);
            const {components} = this.props;
            this.components = {
                header: {
                    cell: Title,
                },
            };

            if (components && components.header) {
                this.components.header = {
                    ...components.header,
                    cell: Title,
                };
            }

            if (components) {
                this.components = {...components, ...this.components};
            }
        }

        static propTypes = {
            onColumnMoved: PropTypes.func.isRequired,
            columns: PropTypes.array.isRequired,
        };

        onMove = (dragIndex, hoverIndex) => {
            const {columns} = this.props;
            const dragCol = columns[dragIndex];
            const {onColumnMoved} = this.props;
            const newColumns = update({columns}, {
                columns: {
                    $splice: [[dragIndex, 1], [hoverIndex, 0, dragCol]],
                },
            }).columns;

            if (onColumnMoved) onColumnMoved(newColumns, dragIndex, hoverIndex);
        };

        render() {
            const {
                onColumnMoved,
                className,
                columns,
                components,
                ...others
            } = this.props;
            const classNames = classnames(className, 'sx-table-drag-column');
            const cols = columns.map((item, index) => ({
                ...item,
                onHeaderCell: () => ({index, onMove: this.onMove}),
            }));

            return (
                <OriTable
                    {...others}
                    className={classNames}
                    columns={cols}
                    components={this.components}
                />
            );
        }
    }

    return DragColumnTable;
}

