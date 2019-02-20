import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Table, Button, Form} from 'antd';
import 'antd/lib/form/style/css';
import uuid from 'uuid/v4';
import FormElement from '../form-element';
import classnames from 'classnames';
import './index.less';

const SEPARATOR = '-';

function getValues(values, rowKey) {
    const tempValues = {};

    Object.keys(values).forEach(key => {
        const realValue = values[key];
        const realKey = key.split(SEPARATOR)[0];

        const index = key.indexOf(SEPARATOR);
        if (index > -1) {
            const id = key.substring(index + 1);

            if (tempValues[id]) {
                tempValues[id][realKey] = realValue;
            } else {
                tempValues[id] = {[realKey]: realValue, [rowKey]: id};
            }
        }
    });
    const realValues = Object.keys(tempValues).map(id => tempValues[id]);
    return realValues?.length ? realValues : values;
}

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

    static getValues = getValues;

    componentWillMount() {
        const {formRef, form, submitRef} = this.props;
        if (formRef) formRef(form);

        if (submitRef) submitRef(this.handleSubmit);
    }

    handleSubmit = (callback) => {
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (err) return callback(err, values);
            const {rowKey} = this.props;
            const nextValues = getValues(values, rowKey);
            const nextDataSource = this.props.dataSource.map(item => {
                const id = item[rowKey];
                const nextItem = nextValues.find(it => it[rowKey] === id);
                return nextItem ? {...item, ...nextItem} : {...item};
            });

            callback(err, nextDataSource);
        });
    };

    renderColumns = (text, record, column) => {
        let {dataIndex, props} = column;
        if (!props) return text;

        const {editable = true, showEdit = true} = record;

        if (editable === false || showEdit === false) return text;

        if (editable?.length && !editable.includes(dataIndex)) return text;

        if (props.dataIndex) dataIndex = props.dataIndex;

        const {onChange, form, rowKey} = this.props;
        const id = record[rowKey];

        props.field = `${dataIndex}${SEPARATOR}${id}`;
        props.colon = false;
        props.label = props.label === void 0 ? ' ' : props.label;
        props.labelWidth = props.labelWidth === void 0 ? 20 : props.labelWidth;

        // 记录表单字段
        if (record.__formFields) {
            if (!record.__formFields.includes(props.field)) record.__formFields.push(props.field);
        } else {
            record.__formFields = [props.field]
        }

        // 校验函数
        if (!record.__validate) {
            record.__validate = (fields, callback) => {
                if (!callback) {
                    callback = fields;
                    fields = void 0;
                }

                let validateFields = fields?.length ? fields.map(item => `${item}${SEPARATOR}${id}`) : record.__formFields;

                form.validateFieldsAndScroll(validateFields, (err, values) => {
                    const realValues = getValues(values, rowKey)[0];

                    callback(err, realValues);
                });
            };
        }

        // 保存方法
        if (!record.__save) {
            record.__save = (fields, callback) => {
                if (!callback) {
                    callback = fields;
                    fields = void 0;
                }

                // 单独校验此行
                record.__validate(fields, (err, values) => {
                    if (err) return;

                    const nextRecord = {...record, ...values, showEdit: false};
                    const nextDataSource = this.props.dataSource.map(item => ({...item}));
                    const index = nextDataSource.findIndex(item => item[rowKey] === nextRecord[rowKey]);

                    // 替换数据
                    nextDataSource.splice(index, 1, nextRecord);

                    // 要保存的数据，处理过的最新dataSource
                    callback(nextDataSource, nextRecord);
                });
            }
        }

        // 取消方法
        if (!record.__cancel) {
            record.__cancel = (fields, callback) => {
                if (!callback) {
                    callback = fields;
                    fields = void 0;
                }

                const nextDataSource = this.props.dataSource.map(item => ({...item}));
                const r = nextDataSource.find(item => item[rowKey] === record[rowKey]);
                r.showEdit = false;

                // 处理过的罪行dataSource
                callback && callback(nextDataSource);
            }
        }


        const decorator = {
            initialValue: record[dataIndex],

            // 会卡 做个截流
            onChange: (e) => {
                if (props?.decorator?.onChange) props.decorator.onChange(e);

                if (this.st) {
                    clearTimeout(this.st);
                }
                const {getValue = (e) => e.target ? e.target.value : e} = props;
                const val = getValue(e);

                this.st = setTimeout(() => {
                    const nextDataSource = this.props.dataSource.map(item => ({...item}));
                    const nextRecord = nextDataSource.find(item => item[rowKey] === record[rowKey]);

                    // 重新赋值
                    nextRecord[dataIndex] = val;

                    // 记录是否改变
                    if (nextRecord.__changed) {
                        if (!nextRecord.__changed.includes(dataIndex)) nextRecord.__changed.push();
                    } else {
                        nextRecord.__changed = [dataIndex];
                    }

                    // 触发父级的onChange
                    onChange(nextDataSource);
                }, 300);
            }
        };

        return <FormElement form={form} {...props} decorator={{...props.decorator, ...decorator}}/>
    };

    handleAddNewRow = () => {
        const {dataSource, onChange, columns, rowKey, newRecord} = this.props;
        let record = {__add: true};

        if (columns && columns.length) {
            columns.forEach(({dataIndex}) => {
                if (dataIndex) {
                    record[dataIndex] = void 0;
                }
            })
        }
        record[rowKey] = uuid();

        onChange([...dataSource, {...record, ...newRecord}]);
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
                    return this.renderColumns(text, record, item)
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
