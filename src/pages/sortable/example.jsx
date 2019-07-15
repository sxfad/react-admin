import React from 'react'
import Card from './Card'
import update from 'immutability-helper'
import uuid from 'uuid/v4';
import config from '@/commons/config-hoc';
import components from "@/pages/drag/components";

@config({
    connect: state => ({
        pageConfig: state.pageConfig.pageConfigs['demo-page'],
    }),
})
export default class Container extends React.Component {
    state = {
        cards: [
            {
                id: uuid(),
                text: 'Write a cool JS library',
            },
            {
                id: uuid(),
                text: 'Make it generic enough',
            },
            {
                id: uuid(),
                text: 'Write README',
            },
            {
                id: uuid(),
                text: 'Create some examples',
            },
            {
                id: uuid(),
                text:
                    'Spam in Twitter and IRC to promote it (note that this element is taller than the others)',
            },
            {
                id: uuid(),
                text: '???',
            },
            {
                id: uuid(),
                text: 'PROFIT',
            },
        ],
    };

    level = 1;
    renderPage = (node) => {
        const {__type, __id, __level = 1000, children, content, ...others} = node;
        const com = components[__type];

        if (!com) return null; // fixme 更多提示？

        const {component: Component, container, display} = com;

        let resultCom = null;

        if (children && children.length) {
            const renderChildren = children.map((item, index) => {
                item.__level = __level * 10 + index;
                return this.renderPage(item, index);
            });

            resultCom = <Component {...others}>{renderChildren}</Component>;

            if (Component === 'div') {
                resultCom = <div {...others}>{renderChildren}</div>
            }

        } else {
            resultCom = <Component {...others}/>;

            if (Component === 'div') resultCom = <div {...others}/>;

            if (Component === 'text') resultCom = content;
        }

        // 文字节点不可拖拽
        if (Component === 'text') return resultCom;

        const type = `${__level}`.length;
        return (
            <Card
                key={__id}
                level={__level}
                id={__id}
                isContainer={container}
                onMove={this.handleMove}
                onLeave={this.handleLeave}
                onDrop={this.handleDrop}
                dragType={`${type}`}
                dropTypes={`${type}`}
            >
                {resultCom}
                {__id}
                **{__level}**
            </Card>
        );
    };

    handleMove = (dragId, hoverId, isBrother, isContainer) => {
        // console.log(dragId, hoverId, isBrother);
        // TODO 加入临时节点
        // 只接受兄弟节点之间的移动
        this.props.action.pageConfig.sort({pageId: 'demo-page', dragId, dropId: hoverId})
        // let {cards} = this.state;
        // const dragCard = cards[dragId];
        // cards = update(cards, {
        //     $splice: [[dragId, 1], [hoverId, 0, dragCard]],
        // });
        //
        // this.setState({cards});
    };

    handleLeave = (hoverId) => {
        // TODO 离开时删除临时节点
        console.log('handleLeave', hoverId);
    };

    handleDrop = (result) => {
        // TODO 投放后，删除原始节点，将临时节点改为永久节点
        console.log(result);
    };

    render() {
        const {pageConfig} = this.props;
        return (
            <div key={uuid()}>
                {this.renderPage(pageConfig)}
            </div>
        )
    }
}
