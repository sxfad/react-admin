import React from 'react';
import DemoPage from '@/library/antd/demo-page';
import * as Base from '@/library/antd/components/pagination/demo/Base';
import config from '@/commons/config-hoc';

const demos = [
    {
        component: Base.default,
        title: Base.title,
        markdown: Base.markdown,
        code: `
import React, {Component} from 'react';
import {Pagination} from '../sx-antd';

export default class Base extends Component {
    state = {
        total: 108,
    };

    handlePageSizeChange = (pageSize) => {
        this.setState({pageSize});
    };

    handlePageNumChange = (pageNum) => {
        this.setState({pageNum});
    };

    render() {
        const {total, pageNum, pageSize} = this.state;
        return (
            <div>
                <Pagination
                    total={total}
                    pageNum={pageNum}
                    pageSize={pageSize}
                    onPageSizeChange={this.handlePageSizeChange}
                    onPageNumChange={this.handlePageNumChange}
                />
            </div>
        );
    }
}


        `,
    },
];
const readme = `# 分页组件

`;
const api = `## API


参数|说明|类型|默认值
---|---|---|---
showSizeChanger | 是否显示，每页显示条数 下拉框 | bool | true
showQuickJumper | 是否显示，跳转到 输入框 | bool | true
showMessage | 是否显示统计信息 | bool | true
pageSize | 每页显示记录数 | number | 10
pageNum | 当前页码 | number | 1
total | 数据总数 | number | 0
onPageNumChange | 页码改变触发 | function(pageNum) {} | -
onPageSizeChange | 每页显示条数 改变触发 | function(pageSize) {} | -`;

@config({
    path: '/example/antd/pagination',
})
export default class extends React.Component {
    render() {
        return <DemoPage demos={demos} readme={readme} api={api}/>;
    }
};
