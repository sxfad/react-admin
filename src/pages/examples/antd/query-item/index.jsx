import React from 'react';
import DemoPage from '@/library/antd/demo-page';
import * as Base from '@/library/antd/components/query-item/demo/Base';
import * as Layout from '@/library/antd/components/query-item/demo/Layout';
import config from '@/commons/config-hoc';

const demos = [
    {
        component: Base.default,
        title: Base.title,
        markdown: Base.markdown,
        code: `
import React, {Component} from 'react';
import {QueryItem} from '../sx-antd';

export default class Base extends Component {
    render() {
        return (
            <div>
                <QueryItem
                    items={[
                        [
                            {
                                label: '用户名', field: 'name', type: 'input', placeholder: '请输入用户名',
                                decorator: {
                                    rules: [
                                        {required: true, message: '请输入用户名！'}
                                    ],
                                },
                            },
                            {
                                label: '工作', field: 'job', type: 'select', placeholder: '请选择工作',
                                options: [
                                    {label: '护理员', value: '1'},
                                    {label: '伐木工', value: '2'},
                                    {label: '程序员', value: '3'},
                                ],
                            },
                            {
                                label: '入职日期', field: 'join', type: 'date', placeholder: '请选择日期',
                            }
                        ]
                    ]}
                    onSubmit={(values) => {
                        console.log(values);
                    }}
                />
            </div>
        );
    }
}


        `,
    },

    {
        component: Layout.default,
        title: Layout.title,
        markdown: Layout.markdown,
        code: `
import React, {Component} from 'react';
import {QueryItem} from '../sx-antd';

export default class Base extends Component {
    fetchJobs = () => {
        return new Promise((resolve, reject) => {
            resolve([
                {value: '11', label: '产品经理'},
                {value: '22', label: '测试专员'},
                {value: '33', label: '前端开发'},
            ])
        })
    };

    fetchAddress = () => {
        return new Promise((resolve, reject) => {
            resolve([
                {
                    title: '北京',
                    value: '0-0',
                    key: '0-0',
                    children: [
                        {
                            title: '石景山区',
                            value: '0-0-1',
                            key: '0-0-1',
                        },
                        {
                            title: '海淀区',
                            value: '0-0-2',
                            key: '0-0-2',
                        },
                    ],
                },
                {
                    title: '上海',
                    value: '0-1',
                    key: '0-1',
                },
            ]);
        });
    };

    render() {
        return (
            <div>
                <QueryItem
                    loadOptions={() => {
                        return Promise.all([
                            this.fetchJobs(),
                            this.fetchAddress()]
                        ).then(([job, address]) => {
                            return {job, address};
                        });
                    }}
                    items={[
                        [
                            {
                                label: '用户名', labelWidth: 80, field: 'name', type: 'input', placeholder: '请输入用户名',
                                decorator: {
                                    rules: [
                                        {required: true, message: '请输入用户名！'}
                                    ],
                                },
                            },
                            {
                                label: '工作', labelWidth: 80, field: 'job', type: 'select', placeholder: '请选择工作',
                                decorator: {
                                    initialValue: '11',
                                },
                            },
                            {
                                label: '地址', labelWidth: 80, field: 'address', type: 'select-tree', placeholder: '请选择地址',
                            },
                        ],
                        [
                            {
                                label: '入职日期', labelWidth: 80, field: 'join2', type: 'date', placeholder: '请选择日期',
                                itemStyle: {flex: '12 12 12px'},
                            },
                        ]
                    ]}
                    onSubmit={(values) => {
                        console.log(values);
                    }}
                />
            </div>
        );
    }
}


        `,
    },
];
const readme = `# 查询条件
通过配置的方式，获取查询条件

## 何时使用
一般用于简单的列表页查询条件，通过配置，快速编写查询条件，太复杂的查询条件可能不适合；

`;
const api = `## API


参数|说明|类型|默认值
---|---|---|---
showSubmit | 是否显示提交按钮 | bool | true
submitText | 提交按钮文案 | ReactNode 或 string | '查询'
showReset | 是否显示重置按钮 | bool | true
resetText | 重置按钮文案 | ReactNode 或 string | '重置'
collapsed | 是否收起 | bool | false
items | 查询条件没一项配置 | object | -
onSubmit | 提交时触发（回车或则点击查询按钮）| function(values) {} | -
formRef | 获取内部form | function(form) {} | -
loadOptions | 获取下拉、下拉树等数据，一个返回object 或 Promise，数据以field作为key对应 | (form) => Promise | -
extra | 查询、重置按钮组中额外内容 | ReactNode 或 string | -
buttonContainerStyle | 查询、重置按钮组样式 | object | -

### items
参数|说明|类型|默认值
---|---|---|---
collapsedShow | 是否在收起时显示| bool | false
itemStyle | 最外层容器样式 | object | -
其他 | FormElement所需参数，[点击这里](/example/form-element/README.md) | - | -


`;

@config({
    path: '/example/antd/query-item',
})
export default class extends React.Component {
    render() {
        return <DemoPage demos={demos} readme={readme} api={api}/>;
    }
};
