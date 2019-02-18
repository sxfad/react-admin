import React, {Component} from 'react';
import {Form} from 'antd';
import {FormItemLayout, FormUtil} from '../../../index';

@Form.create()
export default class extends Component {
    render() {
        const {form} = this.props;
        const labelSpaceCount = 6;

        const getFormItem = (options) => FormUtil.getFormItem(options, form);

        return (
            <div>
                <FormItemLayout
                    label="输入框"
                    labelSpaceCount={labelSpaceCount}
                >
                    {FormUtil.getFormElement({
                        type: 'input'
                    })}
                </FormItemLayout>

                <FormItemLayout
                    label="下拉框"
                    labelSpaceCount={labelSpaceCount}
                >
                    {FormUtil.getFormElement({
                        type: 'select',
                        elementProps: {
                            placeholder: '请选择一项',
                            options: [
                                {label: '选项一', value: '1'},
                                {label: '选项二', value: '2'},
                                {label: '选项三', value: '3'},
                                {label: '选项四', value: '4'},
                                {label: '选项五', value: '5'},
                            ],
                        }
                    })}
                </FormItemLayout>
                <FormItemLayout
                    label="日期"
                    labelSpaceCount={labelSpaceCount}
                >
                    {FormUtil.getFormElement({
                        placeholder: '请选择日期',
                        type: 'date',
                        elementProps: {
                            width: 200,
                        }
                    })}
                </FormItemLayout>
                {getFormItem({
                    label: '日期区间',
                    labelSpaceCount,
                    field: 'dateRange',
                    type: 'date-range',
                    elementProps: {
                        width: 200,
                        placeholder: ['开始时间', '结束时间'],
                    }
                })}
            </div>
        );
    }
}

export const title = '基于配置获取表单元素';

export const markdown = `
通过配置的方式，获取表单元素
`;
