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

    handleEndDrag = (dragKey, result) => {
        if (!result) return;

        const dropId = result.id;
        const config = components[dragKey];
        const defaultProps = config.defaultProps || {};

        const __id = uuid();
        const child = {
            __type: dragKey,
            __id,
            ...defaultProps,
        };

        this.props.action.dragPage.appendChild({targetId: dropId, child});
        this.props.action.dragPage.setCurrentId(__id);
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

                        children = renderNode(node, resultCom => resultCom);
                    }

                    const style = {
                        display: 'inline-block',
                        margin: 4,
                        padding: 4,
                        cursor: 'move',
                        position: 'relative',
                        border: '1px dashed #d9d9d9',
                    };

                    return (
                        <DragBox
                            key={key}
                            id={key}
                            type="component"
                            style={style}
                            endDrag={result => this.handleEndDrag(key, result)}
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
