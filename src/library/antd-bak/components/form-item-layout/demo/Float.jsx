import React, {Component} from 'react';
import {Input} from 'antd';
import {FormItemLayout} from '../../../index';

export default class extends Component {
    render() {
        const width = 200;
        const labelSpaceCount = 5;

        return (
            <div>
                <FormItemLayout
                    float
                    label="用户名"
                    labelSpaceCount={labelSpaceCount}
                >
                    <Input style={{width}}/>
                </FormItemLayout>
                <FormItemLayout
                    float
                    label="密码"
                    labelSpaceCount={labelSpaceCount}
                >
                    <Input style={{width}}/>
                </FormItemLayout>
                <FormItemLayout
                    float
                    label="工作单位"
                    labelSpaceCount={labelSpaceCount}
                >
                    <Input style={{width}}/>
                </FormItemLayout>
                <FormItemLayout
                    float
                    label="用户名"
                    labelSpaceCount={labelSpaceCount}
                >
                    <Input style={{width}}/>
                </FormItemLayout>
                <FormItemLayout
                    float
                    label="密码"
                    labelSpaceCount={labelSpaceCount}
                >
                    <Input style={{width}}/>
                </FormItemLayout>
                <FormItemLayout
                    float
                    label="工作单位"
                    labelSpaceCount={labelSpaceCount}
                >
                    <Input style={{width}}/>
                </FormItemLayout>
                <FormItemLayout
                    float
                    label="用户名"
                    labelSpaceCount={labelSpaceCount}
                >
                    <Input style={{width}}/>
                </FormItemLayout>
                <FormItemLayout
                    float
                    label="密码"
                    labelSpaceCount={labelSpaceCount}
                >
                    <Input style={{width}}/>
                </FormItemLayout>
                <FormItemLayout
                    float
                    label="工作单位"
                    labelSpaceCount={labelSpaceCount}
                >
                    <Input style={{width}}/>
                </FormItemLayout>
                <div style={{clear: 'both'}}/>
            </div>
        );
    }
}

export const title = '浮动';

export const markdown = `
可以用于横向布局表单，注意不能使用 tip 相关属性，如果需要使用tip，请结合 atnd Row Col 进行布局；

结尾需要清除浮动；
`;
