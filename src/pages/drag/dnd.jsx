import React, {Component} from 'react';
import DropBox from './DropBox'
import DragBox from './DragBox'
import components from './components';
import config from '@/commons/config-hoc';
import uuid from 'uuid/v4';
import './style.less';

@config({
    connect: state => {
        return {
            pageConfig: state.pageConfig.pageConfigs['demo-page'],
        }
    },
})
export default class Dnd extends Component {
    handleDropped = (componentKey, targetId) => {
        console.log(componentKey, targetId);
        const node = {
            __type: componentKey,
            __id: uuid(),
            children: [
                {
                    __type: 'text',
                    __id: uuid(),
                    content: '默认按钮',
                }
            ],
        };
        // TODO 获取childIndex，
        this.props.action.pageConfig.addChild({
            pageId: 'demo-page',
            targetNodeId: targetId,
            childIndex: 0,
            child: node,
        });
    };

    handleComponentDropped = (sourceId, targetId) => {
        console.log(sourceId, targetId);
    };

    renderPage = (node, index = 0) => {
        const {__type, __id, children, content, ...others} = node;
        const com = components[__type];

        if (!com) return null; // fixme 更多提示？

        const {component: Component, container, display} = com;

        let resultCom = null;

        if (children && children.length) {
            const renderChildren = children.map((item, index) => this.renderPage(item, index));

            resultCom = <Component {...others}>{renderChildren}</Component>;

            if (Component === 'div') {
                resultCom = <div {...others}>{renderChildren}</div>
            }

            if (container) resultCom = <DropBox type="box" id={__id} index={index}>{resultCom}</DropBox>;
        } else {
            resultCom = <Component {...others}/>;

            if (Component === 'div') resultCom = <div {...others}/>;

            if (Component === 'text') resultCom = content;

            if (container) resultCom = <DropBox type="box" id={__id} index={index}>{resultCom}</DropBox>;
        }

        // 文字节点不可拖拽
        if (Component === 'text') return resultCom;

        return (
            <DragBox
                draggingStyle={{width: 0, height: 0, padding: 0, margin: 0, overflow: 'hidden'}}
                style={{display}}
                key={__id}
                id={__id}
                index={index}
                type="box"
                onDropped={result => this.handleComponentDropped(__id, result.id)}
            >
                {resultCom}
            </DragBox>
        );
    };

    render() {
        const {pageConfig} = this.props;

        return (
            <div styleName="root">
                <div styleName="component-container">
                    {Object.keys(components).map(key => {
                        const {demonstration, component: Com, props = []} = components[key];

                        let children = demonstration;

                        if (!children) {
                            const comProps = {};

                            props.forEach(item => {
                                let {attribute, defaultValue, valueType} = item;

                                if (valueType === 'this.function') defaultValue = () => void 0;

                                comProps[attribute] = defaultValue;
                            });

                            children = <Com {...comProps}/>
                        }

                        return (
                            <DragBox
                                style={{
                                    display: 'inline-block',
                                    margin: 4,
                                }}
                                key={key}
                                id={key}
                                type="box"
                                onDropped={result => this.handleDropped(key, result.id)}
                            >
                                {children}
                            </DragBox>
                        );
                    })}
                </div>
                <div styleName="content" key={uuid()}>
                    {this.renderPage(pageConfig)}
                </div>
            </div>
        );
    }
}
