import React, {Component} from 'react';
import {AsyncSelect} from '../../../index';

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

export const title = '基础用法';

export const markdown = `
基础用法
`;
