import React from 'react';
import DemoPage from '@/library/antd/demo-page';
import * as Basic from '@/library/antd/components/table-editable/demo/Basic';
import * as EnterNext from '@/library/antd/components/table-editable/demo/EnterNext';
import config from '@/commons/config-hoc';

const demos = [
    {
        component: Basic.default,
        title: Basic.title,
        markdown: Basic.markdown,
        code: `
import React, {Component} from 'react';
import {Button} from 'antd';
import uuid from 'uuid/v4';
import {TableEditable, Operator} from '../sx-antd';

const jobs = {
    '1': '护林员',
    '2': '伐木工',
    '3': '程序员',
};

export default class extends Component {
    state = {
        dataSource: [
            {editable: ['name'], id: '1', name: '熊大', loginName: 'xiongda', job: '1', jobName: '护林员', age: 22},
            {editable: false, id: '2', name: '熊二', loginName: 'xionger', job: '1', jobName: '护林员', age: 20},
            {showEdit: false, editable: true, id: '3', name: '光头强', loginName: 'guangtouqiang', job: '2', jobName: '伐木工', age: 30},
            {editable: true, id: '4', name: '', loginName: 'monkeyKing', job: '2', jobName: '伐木工', age: 29},
        ],
    };
    columns = [
        {
            title: '用户名', width: 200, dataIndex: 'name', key: 'name',
            props: {
                type: 'input',
                placeholder: '请输入用户名',
                decorator: {
                    rules: [
                        {required: true, message: '请输入用户名!'}
                    ],
                },
            }
        },
        {
            title: '登录名', width: 200, dataIndex: 'loginName', key: 'loginName',
            props: {
                type: 'input',
                placeholder: '请输入登录名',
                decorator: {
                    rules: [
                        {required: true, message: '请输入登录名!'}
                    ],
                },
            }
        },
        {
            title: '职业', width: 200, dataIndex: 'job', key: 'job',
            render: (text) => {
                return jobs[text];
            },
            props: {
                type: 'select',
                placeholder: '请选择职业',
                options: [
                    {label: '护林员', value: '1'},
                    {label: '伐木工', value: '2'},
                    {label: '程序员', value: '3'},
                ],
                decorator: {
                    rules: [
                        {required: true, message: '请选择职业!'}
                    ],
                },
            }
        },
        // 缺省了props，将为不可编辑
        {title: '年龄', width: 60, dataIndex: 'age', key: 'dataIndex'},
        {
            title: '操作',
            width: 100,
            render: (text, record) => {
                // 注意这 showEdit 和 editable 要默认为true
                const {showEdit = true, editable = true} = record;

                if (showEdit && editable) {
                    return (
                        <Operator items={[
                            {label: '保存', onClick: record.save},
                            {label: '取消', onClick: record.cancel},
                        ]}/>
                    );
                }

                return (
                    <Operator items={[
                        {
                            label: '编辑',
                            disabled: editable === false,
                            onClick: () => {
                                const dataSource = [...this.state.dataSource];
                                const r = dataSource.find(item => item.id === record.id);
                                r.showEdit = true;

                                this.setState({dataSource});
                            }
                        }
                    ]}/>
                );
            }
        }
    ];

    handleChange = (dataSource) => {
        this.setState({dataSource});
    };

    handleAdd = () => {
        const dataSource = [...this.state.dataSource];
        dataSource.unshift({
            id: uuid(),
            editable: true,
            name: void 0,
            loginName: void 0,
            job: void 0,
            jobName: void 0
        });

        this.setState({dataSource});
    };

    handleSubmit = () => {
        // this.tableForm可以用来做校验，编辑过得数据已经同步到 this.state.value中
        this.tableForm.validateFieldsAndScroll((err, values) => {
            if (err) return;
            // values为编辑过得数据，会带有后缀
            console.log(values);
            // this.state.dataSource 是之前未保存的数据
            console.log(this.state.dataSource);
        });
    };

    render() {
        const {dataSource} = this.state;
        return (
            <div>
                <Button style={{marginBottom: 16}} type="primary" onClick={this.handleAdd}>添加</Button>
                <TableEditable
                    formRef={(form) => this.tableForm = form}
                    showAddButton
                    columns={this.columns}
                    dataSource={dataSource}
                    onChange={this.handleChange}
                    rowKey="id"
                />
                <Button style={{marginTop: 16}} type="primary" onClick={this.handleSubmit}>提交</Button>
            </div>
        );
    }
}


        `,
    },

    {
        component: EnterNext.default,
        title: EnterNext.title,
        markdown: EnterNext.markdown,
        code: `
import React, {Component} from 'react';
import uuid from 'uuid/v4';
import {TableEditable} from '../sx-antd';

function focusAndSelect(e, index) {
    // 获取父级tr
    let currentTr = e.target;
    while (currentTr && currentTr.tagName !== 'TR') {
        currentTr = currentTr.parentNode;
    }

    const nextInput = currentTr.getElementsByTagName('input')[index];
    nextInput.focus();
    nextInput.select();
}

export default class extends Component {
    state = {
        dataSource: [
            {id: '1', name: '熊大', loginName: 'xiongda', job: '1', jobName: '护林员', age: 22},
            {id: '2', name: '熊二', loginName: 'xionger', job: '1', jobName: '护林员', age: 20},
        ],
    };
    columns = [
        {
            title: '用户名', dataIndex: 'name', key: 'name',
            props: {
                type: 'input',
                placeholder: '请输入用户名',
                onPressEnter: (e) => focusAndSelect(e, 1),
                decorator: {
                    rules: [
                        {required: true, message: '请输入用户名!'}
                    ],
                },
            }
        },
        {
            title: '登录名', dataIndex: 'loginName', key: 'loginName',
            props: {
                type: 'input',
                placeholder: '请输入登录名',
                onPressEnter: (e) => focusAndSelect(e, 2),
                decorator: {
                    rules: [
                        {required: true, message: '请输入登录名!'}
                    ],
                },
            }
        },
        {
            title: '年龄', dataIndex: 'age', key: 'age',
            props: {
                type: 'input',
                placeholder: '请输入年龄',
                onPressEnter: (e) => {
                    const dataSource = [...this.state.dataSource];

                    // 获取父级tr
                    let currentTr = e.target;
                    while (currentTr && currentTr.tagName !== 'TR') {
                        currentTr = currentTr.parentNode;
                    }

                    const nextTr = currentTr.nextSibling;

                    // 当前输入框在最后一行，新增一行，并且新增行第一个输入框获取焦点
                    if (!nextTr) {
                        dataSource.push({id: uuid(), name: void 0, loginName: void 0, age: void 0});
                        this.setState({dataSource}, () => {
                            const nextInput = currentTr.nextSibling.getElementsByTagName('input')[0];

                            nextInput.focus();
                            nextInput.select();
                        });
                    } else {
                        const nextInput = nextTr.getElementsByTagName('input')[0];
                        nextInput.focus();
                        nextInput.select();
                    }
                },
                decorator: {
                    rules: [
                        {required: true, message: '请输入年龄!'}
                    ],
                },
            }
        },
    ];

    handleChange = (dataSource) => {
        this.setState({dataSource});
    };

    render() {
        const {dataSource} = this.state;
        return (
            <div>
                <TableEditable
                    formRef={(form) => this.tableForm = form}
                    showAddButton
                    columns={this.columns}
                    dataSource={dataSource}
                    onChange={this.handleChange}
                    rowKey="id"
                />
            </div>
        );
    }
}


        `,
    },
];
const readme = `# 可编辑表格

`;
const api = `## API


参数|说明|类型|默认值
---|---|---|---
formRef | 用于获取内部from对象，使用from.validateFieldsAndScroll方法对表格进行校验 | function(form) {} | -
dataSource | 表格的dataSource，表格所需要渲染的数据 | array | - 
onChange | 表格中任意表单元素改变会触发此函数，参数是编辑完成的 dataSource | function (dataSource) | -
columns | 表格列配置 | array | -
showAdd | 是否显示表格底部的添加按钮 | bool | true
addText | 添加按钮文案 | ReactNode 或 string | '添加'

### columns 项中的 props

如果props缺省，此列将不可编辑

FormElement 所需属性。column其他配置同 Ant Design Table

常用属性如下

参数|说明|类型|默认值
---|---|---|---
dataIndex | 从每行record获取数据的key，默认为column中配置的dataIndex，如果column中的dataIndex并不是要编辑的（比如select，显示与编辑并不是一个dataIndex），可以使用此属性 | string | \`columns[x].dataIndex\`
type | 元素类型，比如：'input' | string | 'input'
decorator | form.getFieldDecorator 函数的第二个参数，通常写些校验规则等 | object | -
getValue | 获取表单元素的方式 | function | (e) => e.target ? e.target.value : e

### dataSource属性说明

dataSource中每一项（record），除了正常的业务数据外，额外有以下属性

参数|说明|类型|默认值
---|---|---|---
editable | 用于标记这一条数据中，那些是可编辑的，editable: true 所有都可编辑，editable: false 所有都不可编辑，editable: \`[key1, key2]\`只用key1，key2对应的数据可编辑| bool 或 array | true
showEdit | 是否显示编辑，与editable配合切换单元格的编辑、非编辑形式| bool | true

value中每一项（record），额外被添加了如下属性：

参数|说明|类型|默认值
---|---|---|---
__changed | 标记此记录被编辑过的字段 | Set | -
__add | 标记此记录为新增记录 | bool | true
save | 保存操作 | function | true
cancel | 取消操作 | function | true

### 校验

#### 单独行保存
dataSource每一项（record），额外添加了\`save\`方法，用于保存当前行数据，会触发onChange 方法

\`\`\`jsx
    columns = [
        ...
        {
            title: '操作',
            render: (text, record) => {
                return (
                    <a
                        onClick={record.save}
                    >保存</a>
                );
            },
        }
    ];
\`\`\`

#### 整体校验

通过formRef 拿到 TableEditable内部form，进行校验，代码片段如下：

\`\`\`jsx
    <TableEditable
        formRef={(form) => this.tableForm = form}
        ....
    />
    ...
    handleSubmit = () => {
        // this.tableForm可以用来做校验
        this.tableForm.validateFieldsAndScroll((err, values) => {
            if (err) return;
        });
    };
\`\`\`






 
`;

@config({
    path: '/example/antd/table-editable',
})
export default class extends React.Component {
    render() {
        return <DemoPage demos={demos} readme={readme} api={api}/>;
    }
};
