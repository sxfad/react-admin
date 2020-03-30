import React, {Component} from 'react';
import config from 'src/commons/config-hoc';
import PageContent from 'src/layouts/page-content';
import Header from 'src/layouts/header';

@config({
    path: '/example/customer-header',
    ajax: true,
})
export default class Ajax extends Component {

    render() {
        return (
            <PageContent>
                <Header>
                    <div style={{color: '#fff'}}>自定义头部内容</div>
                </Header>
                <h1>自定义头部内容</h1>
            </PageContent>
        );
    }
}
