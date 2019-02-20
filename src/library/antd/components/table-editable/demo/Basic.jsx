import React, {Component} from 'react';
import {Button} from 'antd';
import uuid from 'uuid/v4';
import {TableEditable, Operator} from '../../../index';

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
            },
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
                            {
                                label: '保存', onClick: () => {
                                    console.log('click');
                                    record.__save(dataSource => {
                                        this.setState({dataSource});
                                    });
                                }
                            },
                            {
                                label: '取消', onClick: () => {
                                    record.__cancel(dataSource => {
                                        this.setState({dataSource});
                                    });
                                }
                            },
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
        this.tableSubmit((err, values) => {
            if (err) return;
            console.log(values);
        });
    };

    render() {
        const {dataSource} = this.state;
        return (
            <div>
                <Button style={{marginBottom: 16}} type="primary" onClick={this.handleAdd}>添加</Button>
                <TableEditable
                    submitRef={submit => this.tableSubmit = submit}
                    showAddButton
                    columns={this.columns}
                    dataSource={dataSource}
                    rowKey="id"
                />
                <Button style={{marginTop: 16}} type="primary" onClick={this.handleSubmit}>提交</Button>
            </div>
        );
    }
}

export const title = '基础用法';

export const markdown = `
表格每一列最好声明width，编辑/展示切换时，列宽不会变
`;
