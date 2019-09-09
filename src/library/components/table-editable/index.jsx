import React, {Component} from "react";
import PropTypes from "prop-types";
import {Form} from 'antd';
import {FormElement} from '@/library/components';
import './style.less';
import _ from 'lodash';

/**
 * 可标记表格高阶组件，dataSource中每条数据，必须含有id作为唯一标识
 * columns 添加 formProps
 * */
export default function Editable(OriTable) {
    @Form.create()
    class EditableCell extends React.Component {

        // 使重置起作用
        componentDidUpdate(prevProps, prevState, snapshot) {
            const {form, record, dataIndex} = this.props;
            const prevRecord = prevProps.record;
            const prevValue = prevRecord[dataIndex];
            const value = record[dataIndex];

            if (value !== prevValue) form.resetFields();
        }

        // 截流触发，提高性能
        handleChange = _.debounce(() => {
            this.props.form.validateFieldsAndScroll((err, values) => {
                if (err) return;

                const {value, dataSource, onChange} = this.props;
                if (onChange) {
                    const source = value || dataSource;

                    const ds = source.map(item => {
                        const {id} = item;
                        return {...item, ...values[id]};
                    });
                    onChange(ds);
                }
            });
        }, 500);

        renderCell = () => {
            const {form, record, title, dataIndex, formProps, size} = this.props;
            const {id} = record;
            const field = `${id}[${dataIndex}]`;
            const value = record[dataIndex];

            return (
                <FormElement
                    {...formProps}
                    form={form}
                    label={title}
                    labelWidth={formProps.required ? 10 : 0}
                    colon={false}
                    field={field}
                    initialValue={value}
                    onChange={this.handleChange}
                    size={size}
                />
            );
        };

        render() {
            const {
                editable,
                title,
                dataIndex,
                record,
                value,
                onChange,
                formProps,
                form,
                children,
                ...restProps
            } = this.props;
            return (
                <td {...restProps}>
                    {editable ? (
                        this.renderCell()
                    ) : (
                        children
                    )}
                </td>
            );
        }
    }

    class EditableTable extends Component {
        static propTypes = {
            dataSource: PropTypes.array,
            columns: PropTypes.array,
            value: PropTypes.array,
            onChange: PropTypes.func,
        };

        render() {
            const {
                value,
                dataSource,
                onChange,
                columns,
                rowKey,
                size,
                ...others
            } = this.props;

            const ds = value || dataSource;

            if (!this.initDataSource && ds?.length) this.initDataSource = ds;

            const components = {
                body: {
                    cell: EditableCell,
                },
            };

            const nextColumns = columns.map(col => {
                const editable = !!col.formProps;
                if (!editable) return col;

                return {
                    ...col,
                    onCell: record => ({
                        record,
                        value: value || dataSource,
                        formProps: col.formProps,
                        editable,
                        title: col.title,
                        dataIndex: col.dataIndex,
                        onChange,
                        size,
                    }),
                };
            });

            return (
                <OriTable
                    className="table-editable-root"
                    {...others}
                    size={size}
                    rowKey={rowKey}
                    components={components}
                    columns={nextColumns}
                    dataSource={ds}
                />
            );
        }
    }

    return EditableTable;
}
