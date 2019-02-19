import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Table, Button, Form} from 'antd';
import 'antd/lib/form/style/css';
import uuid from 'uuid/v4';
import FormElement from '../form-element';
import classnames from 'classnames';
import './index.less';

@Form.create()
export default class FieldsTable extends Component {
    static propTypes = {
        formRef: PropTypes.func,
        dataSource: PropTypes.array,
        onChange: PropTypes.func,
        columns: PropTypes.array,
        rowKey: PropTypes.string.isRequired,
        showAdd: PropTypes.bool,
        addText: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),

    };

    static defaultProps = {
        rowKey: 'id',
        dataSource: [],
        showAdd: true,
        addText: '添加',
        onChange: () => true,
    };

    state = {};

    componentWillMount() {
        const {formRef, form} = this.props;
        if (formRef) formRef(form);
    }

    renderColumns = (text, record, column) => {
        let {dataIndex, props} = column;
        if (!props) return text;

        const {editable = true, showEdit = true} = record;

        if (editable === false || showEdit === false) return text;

        if (editable && editable.length && editable.indexOf(dataIndex) === -1) return text;

        if (props.dataIndex) dataIndex = props.dataIndex;

        const {onChange, form, rowKey} = this.props;
        const id = record[rowKey];

        props.field = `${dataIndex}-${id}`;
        props.colon = false;
        props.label = props.label === void 0 ? ' ' : props.label;
        props.labelWidth = props.labelWidth === void 0 ? 20 : props.labelWidth;

        if (!record.__form_fields) record.__form_fields = new Set();
        record.__form_fields.add(props.field);

        if (!record.__validate) {
            record.__validate = (fields, callback) => {
                if (!callback) {
                    callback = fields;
                    fields = void 0;
                }

                let validateFields = Array.from(record.__form_fields);
                if (fields) {
                    validateFields = fields.map(item => `${item}-${id}`)
                }


                const {form} = this.props;

                form.validateFieldsAndScroll(validateFields, (err, values) => {
                    const realValues = {};

                    Object.keys(values).forEach(key => {
                        const realKey = key.split('-')[0];
                        realValues[realKey] = values[key];
                    });

                    callback(err, realValues);
                });
            };
        }

        if (!record.save) {
            record.save = () => {
                // 单独校验此行
                record.__validate((err, values) => {
                    if (err) return;
                    // values 编辑过的新数据
                    // console.log(values);
                    // record 原始未编辑过得数据
                    // console.log(record);
                    const newRecord = {...record, ...values, showEdit: false};
                    const dataSource = [...this.props.dataSource];
                    const index = dataSource.findIndex(item => item.id === newRecord.id);

                    dataSource.splice(index, 1, newRecord);

                    onChange(dataSource);
                });
            }
        }
        if (!record.cancel) {
            record.cancel = () => {
                const dataSource = [...this.props.dataSource];
                const r = dataSource.find(item => item.id === record.id);
                r.showEdit = false;
                onChange(dataSource);
            }
        }


        const decorator = {};

        decorator.initialValue = record[dataIndex];

        return <FormElement form={form} {...props} decorator={{...props.decorator, ...decorator}}/>
    };

    handleAddNewRow = () => {
        const {dataSource, onChange, columns, rowKey, newRecord} = this.props;
        const record = {__add: true, ...newRecord};

        if (columns && columns.length) {
            columns.forEach(({dataIndex}) => {
                if (dataIndex) {
                    record[dataIndex] = void 0;
                }
            })
        }
        record[rowKey] = uuid();

        onChange([...dataSource, {...record}]);
    };

    render() {
        let {
            dataSource,
            onChange,
            style,
            formRef,
            className,
            rowKey,
            showAdd,
            addText,
            footer,
            ...others
        } = this.props;

        const tableDataSource = [...dataSource];

        const columns = this.props.columns.map(item => {
            const {render} = item;
            return {
                ...item,
                render: (text, record) => {
                    if (render) text = render(text, record);
                    return this.renderColumns(text, record, item);
                },
            }
        });

        const classNames = classnames('sx-table-editable', className);

        let ft;

        if (footer) ft = footer;

        if (showAdd) ft = () => (
            <Button
                icon="plus"
                style={{width: '100%', height: '80px', lineHeight: '80px'}}
                type="dashed"
                onClick={this.handleAddNewRow}
            >{addText}</Button>
        );

        return (
            <Table
                className={classNames}
                bordered
                pagination={false}
                {...others}
                columns={columns}
                dataSource={tableDataSource}
                rowKey={rowKey}
                footer={ft}
            />
        );
    }
}
