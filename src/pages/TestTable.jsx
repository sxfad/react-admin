import React, {Component} from 'react';
// import {Table} from 'antd';
import {Table} from '@/library/antd';
import config from '@/commons/config-hoc';
import PageContent from '@/layouts/page-content';

@config({path: '/test-table'})
export default class TestTable extends Component {
    state = {};

    componentDidMount() {

    }

    render() {
        const dataSource = [];
        for (let i = 0; i < 100; i++) {
            dataSource.push({id: i, name: i, age: i});
        }
        return (
            <PageContent>
                <Table
                    surplusSpace
                    columns={[
                        {title: '姓名', dataIndex: 'name'},
                        {title: '年龄', dataIndex: 'age'},
                    ]}
                    dataSource={dataSource}
                    rowKey="id"
                    pagination={true}
                />
            </PageContent>
        );
    }
}
