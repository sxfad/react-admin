import React, {Component} from 'react';
import {Button} from 'antd';
import config from '@/commons/config-hoc';
import PageContent from '@/layouts/page-content';
import Header from '@/layouts/header';

@config({
    path: '/example/ajax',
    ajax: true,
})
export default class Ajax extends Component {
    state = {
        loading: false,
    };

    componentDidMount() {
    }

    handleSendGet = () => {
        const params = {
            name: '',
            age: 0,
            job: null,
            position: void 0,
            mobile: '18611434353',
            email: '666_boy@qq.com',
        };

        this.setState({loading: true});
        this.props.ajax
            .get('/test-ajax', params, {noEmpty: true, successTip: '请求成功！'})
            .then(res => {
                console.log(res);
            })
            .finally(() => {
                this.setState({loading: false});
            });
    };

    handleSendGet404 = () => {
        this.setState({loading: true});
        this.props.ajax
            .get('/generator-files', null, {baseURL: '', successTip: 'get 请求成功！'})
            .then(res => {
                console.log(res);
            })
            .finally(() => {
                this.setState({loading: false});
            });

        this.props.ajax.post('/generator-files', null, {baseURL: '', successTip: 'post 请求成功！'});
    };

    render() {
        console.log('render Ajax');
        return (
            <PageContent>
                <Header theme="dark">
                    <div style={{color: '#fff'}}>自定义头部内容</div>
                </Header>
                <Button onClick={this.handleSendGet}>Get Request</Button>
                <Button onClick={this.handleSendGet404}>Get Request 404</Button>
            </PageContent>
        );
    }
}
