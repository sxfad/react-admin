import React from 'react';
import DemoPage from '@/library/antd/demo-page';
import * as Basic from '@/library/antd/components/table-row-draggable/demo/Basic';
import config from '@/commons/config-hoc';

const demos = [
    {
        component: Basic.default,
        title: Basic.title,
        markdown: Basic.markdown,
        code: `
import React, {Component} from 'react';
import {Table} from 'antd';
import {rowDraggable} from '../sx-antd';

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


        `,
    },
];
const readme = `# 表格行可拖拽
装饰器方式调用，包装原 Ant Design Table即可

`;
const api = `## API


参数|说明|类型|默认值
---|---|---|---
onSortStart | 开始拖拽 | function | -
onSortEnd | 结束拖拽 | function | - 

## 调用方式
其他属性同 Ant Design Table
\`\`\`js
import {rowDraggable} from 'path/to/table-row-draggable';

const TableRowDraggable = rowDraggable(Table);

...
<TableRowDraggable
    onSortEnd={this.handleSortEnd}
    columns={this.columns}
    dataSource={dataSource}
    rowKey="id"
/>
...
\`\`\`
`;

@config({
    path: '/example/antd/table-row-draggable',
})
export default class extends React.Component {
    render() {
        return <DemoPage demos={demos} readme={readme} api={api}/>;
    }
};
