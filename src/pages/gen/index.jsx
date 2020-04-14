import React, {Component} from 'react';
import {Tabs} from 'antd';
import config from 'src/commons/config-hoc';
import PageContent from 'src/layouts/page-content';
import Fast from './Fast';
import Single from './Single';
import './style.less';

const {TabPane} = Tabs;

@config({
    title: '代码生成',
    path: '/gen',
})
export default class index extends Component {
    render() {
        return (
            <PageContent styleName="root">
                <Tabs defaultActiveKey="single">
                    <TabPane key="fast" tab="快速生成">
                        <Fast/>
                    </TabPane>
                    <TabPane key="single" tab="单独生成">
                        <Single/>
                    </TabPane>
                </Tabs>
            </PageContent>
        );
    }
}
