import React, {Component} from 'react';
import {Input} from 'antd';
import {FormItemLayout} from '../../../index';

export default class extends Component {
    render() {
        const labelSpaceCount = 6;
        const tipWidth = 150;

        return (
            <div>
                <FormItemLayout
                    label="用户名"
                    labelSpaceCount={labelSpaceCount}
                    tip="用户名是必填的"
                    tipWidth={tipWidth}
                >
                    <Input/>
                </FormItemLayout>
                <FormItemLayout
                    label="密码"
                    labelSpaceCount={labelSpaceCount}
                    tipWidth={tipWidth}
                >
                    <Input/>
                </FormItemLayout>
                <FormItemLayout
                    label="工作单位"
                    labelSpaceCount={labelSpaceCount}
                    tipWidth={tipWidth}
                >
                    <Input/>
                </FormItemLayout>
            </div>
        );
    }
}

export const title = '基础用法';

export const markdown = `
label固定宽度，表单元素自适应
`;
