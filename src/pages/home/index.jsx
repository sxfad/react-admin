import React, {Component} from 'react';
import config from '@/commons/config-hoc';
import PageContent from '@/layouts/page-content';

@config({
    path: '/',
    title: {text: '首页', icon: 'home'},
    breadcrumbs: [{key: 'home', text: '首页', icon: 'home'}],
    keepAlive: false,
})
export default class Home extends Component {

    render() {
        return (
            <PageContent>
                <h1>首页</h1>
            </PageContent>
        );
    }
}
