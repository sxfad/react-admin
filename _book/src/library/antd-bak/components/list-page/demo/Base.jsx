import React, {Component} from 'react';
import {Button} from 'antd';
import uuid from 'uuid/v4';
import {ListPage} from '../../../index';

export default class Base extends Component {
    state = {
        dataSource: [
            {id: uuid(), name: '熊大', age: 22, job: '护林员'},
            {id: uuid(), name: '熊二', age: 20, job: '护林员'},
            {id: uuid(), name: '光头强', age: 25, job: '伐木工'},
        ],
        total: 108,
    };
    columns = [
        {title: '姓名', dataIndex: 'name', key: 'name'},
        {title: '年龄', dataIndex: 'age', key: 'age'},
        {title: '工作', dataIndex: 'job', key: 'job'},
    ];

    handleSearch = (params) => {
        console.log(params);
    };

    render() {
        const {dataSource, total} = this.state;
        return (
            <ListPage
                queryItems={[
                    {label: '姓名', field: 'name', type: 'input'},
                ]}
                queryExtra={<Button style={{marginLeft: '8px'}}>添加</Button>}
                onSearch={this.handleSearch}
                tableProps={{
                    dataSource: dataSource,
                    columns: this.columns,
                    rowKey: (record) => record.id,
                }}
                total={total}
            />
        );
    }
}

export const title = '基础用法';

export const markdown = `
基础用法
`;
