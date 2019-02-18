import React, {Component} from 'react';
import {QueryItem} from '../../../index';

export default class Base extends Component {
    fetchJobs = () => {
        return new Promise((resolve, reject) => {
            resolve([
                {value: '11', label: '产品经理'},
                {value: '22', label: '测试专员'},
                {value: '33', label: '前端开发'},
            ])
        })
    };

    fetchAddress = () => {
        return new Promise((resolve, reject) => {
            resolve([
                {
                    title: '北京',
                    value: '0-0',
                    key: '0-0',
                    children: [
                        {
                            title: '石景山区',
                            value: '0-0-1',
                            key: '0-0-1',
                        },
                        {
                            title: '海淀区',
                            value: '0-0-2',
                            key: '0-0-2',
                        },
                    ],
                },
                {
                    title: '上海',
                    value: '0-1',
                    key: '0-1',
                },
            ]);
        });
    };

    render() {
        return (
            <div>
                <QueryItem
                    loadOptions={() => {
                        return Promise.all([
                            this.fetchJobs(),
                            this.fetchAddress()]
                        ).then(([job, address]) => {
                            return {job, address};
                        });
                    }}
                    items={[
                        [
                            {
                                label: '用户名', labelWidth: 80, field: 'name', type: 'input', placeholder: '请输入用户名',
                                decorator: {
                                    rules: [
                                        {required: true, message: '请输入用户名！'}
                                    ],
                                },
                            },
                            {
                                label: '工作', labelWidth: 80, field: 'job', type: 'select', placeholder: '请选择工作',
                                decorator: {
                                    initialValue: '11',
                                },
                            },
                            {
                                label: '地址', labelWidth: 80, field: 'address', type: 'select-tree', placeholder: '请选择地址',
                            },
                        ],
                        [
                            {
                                label: '入职日期', labelWidth: 80, field: 'join2', type: 'date', placeholder: '请选择日期',
                                itemStyle: {flex: '12 12 12px'},
                            },
                        ]
                    ]}
                    onSubmit={(values) => {
                        console.log(values);
                    }}
                />
            </div>
        );
    }
}

export const title = '通过嵌套数组，实现简单布局';

export const markdown = `
如果items 的的项是数组，那么其中的查询条件将占用同一行
`;
