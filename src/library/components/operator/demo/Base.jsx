import React, {Component} from 'react';
import {Table} from 'antd';
import uuid from 'uuid/v4';
import {Operator} from '../../../index';

export default class Base extends Component {
    state = {
        dataSource: [
            {id: uuid(), name: '熊大'},
            {id: uuid(), name: '熊二'},
            {id: uuid(), name: '光头强'},
        ],
    };
    columns = [
        {title: '用户名', dataIndex: 'name', key: 'name'},
        {
            title: '操作',
            render: (text, record) => {
                const {id, name} = record;
                const items = [
                    {
                        label: '详情',
                        onClick: () => console.log(id, name),
                    },
                    {
                        label: '删除',
                        disabled: name === '熊大',
                        color: 'red',
                        confirm: {
                            title: `您确认删除${name}吗？`,
                            onConfirm: () => console.log(id, name),
                        },
                    },
                    {
                        label: '审批',
                        prompt: {
                            title: '请输入审批意见',
                            onConfirm: (values) => console.log(values),
                        },
                    },
                    {
                        label: '审批2',
                        prompt: {
                            title: '请输入审批意见',
                            items: [
                                {label: '姓名', labelSpaceCount: 2, field: 'name', type: 'input'},
                                {label: '年龄', labelSpaceCount: 2, field: 'age', type: 'number'},
                            ],
                            onConfirm: (values) => console.log(values),
                        },
                    },
                    {
                        label: '状态',
                        statusSwitch: {
                            title: '您确定切换状态？',
                            status: name === '熊大',
                            onConfirm: (e) => console.log(e),
                        },
                    },
                    {label: '添加2', onClick: () => console.log(name), isMore: true},
                    {label: '添加3', onClick: () => console.log(name), isMore: true},
                    {label: '添加4', onClick: () => console.log(name), isMore: true},
                    {label: '添加5', onClick: () => console.log(name), isMore: true},
                ];
                return <Operator items={items}/>
            },
        }
    ];

    render() {
        const {dataSource} = this.state;

        return (
            <Table
                columns={this.columns}
                rowKey={(record) => record.id}
                dataSource={dataSource}
            />
        );
    }
}

export const title = '基础用法';

export const markdown = `
基础用法
`;
