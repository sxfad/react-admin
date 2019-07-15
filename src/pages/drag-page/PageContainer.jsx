import React, {Component} from 'react';
import {Icon} from 'antd';
import DropBox from './DropBox'
import DragBox from './DragBox'
import config from '@/commons/config-hoc';
import uuid from 'uuid/v4';
import {renderNode} from './render-utils';
import './style.less';

@config({
    connect: state => {
        return {
            pageConfig: state.dragPage.pageConfig,
        }
    },
})
export default class Dnd extends Component {
    handleEndDrag = (dragId, dropId) => {
        if (dropId === 'delete-node') {
            this.props.action.dragPage.deleteNode(dragId);
        }
        console.log('handleEndDrag:', dragId, dropId);
    };

    handleMove = (dragId, hoverId, isBrother) => {
        console.log('handleMove:', dragId, hoverId, isBrother);
        // TODO
    };

    renderPage = (node) => {
        return renderNode(node, (resultCom, {__id, __parentId, level, container, direction, display}) => {
            const sortType = __parentId;
            const activeStyle = {background: '#aff3b5', transform: 'scale(1.02)',};
            const canDropStyle = {background: '#f9ecc5'};

            if (container) {
                // 容器组件可接受子组件
                resultCom = (
                    <DropBox
                        types={['component', sortType]}
                        id={__id}
                        direction={direction}
                        level={level}
                        style={{transition: '300ms',}}
                        activeStyle={activeStyle}
                        canDropStyle={canDropStyle}
                        onMove={this.handleMove}
                    >
                        {resultCom}
                    </DropBox>
                );
            } else {
                // 非容器组件，包裹DropBox为了排序
                resultCom = <DropBox
                    types={sortType}
                    key={__id}
                    id={__id}
                    direction={direction}
                    level={level}
                    style={{transition: '300ms',}}
                    activeStyle={activeStyle}
                    canDropStyle={canDropStyle}
                    onMove={this.handleMove}
                >
                    {resultCom}
                </DropBox>
            }

            return (
                <DragBox
                    type={sortType}
                    draggingStyle={{width: 0, height: 0, padding: 0, margin: 0, overflow: 'hidden'}}
                    style={{display, boxSizing: 'border-box', border: '1px dashed #ccc'}}
                    key={__id}
                    id={__id}
                    level={level}
                    endDrag={result => this.handleEndDrag(__id, result.id)}
                >
                    {resultCom}
                    ***{level}***
                </DragBox>
            );

        });

    };

    render() {
        const {pageConfig} = this.props;
        const allIds = ['0'];
        const loop = node => {
            const {__id, children} = node;
            allIds.push(__id);

            if (children && children.length) {
                children.forEach(loop);
            }
        };

        loop(pageConfig);

        return (
            <div styleName="root">
                <div styleName="content" key={uuid()}>
                    {this.renderPage(pageConfig)}
                </div>
                <DropBox
                    types={allIds}
                    id="delete-node"
                    style={{
                        position: 'fixed',
                        bottom: 10,
                        right: 10,
                        transition: '300ms',
                    }}
                    activeStyle={{
                        transform: 'scale(1.5)',
                    }}
                >
                    <Icon style={{fontSize: 40, color: 'red'}} type="delete"/>
                </DropBox>
            </div>
        );
    }
}
