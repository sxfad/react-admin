import React, {Component} from 'react';
import {
    Form,
    Row,
    Col,
    Button,
    Popconfirm,
} from 'antd';
import uuid from 'uuid/v4';
import {FormElement, Operator, TableEditable} from "@/library/antd";
import {connect} from "@/models";
import {typeOptions} from './utils';

@connect(state => ({
    database: state.database,
    baseInfo: state.baseInfo,
    listPage: state.listPage,
    pagesDirectories: state.generator.pagesDirectories,
}))
@Form.create({
    mapPropsToFields: (props) => {
        const fields = {};
        const listPage = props.listPage;

        [
            'ajaxUrl',
            'routePath',
            'outPutDir',
            'outPutFile',
            'template',
            'fields',
            'queryItems',
            'toolItems',
            'bottomToolItems',
        ].forEach(key => {
            fields[key] = Form.createFormField({
                ...listPage[key],
                value: listPage[key].value,
            });
        });

        return fields;
    },
    onFieldsChange: (props, fields) => {
        props.action.listPage.setFields(fields);
    },
})
export default class ListPage extends Component {
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
                                const {fields} = this.props.listPage;
                                let count = 0;

                                fields.value.forEach(item => {
                                    if (item.dataIndex === value) count += 1;
                                });

                                count === 2 ? callback('不可添加重复字段名！') : callback();
                            },
                        }
                    ],
                },
                onPressEnter: (e) => {
                    const currentTr = e.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
                    currentTr.getElementsByTagName('input')[1].focus();
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
        {
            title: '操作',
            width: '20%',
            dataIndex: 'operator',
            render: (text, record) => {
                const {id, title, dataIndex} = record;
                const {form: {getFieldValue, setFieldsValue}} = this.props;
                const value = getFieldValue('fields');

                const {queryItems} = this.props.listPage;
                const queryItemExist = queryItems.value.find(item => item.field === dataIndex);

                const deleteItem = {
                    disabled: (!value || value.length <= 1), // 只用一个字段时，不予许删除
                    label: '删除',
                    color: 'red',
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
                    {
                        disabled: !!queryItemExist || !dataIndex,
                        label: '作为条件',
                        onClick: () => {
                            const items = [...queryItems.value];
                            items.push({
                                id: uuid(),
                                label: title,
                                field: dataIndex,
                                type: 'input',
                            });
                            setFieldsValue({queryItems: items});
                        },
                    },
                ];
                return <Operator items={items}/>;

            },
        },
    ];

    queryItemsColumns = [
        {
            title: '字段名',
            dataIndex: 'field',
            key: 'field',
            width: '25%',
            props: {
                type: 'input',
                placeholder: '请输入字段名',
                decorator: {
                    rules: [
                        // TODO 字段名合法性校验
                        {required: true, message: '请输入字段名！'},
                        {
                            validator: (rule, value, callback) => {
                                const {queryItems} = this.props.listPage;
                                let count = 0;

                                queryItems.value.forEach(item => {
                                    if (item.field === value) count += 1;
                                });

                                count === 2 ? callback('不可添加重复字段名！') : callback();
                            },
                        }
                    ],
                },
            },
        },
        {
            title: '中文名',
            dataIndex: 'label',
            key: 'label',
            width: '25%',
            props: {
                type: 'input',
                placeholder: '请输入中文名',
                decorator: {
                    rules: [
                        {required: true, message: '请输入中文名！'},
                    ],
                },
            },
        },
        {
            title: '类型',
            dataIndex: 'type',
            key: 'type',
            width: '25%',
            props: {
                type: 'select',
                placeholder: '请选择类型',
                decorator: {
                    initialValue: 'input',
                    rules: [
                        {required: true, message: '请选择类型'},
                    ],
                },
                getValue: e => e,
                options: typeOptions,
            },
        },
        {
            title: '操作',
            width: '25%',
            dataIndex: 'operator',
            render: (text, record) => {
                const {id, field, label} = record;
                const {form: {getFieldValue, setFieldsValue}} = this.props;
                const value = getFieldValue('queryItems');

                const deleteItem = {
                    label: '删除',
                    confirm: {
                        title: `您确定要删除"${label || field}"吗？`,
                        onConfirm: () => {
                            const newValue = value.filter(item => item.id !== id);
                            setFieldsValue({queryItems: newValue});
                        },
                    },
                };

                // 什么信息没填写，直接删除
                if (!field && !label) {
                    Reflect.deleteProperty(deleteItem, 'confirm');
                    deleteItem.onClick = () => {
                        const newValue = value.filter(item => item.id !== id);
                        setFieldsValue({queryItems: newValue});
                    };
                }

                const items = [
                    deleteItem,
                ];
                return <Operator items={items}/>;

            },
        },
    ];

    toolItemsColumns = [
        {
            title: '类型',
            dataIndex: 'type',
            key: 'type',
            width: '22%',
            props: {
                type: 'select',
                placeholder: '请选择类型',
                options: [
                    {value: 'primary', label: '主按钮'},
                    {value: 'default', label: '次按钮'},
                    {value: 'dashed', label: '虚线按钮'},
                    {value: 'danger', label: '危险按钮'},
                ],
                getValue: e => e,
                decorator: {
                    rules: [
                        {required: true, message: '请选择类型！'},
                    ],
                },
            },
        },
        {
            title: '名称',
            dataIndex: 'text',
            key: 'text',
            width: '22%',
            props: {
                type: 'input',
                placeholder: '请输入名称',
                decorator: {
                    rules: [
                        {required: true, message: '请输入名称！'},
                    ],
                },
            },
        },
        {
            title: '图标',
            dataIndex: 'icon',
            key: 'icon',
            width: '22%',
            props: {
                type: 'input',
                decorator: {
                    rules: [
                        {required: false, message: '请选择图标'},
                    ],
                },
            },
        },
        {
            title: '权限码',
            dataIndex: 'permission',
            key: 'permission',
            width: '22%',
            props: {
                type: 'input',
                placeholder: '请输入权限码',
                decorator: {
                    getValueFromEvent: e => {
                        const {value} = e.target;
                        return value ? value.toUpperCase() : '';
                    },
                },
            },
        },
        {
            title: '操作',
            width: '12%',
            dataIndex: 'operator',
            render: (_text, record) => {
                const {id, type, text} = record;
                const {form: {getFieldValue, setFieldsValue}} = this.props;
                const value = getFieldValue('toolItems');

                const deleteItem = {
                    label: '删除',
                    confirm: {
                        title: `您确定要删除"${text || type}"吗？`,
                        onConfirm: () => {
                            const newValue = value.filter(item => item.id !== id);
                            setFieldsValue({toolItems: newValue});
                        },
                    },
                };

                // 什么信息没填写，直接删除
                if (!text && !type) {
                    Reflect.deleteProperty(deleteItem, 'confirm');
                    deleteItem.onClick = () => {
                        const newValue = value.filter(item => item.id !== id);
                        setFieldsValue({toolItems: newValue});
                    };
                }

                const items = [
                    deleteItem,
                ];
                return <Operator items={items}/>;

            },
        },
    ];

    bottomToolItemsColumns = [
        {
            title: '类型',
            dataIndex: 'type',
            key: 'type',
            width: '22%',
            props: {
                type: 'select',
                placeholder: '请选择类型',
                options: [
                    {value: 'primary', label: '主按钮'},
                    {value: 'default', label: '次按钮'},
                    {value: 'dashed', label: '虚线按钮'},
                    {value: 'danger', label: '危险按钮'},
                ],
                decorator: {
                    rules: [
                        {required: true, message: '请选择类型！'},
                    ],
                },
            },
        },
        {
            title: '名称',
            dataIndex: 'text',
            key: 'text',
            width: '22%',
            props: {
                type: 'input',
                placeholder: '请输入名称',
                decorator: {
                    rules: [
                        {required: true, message: '请输入名称！'},
                    ],
                },
            },
        },
        {
            title: '图标',
            dataIndex: 'icon',
            key: 'icon',
            width: '22%',
            props: {
                type: 'input',
                decorator: {
                    rules: [
                        {required: false, message: '请选择图标'},
                    ],
                },
            },
        },
        {
            title: '权限码',
            dataIndex: 'permission',
            key: 'permission',
            width: '22%',
            props: {
                type: 'input',
                placeholder: '请输入权限码',
                decorator: {
                    getValueFromEvent: e => {
                        const {value} = e.target;
                        return value ? value.toUpperCase() : '';
                    },
                },
            },
        },
        {
            title: '操作',
            width: '12%',
            dataIndex: 'operator',
            render: (_text, record) => {
                const {id, type, text} = record;
                const {form: {getFieldValue, setFieldsValue}} = this.props;
                const value = getFieldValue('bottomToolItems');

                const deleteItem = {
                    label: '删除',
                    confirm: {
                        title: `您确定要删除"${text || type}"吗？`,
                        onConfirm: () => {
                            const newValue = value.filter(item => item.id !== id);
                            setFieldsValue({bottomToolItems: newValue});
                        },
                    },
                };

                // 什么信息没填写，直接删除
                if (!text && !type) {
                    Reflect.deleteProperty(deleteItem, 'confirm');
                    deleteItem.onClick = () => {
                        const newValue = value.filter(item => item.id !== id);
                        setFieldsValue({bottomToolItems: newValue});
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
            const routePath = `/${name}`;
            const outPutFile = `${name}/${capitalName}List.jsx`;

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
            this.queryItemsTableForm,
            this.toolItemsTableForm,
            this.bottomToolItemsTableForm,
        ].map(item => new Promise((resolve, reject) => {
            item.validateFieldsAndScroll((err, values) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(values)
                }
            });
        }));

        return Promise.all(promises).then(([listPage]) => listPage);
    };

    handleSyncDatabaseTableColumns = () => {
        const {
            database: {tableColumns},
        } = this.props;
        const oldFieldsValue = [...this.props.listPage.fields.value];

        tableColumns.forEach(item => {
            // 忽略id字段
            if (item.camelCaseName === 'id') return;

            if (!oldFieldsValue.find(it => it.dataIndex === item.camelCaseName)) {
                oldFieldsValue.push({
                    id: uuid(),
                    title: item.chinese,
                    dataIndex: item.camelCaseName,
                    sqlType: item.type,
                    sqlLength: item.length,
                });
            }
        });

        const newFieldsValue = oldFieldsValue.filter(item => item.title || item.dataIndex);

        this.props.form.setFieldsValue({fields: newFieldsValue});
    };

    renderTableTitle = (field) => {
        const {
            database: {tableColumns},
            listPage: {fields},
        } = this.props;
        const hasDatabaseTableColumns = tableColumns && tableColumns.length;
        const {value} = fields;
        const noSameField = !value?.length || (value.length === 1 && !value[0].dataIndex && !value[0].title);

        return (
            <div>
                表格字段：
                {noSameField ? (
                    <Button disabled={!hasDatabaseTableColumns} onClick={this.handleSyncDatabaseTableColumns}>同步数据库表字段</Button>
                ) : (
                    <Popconfirm title="以下表单中同名字段保留，新增不同名字段" onConfirm={this.handleSyncDatabaseTableColumns} okText="确定" cancelText="取消">
                        <Button disabled={!hasDatabaseTableColumns}>同步数据库表字段</Button>
                    </Popconfirm>
                )}
                <this.ClearTable field={field}/>
                <Button style={{marginLeft: 8}} type="primary" onClick={this.props.onPreviewCode}>代码预览</Button>
            </div>
        );
    };

    ClearTable = ({field}) => {
        const fieldValue = this.props.form.getFieldValue(field);

        if (fieldValue?.length) {
            return (
                <Popconfirm title="您确认清空吗？" onConfirm={() => this.props.form.setFieldsValue({[field]: []})}>
                    <Button style={{marginLeft: 8}} type="primary">清空</Button>
                </Popconfirm>
            );
        }
        return null;
    };

    FormElement = (props) => <FormElement form={this.props.form} {...props}/>;

    render() {
        const {
            form: {getFieldDecorator, getFieldError},
            pagesDirectories,
        } = this.props;

        const FormElement = this.FormElement;
        return (
            <Form>
                <FormElement type="hidden" field="template"/>
                <Row>
                    <Col span={14}>
                        <div style={{display: 'flex'}}>
                            <FormElement
                                wrapperStyle={{flex: 0}}
                                label="目录/文件名"
                                tip="可以继续填写子目录，比如：user/UserList.jsx，将自动创建user目录"
                                type="select-tree"
                                field="outPutDir"
                                decorator={{
                                    rules: [
                                        {required: true, message: '请选择生成文件的目录'},
                                    ],
                                }}
                                width={200}
                                showSearch
                                dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                                options={pagesDirectories}
                                treeDefaultExpandAll
                                treeNodeLabelProp="shortValue"
                            />
                            <FormElement
                                wrapperStyle={{flex: 1}}
                                width="100%"
                                label="/"
                                labelWidth={24}
                                required={false}
                                colon={false}
                                field="outPutFile"
                                placeholder="请输入生成的文件名"
                                decorator={{
                                    rules: [
                                        {required: true, message: '请输入生成的文件名'},
                                    ],
                                }}
                            />
                        </div>
                    </Col>
                    <Col span={5}>
                        <FormElement
                            label="ajax"
                            field="ajaxUrl"
                            decorator={{
                                rules: [
                                    {required: true, message: '请输入ajax请求路径'},
                                ],
                            }}
                        />
                    </Col>

                    <Col span={5}>
                        <FormElement
                            label="路由"
                            field="routePath"
                            decorator={{
                                rules: [
                                    {required: true, message: '请输入页面路由地址'},
                                ],
                            }}
                        />
                    </Col>
                </Row>
                {getFieldDecorator('fields', {getValueFromEvent: e => e, valuePropName: 'dataSource'})(
                    <TableEditable
                        size="small"
                        formRef={form => this.fieldsTableForm = form}
                        hasError={getFieldError('fields')}
                        title={() => this.renderTableTitle('fields')}
                        columns={this.fieldsColumns}
                        newRecord={{id: uuid(), title: '', dataIndex: ''}}
                        onRowMoved={dataSource => this.props.form.setFieldsValue({fields: dataSource})}
                    />
                )}

                {getFieldDecorator('queryItems', {getValueFromEvent: e => e, valuePropName: 'dataSource'})(
                    <TableEditable
                        size="small"
                        formRef={form => this.queryItemsTableForm = form}
                        hasError={getFieldError('queryItems')}
                        title={() => <span>查询条件：<this.ClearTable field="queryItems"/></span>}
                        columns={this.queryItemsColumns}
                        newRecord={{id: uuid(), field: '', label: '', type: 'input'}}
                        onRowMoved={dataSource => this.props.form.setFieldsValue({queryItems: dataSource})}
                    />
                )}

                {getFieldDecorator('toolItems', {getValueFromEvent: e => e, valuePropName: 'dataSource'})(
                    <TableEditable
                        size="small"
                        formRef={form => this.toolItemsTableForm = form}
                        hasError={getFieldError('toolItems')}
                        title={() => <span>顶部工具条：<this.ClearTable field="toolItems"/></span>}
                        columns={this.toolItemsColumns}
                        newRecord={{id: uuid(), type: '', text: '', icon: void 0}}
                        onRowMoved={dataSource => this.props.form.setFieldsValue({toolItems: dataSource})}
                    />
                )}

                {getFieldDecorator('bottomToolItems', {getValueFromEvent: e => e, valuePropName: 'dataSource'})(
                    <TableEditable
                        size="small"
                        formRef={form => this.bottomToolItemsTableForm = form}
                        hasError={getFieldError('bottomToolItems')}
                        title={() => <span>底部工具条：<this.ClearTable field="bottomToolItems"/></span>}
                        columns={this.bottomToolItemsColumns}
                        newRecord={{id: uuid(), type: '', text: '', icon: void 0}}
                        onRowMoved={dataSource => this.props.form.setFieldsValue({bottomToolItems: dataSource})}
                    />
                )}
            </Form>
        );
    }
}
