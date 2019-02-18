import React, {Component} from 'react';
import {
    Form,
    Input,
    Row,
    Col,
    TreeSelect,
    Tooltip,
    Icon,
    Button,
    Popconfirm,
} from 'antd';
import uuid from 'uuid/v4';
import {FormItemLayout, Operator} from 'sx-antd';
import EditableTable from './EditableTable';
import {connect} from "../models";

@connect(state => ({
    baseInfo: state.baseInfo,
    editPage: state.editPage,
    listPage: state.listPage,
    srcDirectories: state.generator.srcDirectories,
}))
@Form.create({
    mapPropsToFields: (props) => {
        const fields = {};
        const editPage = props.editPage;

        [
            'ajaxUrl',
            'routePath',
            'outPutDir',
            'outPutFile',
            'template',
            'fields',
        ].forEach(key => {
            fields[key] = Form.createFormField({
                ...editPage[key],
                value: editPage[key].value,
            });
        });

        return fields;
    },
    onFieldsChange: (props, fields) => {
        props.action.editPage.setFields(fields);
    },
})
export default class EditPage extends Component {
    state = {};

    fieldsColumns = [
        {
            title: '字段名',
            dataIndex: 'dataIndex',
            key: 'dataIndex',
            width: '40%',
            props: {
                type: 'input',
                placeholder: '请输入字段名',
                decorator: {
                    rules: [
                        // TODO 字段名合法性校验
                        {required: true, message: '请输入字段名！'},
                        {
                            validator: (rule, value, callback) => {
                                const {fields} = this.props.editPage;
                                let count = 0;

                                fields.value.forEach(item => {
                                    if (item.dataIndex === value) count += 1;
                                });

                                count === 2 ? callback('不可添加重复字段名！') : callback();
                            },
                        }
                    ],
                },
                elementProps: {
                    onPressEnter: (e) => {
                        const currentTr = e.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
                        currentTr.getElementsByTagName('input')[1].focus();
                    },
                },
            },
        },
        {
            title: '中文名',
            dataIndex: 'title',
            key: 'title',
            width: '40%',
            props: {
                type: 'input',
                placeholder: '请输入中文名',
                decorator: {
                    rules: [
                        {required: true, message: '请输入中文名！'},
                    ],
                    onKeyUp: (e) => {
                        console.log(e);
                    },
                },
                elementProps: {
                    onPressEnter: (e) => {
                        const {form: {getFieldValue, setFieldsValue}} = this.props;
                        const value = getFieldValue('fields');
                        const currentTr = e.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
                        const nextTr = currentTr.nextSibling;

                        if (!nextTr) { // 当前输入框在最后一行，新增一行，并且新增行第一个输入框获取焦点
                            value.push({id: uuid(), title: '', dataIndex: ''});
                            setFieldsValue({fields: value});
                            setTimeout(() => currentTr.nextSibling.getElementsByTagName('input')[0].focus());
                        } else {
                            nextTr.getElementsByTagName('input')[0].focus();
                        }
                    },
                },
            },
        },
        {
            title: '操作',
            width: '20%',
            dataIndex: 'operator',
            render: (text, record) => {
                const {id, title, dataIndex} = record;
                const {form: {getFieldValue, setFieldsValue}} = this.props;
                const value = getFieldValue('fields');

                const deleteItem = {
                    disabled: (!value || value.length <= 1), // 只用一个字段时，不予许删除
                    label: '删除',
                    confirm: {
                        title: `您确定要删除"${title || dataIndex}"吗？`,
                        onConfirm: () => {
                            const newValue = value.filter(item => item.id !== id);
                            setFieldsValue({fields: newValue});
                        },
                    },
                };

                // 什么信息没填写，直接删除
                if (!title && !dataIndex) {
                    Reflect.deleteProperty(deleteItem, 'confirm');
                    deleteItem.onClick = () => {
                        const newValue = value.filter(item => item.id !== id);
                        setFieldsValue({fields: newValue});
                    };
                }

                const items = [
                    deleteItem,
                ];
                return <Operator items={items}/>;

            },
        },
    ];

    componentWillMount() {
        const {formRef, form, validate} = this.props;
        if (formRef) formRef(form);
        if (validate) validate(this.validate);

        this.props.action.generator.getSrcDirs({
            onResolve: (dirs) => {
                if (dirs && dirs.length) {
                    const dir = dirs.find(item => (item.value.endsWith('/src/pages') || item.value.endsWith('\\src\\pages')));
                    if (dir) {
                        form.setFieldsValue({outPutDir: dir.value});
                    }
                }
            },
        });
    }

    componentWillReceiveProps(nextProps) {
        const {form: {setFieldsValue}} = this.props;
        const oldName = this.props.baseInfo.name.value;
        const name = nextProps.baseInfo.name.value;
        const capitalName = nextProps.baseInfo.capitalName.value;

        if (name !== oldName) {
            const ajaxUrl = `/${name}`;
            const routePath = `/${name}/+edit/:id`;
            const outPutFile = `${name}/${capitalName}Edit.jsx`;

            setFieldsValue({
                ajaxUrl,
                routePath,
                outPutFile,
            });
        }
    }

    validate = () => {
        const {form} = this.props;

        const promises = [
            form,
            this.fieldsTableForm,
        ].map(item => new Promise((resolve, reject) => {
            item.validateFieldsAndScroll((err, values) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(values)
                }
            });
        }));

        return Promise.all(promises).then(([editPage]) => editPage);
    };

    handleSyncListPageFields = () => {
        const {fields} = this.props.listPage;
        const listPageFieldsValue = fields.value || [];
        const oldFieldsValue = [...this.props.editPage.fields.value];

        listPageFieldsValue.forEach(item => {
            if (!oldFieldsValue.find(it => it.dataIndex === item.dataIndex)) {
                oldFieldsValue.push({...item, id: uuid()});
            }
        });

        const newFieldsValue = oldFieldsValue.filter(item => item.title || item.dataIndex);

        this.props.form.setFieldsValue({fields: newFieldsValue});
    };

    render() {
        const {
            form: {getFieldDecorator, getFieldError},
            srcDirectories,
            onPreviewCode,
        } = this.props;
        const labelSpaceCount = 12;
        const span = 8;
        const tipWidth = 30;

        return (
            <Form>
                {getFieldDecorator('template')(<Input type="hidden"/>)}
                <Row>
                    <Col span={span}>
                        <FormItemLayout
                            label="生成文件目录/文件名"
                            labelSpaceCount={labelSpaceCount}
                            tip={<div style={{float: 'left', margin: '0 8px'}}>/</div>}
                            tipWidth={tipWidth}
                        >
                            {getFieldDecorator('outPutDir', {
                                rules: [
                                    {required: true, message: '请选择生成文件的目录',},
                                ],
                            })(
                                <TreeSelect
                                    style={{width: '100%'}}
                                    showSearch
                                    dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                                    treeData={srcDirectories}
                                    placeholder="请选择生成文件的目录"
                                    treeDefaultExpandAll
                                    treeNodeLabelProp="shortValue"
                                />
                            )}
                        </FormItemLayout>
                    </Col>
                    <Col span={span}>
                        <FormItemLayout
                            labelWidth={0}
                            tip={(
                                <Tooltip
                                    placement="right"
                                    title="可以继续填写子目录，比如：user/UserList.jsx，将自动创建user目录"
                                >
                                    <Icon type="question-circle-o"/>
                                </Tooltip>
                            )}
                            tipWidth={tipWidth}
                        >
                            {getFieldDecorator('outPutFile', {
                                rules: [
                                    {required: true, message: '请输入生成的文件名',},
                                ],
                            })(
                                <Input placeholder="请输入生成的文件名"/>
                            )}
                        </FormItemLayout>
                    </Col>
                </Row>
                <Row>
                    <Col span={span}>
                        <FormItemLayout
                            label="ajax请求路径"
                            labelSpaceCount={labelSpaceCount}
                            tipWidth={tipWidth}
                        >
                            {getFieldDecorator('ajaxUrl', {
                                rules: [
                                    {required: true, message: '请输入ajax请求路径',},
                                ],
                            })(
                                <Input placeholder="请输入ajax请求路径"/>
                            )}
                        </FormItemLayout>
                    </Col>

                    <Col span={span}>
                        <FormItemLayout
                            label="页面路由地址"
                            labelSpaceCount={labelSpaceCount}
                            tipWidth={tipWidth}
                        >
                            {getFieldDecorator('routePath', {
                                rules: [
                                    {required: true, message: '请输入页面路由地址',},
                                ],
                            })(
                                <Input placeholder="请输入页面路由地址"/>
                            )}
                        </FormItemLayout>
                    </Col>
                </Row>
                {getFieldDecorator('fields')(
                    <EditableTable
                        formRef={form => this.fieldsTableForm = form}
                        hasError={getFieldError('fields')}
                        title={() => {
                            const {fields: {value}} = this.props.editPage;
                            const {fields: {value: listPageFields}} = this.props.listPage;
                            const hasListPageField = listPageFields && listPageFields.length && !(listPageFields.length === 1 && !listPageFields[0].dataIndex && !listPageFields[0].title);

                            if (!value || !value.length || (value.length === 1 && !value[0].dataIndex && !value[0].title)) {
                                return (
                                    <div>
                                        表单字段：
                                        <Button disabled={!hasListPageField} onClick={this.handleSyncListPageFields}>同步列表页</Button>
                                    </div>
                                );
                            }
                            return (
                                <div>
                                    表单字段：
                                    <Popconfirm title="以下表单中同名字段保留，新增不同名字段" onConfirm={this.handleSyncListPageFields} okText="确定" cancelText="取消">
                                        <Button disabled={!hasListPageField}>同步列表页</Button>
                                    </Popconfirm>
                                </div>
                            );
                        }}
                        columns={this.fieldsColumns}
                        newRecord={{id: uuid(), title: '', dataIndex: ''}}
                        onRowMoved={dataSource => this.props.form.setFieldsValue({fields: dataSource})}
                    />
                )}
                <div style={{marginTop: '16px'}}>
                    <Button type="primary" onClick={onPreviewCode}>代码预览</Button>
                </div>
            </Form>
        );
    }
}
