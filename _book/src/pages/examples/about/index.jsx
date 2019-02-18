import React, {Component} from 'react';
import {Button} from 'antd';
import config from '@/commons/config-hoc';
import Library from '@/library/Library';
import './style.less';

@config({
    path: '/about',
    title: '我特么是自定义title',
    // noAuth: true,
    // noFrame: true,
    ajax: true,
    query: true,
    event: true,
    connect: (state) => {
        return {
            loading: state.system.loading,
        };
    },
})
export default class Home extends Component {
    state = {};

    render() {
        console.log('about render');
        return (
            <div styleName="root">
                <Library/>
                <Button type="primary">按钮</Button>
                <Button type="danger">按钮</Button>
                关于 页面老死掉是怎么回事儿？ 刷新不出来？ 不能这么坑吧？
            </div>
        );
    }
}
