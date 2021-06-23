import React from 'react';
import {cloneDeep} from 'lodash';
import config from 'src/commons/config-hoc';
import {setDragImage} from 'src/pages/drag-page/util';
import {setNodeId} from 'src/pages/drag-page/node-util';

export default config({
    connect: true,
})(function DraggableComponent(props) {
    const {
        data,
        children,
        style = {},
        onDragStart,
        onDragEnd,
        action: {dragPage: dragPageAction},
        ...others
    } = props;

    function handleDragStart(e) {
        onDragStart && onDragStart(e);
        e.stopPropagation();

        // 打开组件组
        setTimeout(() => {
            dragPageAction.setActiveSideKey('componentTree');
        });

        const config = cloneDeep(data.config);

        setDragImage(e, config);
        setNodeId(config);
        dragPageAction.setDraggingNode({
            id: config.id,
            isNewAdd: true,
            nodeData: config,
        });
    }

    function handleDragEnd(e) {
        // 从新打开组件库
        dragPageAction.setActiveSideKey('componentStore');
        dragPageAction.setDraggingNode(null);
        dragPageAction.setDragOverInfo(null);
        onDragEnd && onDragEnd(e);
    }

    const draggable = !!data;

    if (!draggable) return children;

    return (
        <div
            {...others}
            style={{cursor: 'move', ...style}}
            draggable={draggable}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            {children}
        </div>
    );
});

