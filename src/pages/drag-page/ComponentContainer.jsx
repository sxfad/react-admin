import React, {Component} from 'react';
import {Collapse, Icon, Popover} from 'antd';
import DragBox from './DragBox'
import components, {categories} from './components';
import config from '@/commons/config-hoc';
import uuid from "uuid/v4";
import {renderNode} from './render-utils';
import './style.less';

const {Panel} = Collapse;
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
            <Collapse defaultActiveKey={categories?.length ? categories[0].category : null}>
                {categories.map(item => {
                    const {category, default: components} = item;
                    return (
                        <Panel header={category} key={category}>

                            {Object.keys(components).map(key => {
                                const {defaultProps = {}, visible, title} = components[key];

                                if (visible === false) return null;

                                const node = {
                                    __id: uuid(),
                                    __type: key,
                                    ...defaultProps,
                                };

                                const tip = renderNode(node, resultCom => resultCom);

                                const children = (
                                    <div style={{display: 'flex', padding: 10, alignItems: 'center'}}>
                                        <Icon type="code-sandbox" style={{fontSize: 20, marginRight: 10}}/>
                                        <span>{title}</span>
                                    </div>
                                );


                                const dragBoxStyle = {
                                    cursor: 'move',
                                    position: 'relative',
                                };

                                return (
                                    <DragBox
                                        key={key}
                                        id={key}
                                        type="component"
                                        style={dragBoxStyle}
                                        endDrag={result => this.handleEndDrag(key, result)}
                                    >
                                        <Popover
                                            key={key}
                                            title={title}
                                            content={tip}
                                            placement="right"
                                        >
                                            <Icon styleName="component-preview" type="eye"/>
                                        </Popover>
                                        <div styleName="component-cover"/>
                                        {children}
                                    </DragBox>
                                );
                            })}
                        </Panel>
                    );
                })}
            </Collapse>
        );
    }
}
