import React from 'react';
import DemoPage from '@/library/antd/demo-page';
import * as Base from '@/library/antd/components/operator/demo/Base';
import config from '@/commons/config-hoc';

const demos = [
    {
        component: Base.default,
        title: Base.title,
        markdown: Base.markdown,
        code: `
import React, {Component} from 'react';
import {Table} from 'antd';
import uuid from 'uuid/v4';
import {Operator} from '../sx-antd';

export default class Base extends Component {
    state = {
        dataSource: [
            {id: uuid(), name: '熊大'},
            {id: uuid(), name: '熊二'},
            {id: uuid(), name: '光头强'},
        ],
    };
    columns = [
        {title: '用户名', dataIndex: 'name', key: 'name'},
        {
            title: '操作',
            render: (text, record) => {
                const {id, name} = record;
                const items = [
                    {
                        label: '详情',
                        onClick: () => console.log(id, name),
                    },
                    {
                        label: '删除',
                        disabled: name === '熊大',
                        color: 'red',
                        confirm: {
                            title: \`您确认删除\${name}吗？\`,
                            onConfirm: () => console.log(id, name),
                        },
                    },
                    {
                        label: '审批',
                        prompt: {
                            title: '请输入审批意见',
                            onConfirm: (values) => console.log(values),
                        },
                    },
                    {
                        label: '审批2',
                        prompt: {
                            title: '请输入审批意见',
                            items: [
                                {label: '姓名', labelSpaceCount: 2, field: 'name', type: 'input'},
                                {label: '年龄', labelSpaceCount: 2, field: 'age', type: 'number'},
                            ],
                            onConfirm: (values) => console.log(values),
                        },
                    },
                    {
                        label: '状态',
                        statusSwitch: {
                            title: '您确定切换状态？',
                            status: name === '熊大',
                            onConfirm: (e) => console.log(e),
                        },
                    },
                    {label: '添加2', onClick: () => console.log(name), isMore: true},
                    {label: '添加3', onClick: () => console.log(name), isMore: true},
                    {label: '添加4', onClick: () => console.log(name), isMore: true},
                    {label: '添加5', onClick: () => console.log(name), isMore: true},
                ];
                return <Operator items={items}/>
            },
        }
    ];

    render() {
        const {dataSource} = this.state;

        return (
            <Table
                columns={this.columns}
                rowKey={(record) => record.id}
                dataSource={dataSource}
            />
        );
    }
}


        `,
    },
];
const readme = `# 操作

## 何时使用
一般用于列表最后的操作列

`;
const api = `## API


参数|说明|类型|默认值
---|---|---|---
items | 每一项的配置 | array | -
moreContentWidth | 更多弹出面板宽度 | string 或 number | 'auto'
moreTrigger | 更多触发方式 | string 或 array | 'click'
moreText | 更多文本 | any | \`<span>更多<Icon type="down"/></span>\`

### items项

参数|说明|类型|默认值
---|---|---|---
label | 显示的文本 | any | -
icon | 显示的图标，Ant Design 官网支持的图标。label将作为Tooltip的title | string | -
visible | 是否可见 | bool | true
disabled | 是否禁用 | bool | false
color | label颜色 | string | -
loading | 是否加载中 | bool | false
isMore | 是否是更多选项 | bool | false
onClick | 点击事件 | function() {} | -
confirm | 气泡确认框，一般用于删除提示等，如果存在此选项，将是确认框形式，参见 [Popconfirm](http://ant-design.gitee.io/components/popconfirm-cn/)配置 | object | -
withKey | 气泡确认框模式下，是否配合 command alt ctrl键，不弹出提示 | bool | true
statusSwitch | 状态切换配置，如果存在此项，将是状态切换按钮 | object | -

`;

@config({
    path: '/example/antd/operator',
})
export default class extends React.Component {
    render() {
        return <DemoPage demos={demos} readme={readme} api={api}/>;
    }
};
