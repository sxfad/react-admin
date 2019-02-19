import React, {Component} from 'react';
import {Table} from 'antd';
import {rowDraggable} from '../../../index';

const TableRowDraggable = rowDraggable(Table);

export default class extends Component {
    state = {
        dataSource: [
            {id: '11', name: '1', age: 12, job: '工作'},
            {id: '22', name: '2', age: 12, job: '工作'},
            {id: '33', name: '3', age: 12, job: '工作'},
            {id: '44', name: '4', age: 12, job: '工作'},
            {id: '55', name: '5', age: 12, job: '工作'},
            {id: '66', name: '6', age: 12, job: '工作'},
            {id: '77', name: '7', age: 12, job: '工作'},
            {id: '88', name: '8', age: 12, job: '工作'},
            {id: '99', name: '9', age: 12, job: '工作'},
            {id: '10', name: '10', age: 12, job: '工作'},
            {id: '111', name: '11', age: 12, job: '工作'},
            {id: '112', name: '12', age: 12, job: '工作'},
        ],
    };
    columns = [
        {title: '姓名', dataIndex: 'name', key: 'name', width: 80},
        {title: '年龄', dataIndex: 'age', key: 'age', width: 150},
        {title: '工作', dataIndex: 'job', key: 'job'},
    ];


    handleSortEnd = ({oldIndex, newIndex}) => {
        const dataSource = [...this.state.dataSource];
        dataSource.splice(newIndex, 0, dataSource.splice(oldIndex, 1)[0]);
        this.setState({dataSource});
    };

    render() {
        const {dataSource} = this.state;
        return (
            <div>
                <TableRowDraggable
                    onSortEnd={this.handleSortEnd}
                    columns={this.columns}
                    dataSource={dataSource}
                    rowKey="id"
                />
            </div>
        );
    }
}

export const title = '基础用法';

export const markdown = `
表格行可拖拽，装饰器方式
`;
