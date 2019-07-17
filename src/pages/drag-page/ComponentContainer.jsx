import React, {Component} from 'react';
import {Alert, Collapse, Icon, Popover} from 'antd';
import DragBox from './DragBox'
import components, {categories} from './components';
import config from '@/commons/config-hoc';
import uuid from "uuid/v4";
import {renderNode, getTagName} from './render-utils';
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
                                const com = components[key];
                                let {defaultProps = {}, visible, title, description} = com;

                                let componentName = getTagName(key, com);

                                title = `${title}(${componentName})`;

                                if (visible === false) return null;

                                const node = {
                                    __id: uuid(),
                                    __type: key,
                                    ...defaultProps,
                                };


                                const tip = (
                                    <div>
                                        <Alert
                                            style={{marginBottom: 10}}
                                            type="warning"
                                            message={
                                                <div>
                                                    <h4>说明：</h4>
                                                    {description || '没有说明。'}
                                                </div>
                                            }
                                        />
                                        <Alert
                                            style={{marginBottom: 10}}
                                            type="success"
                                            message={
                                                <div>
                                                    <h4>预览：</h4>
                                                    {renderNode(node, resultCom => resultCom)}
                                                </div>
                                            }
                                        />
                                    </div>
                                );

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
