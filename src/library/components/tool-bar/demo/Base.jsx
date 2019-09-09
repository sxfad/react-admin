import React, {Component} from 'react';
import {ToolBar} from '../../../index';

export default class Base extends Component {
    render() {
        return (
            <ToolBar
                items={[
                    {key: 'add', text: '添加', icon: 'plus', onClick: () => console.log('添加')},
                    {key: 'delete', text: '删除', type: 'danger', icon: 'delete', onClick: () => console.log('删除')},
                    {key: 'export', text: '导出', type: 'default', icon: 'export', disabled: true, onClick: () => console.log('导出')},
                    {key: 'detail', component: <a onClick={() => console.log('详情')}>详情</a>},
                    {key: 'get', component: () => <a onClick={() => console.log('获取组件')}>获取组件</a>},
                ]}
            />
        );
    }
}

export const title = '基础用法';

export const markdown = `
基础用法
`;
