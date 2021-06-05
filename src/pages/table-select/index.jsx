import React from 'react';
import config from 'src/commons/config-hoc';
import {PageContent, Table, renderTableCheckbox} from '@ra-lib/components';
import {convertToTree} from '@ra-lib/util';

const testDataSource = [
    {id: '1', name: '名称1', remark: '备注1'},
    {id: '11', name: '名称11', remark: '备注11', parentId: '1'},
    {id: '111', name: '名称111', remark: '备注111', parentId: '11'},
    {id: '112', name: '名称112', remark: '备注112', parentId: '11'},
    {id: '113', name: '名称113', remark: '备注113', parentId: '11'},
    {id: '12', name: '名称12', remark: '备注12', parentId: '1'},
    {id: '13', name: '名称13', remark: '备注13', parentId: '1'},
    {id: '14', name: '名称14', remark: '备注14', parentId: '1'},
    {id: '2', name: '名称2', remark: '备注2'},
    {id: '3', name: '名称3', remark: '备注3'},
    {id: '4', name: '名称4', remark: '备注4'},
];

const CheckboxTable = renderTableCheckbox(Table);

@config({
    path: '/table/select',
})
export default class TableSelect extends React.Component {
    state = {
        dataSource: [],
        selectedRowKeys: [],
        selectedRows: [],
    };
    columns = [
        {
            title: '名称', dataIndex: 'name',
            render: (value, record) => value + 2222,
        },
        {title: '备注', dataIndex: 'remark'},
    ];

    componentDidMount() {
        this.setState({dataSource: convertToTree(testDataSource)});
    }

    handleChange = (selectedRowKeys, selectedRows) => {

        this.setState({selectedRowKeys, selectedRows});
    };

    render() {
        const {dataSource, selectedRowKeys} = this.state;

        console.log('selectedRowKeys', selectedRowKeys);

        return (
            <PageContent>
                <CheckboxTable
                    checkboxIndex={false}
                    fitHeight
                    rowSelection={{
                        selectedRowKeys,
                        onChange: this.handleChange,
                    }}
                    columns={this.columns}
                    dataSource={dataSource}
                    rowKey="id"
                    pagination={false}
                />
            </PageContent>
        );
    }
}
