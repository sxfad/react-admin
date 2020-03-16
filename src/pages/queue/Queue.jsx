import React, {Component} from 'react';
import {Tabs} from 'antd';
import config from '@/commons/config-hoc';
import PageContent from '@/layouts/page-content';
import RunningQueue from './RunningQueue';
import TackOverQueue from './TackOverQueue';
import Config from './Config';

const {TabPane} = Tabs;

@config({path: '/queue', ajax: true, title: '队列'})
export default class Queue extends Component {


    render() {
        return (
            <PageContent>
                <Tabs tabBarStyle={{marginBottom: 8}}>
                    <TabPane tab="运行中队列" key="1">
                        <RunningQueue/>
                    </TabPane>
                    <TabPane tab="已接管队列" key="2">
                        <TackOverQueue/>
                    </TabPane>
                    <TabPane tab="配置管理" key="3">
                        <Config/>
                    </TabPane>
                </Tabs>
            </PageContent>
        );
    }
}
