import React, {Component} from 'react';
import {UserAvatar} from '../../../index';
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
                    <UserAvatar avatar={avatar}/>
                </div>
            </div>
        );
    }
}

export const title = '基础用法';

export const markdown = `
基础用法
`;
