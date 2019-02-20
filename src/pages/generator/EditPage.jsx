import React, {Component} from 'react';
import {
    Form,
    Row,
    Col,
    Button,
    Popconfirm,
} from 'antd';
import uuid from 'uuid/v4';
import {FormElement, Operator, rowDraggable, TableEditable} from '@/library/antd';
import {connect} from "@/models";
import {typeOptions, getTypeByMysqlType} from "@/pages/generator/utils";

const Table = rowDraggable(TableEditable);

@connect(state => ({
    baseInfo: state.baseInfo,
    editPage: state.editPage,
    listPage: state.listPage,
    pagesDirectories: state.generator.pagesDirectories,
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
            width: '30%',
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
            width: '30%',
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
            title: '类型',
            dataIndex: 'type',
            key: 'type',
            width: '20%',
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
            const routePath = `/${name}/_/edit/:id`;
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
            item && item.validateFieldsAndScroll((err, values) => {
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
            // 过滤掉一些字段
            if (
                item.dataIndex === 'id'
                || item.dataIndex === 'createTime'
                || item.dataIndex === 'updateTime'
            ) return;

            if (!oldFieldsValue.find(it => it.dataIndex === item.dataIndex)) {
                oldFieldsValue.push({
                    id: uuid(),
                    title: item.title,
                    dataIndex: item.dataIndex,
                    type: getTypeByMysqlType(item.sqlType),
                    length: item.sqlLength,
                    isNullable: item.isNullable,
                    isRequired: !item.isNullable,
                });
            }
        });

        const newFieldsValue = oldFieldsValue.filter(item => item.title || item.dataIndex);

        console.log(newFieldsValue);
        this.props.form.setFieldsValue({fields: newFieldsValue});
    };

    renderTableTitle = () => {
        const {fields: {value}} = this.props.editPage;
        const {fields: {value: listPageFields}} = this.props.listPage;
        const hasListPageField = listPageFields && listPageFields.length && !(listPageFields.length === 1 && !listPageFields[0].dataIndex && !listPageFields[0].title);

        const noSameField = !value?.length || (value.length === 1 && !value[0].dataIndex && !value[0].title);

        return (
            <div>
                {noSameField ? (
                    <Button disabled={!hasListPageField} onClick={this.handleSyncListPageFields}>同步列表页</Button>
                ) : (
                    <Popconfirm title="以下表单中同名字段保留，新增不同名字段" onConfirm={this.handleSyncListPageFields} okText="确定" cancelText="取消">
                        <Button disabled={!hasListPageField}>同步列表页</Button>
                    </Popconfirm>
                )}
                <this.ClearTable field="fields"/>
                <Button style={{marginLeft: 8}} type="primary" onClick={this.props.onPreviewCode}>代码预览</Button>
            </div>
        );
    };

    ClearTable = ({field, type = 'danger'}) => {
        const fieldValue = this.props.form.getFieldValue(field);
        const isEmpty = !fieldValue?.length || (fieldValue.length === 1 && !fieldValue[0].title);

        if (isEmpty) return null;

        return (
            <Popconfirm title="您确认清空吗？" onConfirm={() => this.props.form.setFieldsValue({[field]: []})}>
                {type === 'link' ? (
                    <a style={{marginLeft: 8, color: 'red'}}>清空</a>
                ) : (
                    <Button style={{marginLeft: 8}} type={type}>清空</Button>
                )}
            </Popconfirm>
        );
    };

    handleSortEnd = ({oldIndex, newIndex, field}) => {
        const {setFieldsValue, getFieldValue} = this.props.form;
        const dataSource = [...getFieldValue(field)];

        dataSource.splice(newIndex, 0, dataSource.splice(oldIndex, 1)[0]);

        setFieldsValue({[field]: dataSource})
    };

    FormElement = (props) => <FormElement form={this.props.form} {...props}/>;

    render() {
        const {
            form: {getFieldDecorator},
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
                {getFieldDecorator('fields', {getValueFromEvent: (nextDataSource) => nextDataSource, valuePropName: 'dataSource'})(
                    <Table
                        size="small"
                        formRef={form => this.fieldsTableForm = form}
                        title={this.renderTableTitle}
                        columns={this.fieldsColumns}
                        helperClass="generator-helper-element"
                        onSortEnd={({oldIndex, newIndex}) => this.handleSortEnd({oldIndex, newIndex, field: 'fields'})}
                        newRecord={{type: 'input'}}
                    />
                )}
            </Form>
        );
    }
}
