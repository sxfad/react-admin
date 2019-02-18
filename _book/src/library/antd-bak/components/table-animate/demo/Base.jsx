import React, {Component} from 'react';
import {Table, Button} from 'antd';
import uuid from 'uuid/v4';
import {TableAnimate} from '../../../index';

const AnimateTable = TableAnimate(Table);

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

    handleAdd = () => {
        const dataSource = [...this.state.dataSource];
        dataSource.push({
            id: uuid(),
            name: '新增',
            age: 23,
            job: '前端',
            position: '高级',
        });

        this.setState({dataSource});
    };

    handleDelete = (id) => {
        const dataSource = this.state.dataSource.filter(item => item.id !== id);

        this.setState({dataSource});
    };

    render() {
        const {dataSource} = this.state;

        return (
            <div>
                <Button
                    style={{marginBottom: 16}}
                    type="primary"
                    onClick={this.handleAdd}
                >添加</Button>
                <AnimateTable
                    animationDuring={500}
                    inAnimationClass="animated fadeInLeft"
                    outAnimationClass="animated zoomOutRight"

                    rowKey={(record, index) => record.id}
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
对atnd 的 table进行一层包装即可：\`const AnimateTable = TableAnimate(Table);\`    
`;
