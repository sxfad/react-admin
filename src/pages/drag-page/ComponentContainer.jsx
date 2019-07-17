import React, {Component} from 'react';
import {Alert, Collapse, Icon, Popover, Form} from 'antd';
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
@Form.create()
export default class ComponentContainer extends Component {
    state = {};

    componentDidMount() {

    }

    handleEndDrag = (dragKey, result) => {
        if (!result) return;

        const dropId = result.id;
        const config = components[dragKey];
        const defaultProps = config.defaultProps || {};

        const child = {
            __type: dragKey,
            ...defaultProps,
        };

        // 替换__id否则会导致__id重复
        const loop = (node) => {
            node.__id = uuid();
            if (node.children && node.children.length) {
                node.children.forEach(loop);
            }
        };
        loop(child);


        this.props.action.dragPage.appendChild({targetId: dropId, child});
        this.props.action.dragPage.setCurrentId(child.__id);
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
                                let {defaultProps = {}, visible, title, showTagName, description} = com;

                                let componentName = showTagName || getTagName(key, com);

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
                                                    {renderNode(node, (resultCom, {__id, __type, tagName, Component, componentProps, componentChildren}) => {
                                                        if (tagName === 'FormElement') return <Component key={__id} form={this.props.form} {...componentProps} field={__id}>{componentChildren}</Component>;

                                                        return resultCom;
                                                    })}
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
