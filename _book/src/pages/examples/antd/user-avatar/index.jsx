import React from 'react';
import DemoPage from '@/library/antd/demo-page';
import * as Base from '@/library/antd/components/user-avatar/demo/Base';
import config from '@/commons/config-hoc';

const demos = [
    {
        component: Base.default,
        title: Base.title,
        markdown: Base.markdown,
        code: `
import React, {Component} from 'react';
import {UserAvatar} from '../sx-antd';
import avatar from './avatar.jpg';

export default class Base extends Component {
    render() {
        return (
            <div>
                <div style={{marginBottom: '16px'}}>
                    <UserAvatar name="熊大"/>
                    <UserAvatar name="光头强"/>
                    <UserAvatar name="猴儿大王"/>
                    <UserAvatar name="Good"/>
                </div>
                <div>
                    <UserAvatar src={avatar}/>
                </div>
            </div>
        );
    }
}


        `,
    },
];
const readme = `# 用户头像
显示用户头像，如果用户头像图片不存在，获取用户名第一个字符，并赋予背景色

## 何时使用
一般用于系统右上角显示用户，用户列表显示头像等；

`;
const api = `## API

参数|说明|类型|默认值
---|---|---|---
name | 用户名 | string | '匿名'
src | 用户头像地址 | string | -
`;

@config({
    path: '/example/antd/user-avatar',
})
export default class extends React.Component {
    render() {
        return <DemoPage demos={demos} readme={readme} api={api}/>;
    }
};
