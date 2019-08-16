import React, {Component} from 'react';
import {Button} from "antd";
import Child from './Child';
import config from '@/commons/config-hoc';
import PageContent from '@/layouts/page-content';
import './style.less';

/*
* 如果给一个组件添加key，key改变之后，原先key对应的组件将被卸载，重新创建一个组件
* */
@config({
    path: '/test11',
    title: {icon: 'code', text: '测试'},
})
export default class index extends Component {
    state = {};

    componentDidMount() {

    }

    key = 0;
    handleClick = () => {
        this.setState({key: ++this.key});
    };

    render() {
        const {key} = this.state;
        return (
            <PageContent>
                <Button type="primary" onClick={this.handleClick}>更换key</Button>
                <Child key={key}/>
                <div styleName="drag-bar-icon">
                    <span/>
                    <span/>
                    <span/>
                    <span/>
                    <span/>
                    <span/>
                </div>
            </PageContent>
        );
    }
}
