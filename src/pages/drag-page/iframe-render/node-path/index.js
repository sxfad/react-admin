import React, {useEffect, useState, useRef} from 'react';
import {Tag} from 'antd';
import {RightOutlined} from '@ant-design/icons';
import config from 'src/commons/config-hoc';
import {findParentNodes} from 'src/pages/drag-page/node-util';
import {getComponentDisplayName} from 'src/pages/drag-page/component-config';
import './style.less';

export default config({
    connect: state => {
        return {
            selectedNode: state.dragPage.selectedNode,
            pageConfig: state.dragPage.pageConfig,
        };
    },
})(function ArrowLines(props) {
    const {
        selectedNode,
        pageConfig,
        action: {dragPage: dragPageAction},
    } = props;

    const [paths, setPaths] = useState([]);
    const holdRef = useRef(false);

    useEffect(() => {
        if (!selectedNode) {
            setPaths([]);
            return;
        }
        if (holdRef.current) {
            holdRef.current = false;
            return;
        }

        const parentNodes = findParentNodes(pageConfig, selectedNode.id);
        setPaths([...parentNodes, selectedNode]);
    }, [selectedNode]);

    const SHOW_COUNT = 5;

    return (
        <div styleName="root">
            {paths.map((node, index) => {
                const componentDisplayName = getComponentDisplayName(node);
                if (paths.length > SHOW_COUNT && index < paths.length - SHOW_COUNT) return '.';
                return (
                    <div>
                        <Tag
                            color={selectedNode?.id === node.id ? 'cyan' : 'lime'}
                            onClick={() => {
                                dragPageAction.setSelectedNodeId(node.id);
                                holdRef.current = true;
                            }}
                        >
                            {componentDisplayName}
                        </Tag>
                        <RightOutlined/>
                    </div>
                );
            })}
        </div>
    );
});
