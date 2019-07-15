import React, {Component} from 'react';
import DragBox from './DragBox'
import components from './components';
import config from '@/commons/config-hoc';
import uuid from "uuid/v4";
import {renderNode} from './render-utils';

/**
 * 可用组件容器
 */
@config({connect: true})
export default class ComponentContainer extends Component {
    state = {};

    componentDidMount() {

    }

    handleEndDrag = (dragKey, dropId) => {
        console.log(222, dragKey, dropId);
        const config = components[dragKey];
        const defaultProps = config.defaultProps || {};

        console.log(defaultProps);

        const child = {
            __type: dragKey,
            __id: uuid(),
            ...defaultProps,
        };

        this.props.action.dragPage.addChild({
            targetNodeId: dropId,
            childIndex: 1,
            child,
        });

        // TODO
    };

    render() {
        return (
            <div>
                {Object.keys(components).map(key => {
                    const {demonstration, defaultProps = {}} = components[key];

                    let children = demonstration;

                    if (!children) {

                        const node = {
                            __id: uuid(),
                            __type: key,
                            ...defaultProps,
                        };

                        console.log(node);

                        children = renderNode(node, resultCom => resultCom);
                    }

                    const style = {
                        display: 'inline-block',
                        margin: 4,
                        padding: 4,
                        cursor: 'move',
                        position: 'relative',
                        border: '1px dashed #ccc',
                    };

                    return (
                        <DragBox
                            key={key}
                            id={key}
                            type="component"
                            style={style}
                            endDrag={result => this.handleEndDrag(key, result.id)}
                        >
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                right: 0,
                                bottom: 0,
                                left: 0,
                                zIndex: 1,
                            }}/>
                            {children}
                        </DragBox>
                    );
                })}
            </div>
        );
    }
}
