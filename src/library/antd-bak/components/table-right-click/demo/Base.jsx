import React, {Component} from 'react';
import {Table, Menu} from 'antd';
import uuid from 'uuid/v4';
import {TableRightClick} from '../../../index';

const RightClickTable = TableRightClick(Table);

export default class Base extends Component {
    state = {
        dataSource: [
            {id: uuid(), name: '熊大', age: 23, job: '护林员', position: '老大'},
            {id: uuid(), name: '熊二', age: 23, job: '护林员', position: '跟班'},
            {id: uuid(), name: '光头强', age: 23, job: '伐木工', position: 'leader'},
        ],
    };

    columns = [
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
    ];

    handleDelete = (id) => {
        const dataSource = this.state.dataSource.filter(item => item.id !== id);
        this.setState({dataSource});
    };

    handleRightClickContent = (record, index) => {
        console.log(record, index);
        return (
            <Menu
                onClick={(e) => {
                    console.log(e);
                }}
                style={{width: 256}}
                mode="vertical"
            >
                <Menu.ItemGroup title="Item 1">
                    <Menu.Item key="1">Option 1</Menu.Item>
                    <Menu.Item key="2">Option 2</Menu.Item>
                </Menu.ItemGroup>
                <Menu.ItemGroup title="Iteom 2">
                    <Menu.Item key="3">Option 3</Menu.Item>
                    <Menu.Item key="4">Option 4</Menu.Item>
                </Menu.ItemGroup>
            </Menu>
        );
    };

    render() {
        const {dataSource} = this.state;

        return (
            <div>
                <RightClickTable
                    rightClickContent={this.handleRightClickContent}
                    rowKey="id"
                    columns={this.columns}
                    dataSource={dataSource}
                    pagination={false}
                />
            </div>
        );
    }
}

export const title = '基础用法';

export const markdown = `
对atnd 的 table进行一层包装即可：\`const RightClickTable = TableRightClick(Table);\`    
`;
