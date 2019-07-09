import React, {Component} from 'react';
import config from '@/commons/config-hoc';
import uuid from "uuid/v4";
import {addChild, deleteNode, updateNode, findNodeById} from './virtual-dom';

const rootId = uuid();
const divId = uuid();
const virtualDom = {
    __type: 'page-content',
    __id: rootId,
    children: [
        {
            __type: 'div', // 节点组件类型
            __id: divId, // 节点的唯一标识
            style: {},
            children: [
                {
                    __type: 'button',
                    __id: uuid(),
                    type: 'primary',
                    style: {marginRight: 8},
                    children: [
                        {
                            __type: 'text',
                            __id: uuid(),
                            content: '保存',
                        },
                    ],
                },
                {
                    __type: 'button',
                    __id: uuid(),
                    style: {marginRight: 8},
                    children: [
                        {
                            __type: 'text',
                            __id: uuid(),
                            content: '重置',
                        },
                    ],
                },
            ],
        }
    ],
};

const bId = uuid();

addChild(virtualDom, divId, 2, {
    __type: 'button',
    __id: bId,
    type: 'danger',
    children: [
        {
            __type: 'text',
            __id: uuid(),
            content: '删除',
        }
    ],
});

updateNode(virtualDom, {
    __type: 'button',
    __id: bId,
    type: 'danger',
    onClick: () => alert('删除'),
    children: [
        {
            __type: 'text',
            __id: uuid(),
            content: '删除aaa',
        }
    ],
});

// deleteNode(virtualDom, bId);

@config({path: '/gen'})
export default class test extends Component {
    state = {};

    componentDidMount() {

    }

    render() {
        return (
            <div>
                test
            </div>
        );
    }
}
