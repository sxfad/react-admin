import React, {Component} from 'react';
import {Button} from "antd";
import Child from './Child';
import config from '@/commons/config-hoc';

/*
* 如果给一个组件添加key，key改变之后，原先key对应的组件将被卸载，重新创建一个组件
* */
@config({
    path: '/test11'
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
            <div>
                <Button type="primary" onClick={this.handleClick}>更换key</Button>
                <Child key={key}/>
            </div>
        );
    }
}
