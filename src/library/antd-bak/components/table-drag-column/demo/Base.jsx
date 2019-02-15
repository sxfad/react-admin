import React, {Component} from 'react';
import {Table} from 'antd';
import uuid from 'uuid/v4';
import {TableDragColumn} from '../../../index';

const DragColumnTable = TableDragColumn(Table);

export default class Base extends Component {
    state = {
        dataSource: [
            {id: uuid(), name: '熊大', age: 23, job: '护林员', position: '老大'},
            {id: uuid(), name: '熊二', age: 23, job: '护林员', position: '跟班'},
            {id: uuid(), name: '光头强', age: 23, job: '伐木工', position: 'leader'},
        ],
        columns: [
            {title: '姓名', dataIndex: 'name', key: 'name'},
            {title: '年龄', dataIndex: 'age', key: 'age'},
            {title: '工作', dataIndex: 'job', key: 'job'},
            {title: '职位', dataIndex: 'position', key: 'position'},
            {
                title: '操作',
                render: (text, {id}) => {
                    return <a onClick={() => this.handleDelete(id)}>删除</a>
                },
            }
        ],
    };

    handleDelete = (id) => {
        const dataSource = this.state.dataSource.filter(item => item.id !== id);

        this.setState({dataSource});
    };

    handleColumnMoved = (columns) => {
        // 可以对columns进行持久化存储，保存用户配置
        this.setState({columns});
    };

    render() {
        const {dataSource, columns} = this.state;

        return (
            <div>
                <DragColumnTable
                    onColumnMoved={this.handleColumnMoved}
                    rowKey="id"
                    columns={columns}
                    dataSource={dataSource}
                    pagination={false}
                />
            </div>
        );
    }
}

export const title = '基础用法';

export const markdown = `
对atnd 的 table进行一层包装即可：\`const DragColumnTable = TableDragColumn(Table);\`    
`;
