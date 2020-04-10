import React, {Component} from 'react';
import config from 'src/commons/config-hoc';
import {tableEditable, Operator, Table} from 'src/library/components';
import PageContent from 'src/layouts/page-content';

const EditTable = tableEditable(Table);

@config({path: '/example/table-editable'})
export default class EditableTable extends Component {
    state = {
        dataSource: Array.from({length: 20}).map((item, index) => {
            return {
                key: `${index}`,
                name: 'Edward King 1',
                lang: 'c++',
                address: 'London, Park Lane no. 1',
            };
        }),
    };

    columns = [
        {
            title: '姓名',
            dataIndex: 'name',
            width: 300,
            formProps: {
                required: true,
            },
        },
        {
            title: '语言',
            dataIndex: 'lang',
            width: 300,
            formProps: {
                type: 'select',
                required: true,
                options: [
                    {label: 'Java', value: 'java'},
                    {label: 'C++', value: 'c++'},
                ],
            },
        },
        {
            title: '地址',
            dataIndex: 'address',
            formProps: record => {
                const {address} = record;
                if (address.includes('no. 0')) return {};

                return {
                    disabled: true,
                };
            },
        },
        {
            title: '操作',
            dataIndex: 'operation',
            width: 100,
            render: (text, record) => {
                return (
                    <Operator
                        items={[
                            {
                                label: '保存',
                                onClick: () => {
                                    record._form.validateFields()
                                        .then(values => {
                                            console.log('校验成功：', values);
                                        })
                                        .catch(e => {
                                            console.log(e);
                                        });
                                },
                            },
                            {
                                label: '重置',
                                onClick: () => record._form.resetFields(),
                            },

                        ]}
                    />
                );
            },
        },
    ];


    render() {
        const {dataSource} = this.state;

        console.log('123123');
        return (
            <PageContent>
                <EditTable
                    dataSource={dataSource}
                    columns={this.columns}
                />
            </PageContent>
        );
    }
}
