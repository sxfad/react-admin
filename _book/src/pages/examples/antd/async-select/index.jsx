import React from 'react';
import DemoPage from '@/library/antd/demo-page';
import * as Base from '@/library/antd/components/async-select/demo/Base';
import * as InputAsValue from '@/library/antd/components/async-select/demo/InputAsValue';
import config from '@/commons/config-hoc';

const demos = [
    {
        component: Base.default,
        title: Base.title,
        markdown: Base.markdown,
        code: `
import React, {Component} from 'react';
import {AsyncSelect} from '../sx-antd';

export default class Base extends Component {
    state = {};

    render() {
        return (
            <AsyncSelect
                style={{width: 300}}
                placeholder="请选择一项"
                defaultValue="11"
                loadDataByUserInput={(value) => {
                    console.log(value);
                    return Promise.resolve([
                        {value: '11', label: '我是11'},
                        {value: '22', label: '我是22'},
                        {value: '33', label: '我是33'},
                    ])
                }}
                loadDataByValue={(value) => {
                    console.log(value);
                    return Promise.resolve([
                        {value: '11', label: '我是11'},
                    ])
                }}
            />
        );
    }
}


        `,
    },

    {
        component: InputAsValue.default,
        title: InputAsValue.title,
        markdown: InputAsValue.markdown,
        code: `
import React, {Component} from 'react';
import {AsyncSelect} from '../sx-antd';

export default class Base extends Component {
    state = {
        value: 11,
    };

    handleChange = (value) => {
        this.setState({value});
    };

    render() {
        const {value} = this.state;
        return (
            <AsyncSelect
                style={{width: 300}}
                placeholder="请选择一项"
                inputAsValue
                value={value}
                onChange={this.handleChange}
                loadDataByUserInput={(value) => {
                    console.log(value);
                    return Promise.resolve([
                        {value: '我是11', label: '我是11'},
                        {value: '我是22', label: '我是22'},
                        {value: '我是33', label: '我是33'},
                    ])
                }}
                loadDataByValue={(value) => {
                    console.log(value);
                    return Promise.resolve([
                        {value: '我是11', label: '我是11'},
                    ])
                }}
            />
        );
    }
}



        `,
    },
];
const readme = `# 异步下拉
基于用户输入，查询数据，动态显示下拉项，一般需要两个接口配合工作，一个是基于用户输入进行下拉数据查询的接口，一个基于value，查询单个下拉数据的接口
有时候由于用户输入，下拉数据改变了，但是用户并没有选择（没有改变value），会导致Select显示value，并不会显示label（应为下拉数据已经改变，没有value对应的label了），解决这个问题就用到了基于value查询下拉数据的接口。

`;
const api = `## API

参数|说明|类型|默认值
---|---|---|---
loadDataByUserInput | 基于用户输入查询下拉数据 | function(value){return Promise} | -
loadDataByValue | 基于value查询下拉数据，一般做初始化回显 | function(value){return Promise} | -
defaultValue | 初始化数据，如果结合Form使用，不用写defaultValue，内部会自动获取Form的initialValue配置| any | -
inputAsValue | 用户输入也作为一个选项 | boolean | false
`;

@config({
    path: '/example/antd/async-select',
})
export default class extends React.Component {
    render() {
        return <DemoPage demos={demos} readme={readme} api={api}/>;
    }
};
