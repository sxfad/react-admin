import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Table, Button, Form} from 'antd';
import {FormUtil, TableDragRow} from 'sx-antd';
import './FieldsTable.less';

const DragRowTable = TableDragRow(Table);

@Form.create()
export default class EditableTable extends Component {
    static propTypes = {
        value: PropTypes.array,
        onChange: PropTypes.func,
        columns: PropTypes.array,
        newRecord: PropTypes.object,
    };

    static defaultProps = {};

    state = {};

    componentWillMount() {
        const {formRef, form} = this.props;
        formRef(form);
    }

    renderColumns = (text, record, column) => {
        const {dataIndex, props} = column;
        if (!props) return text;

        const {value, onChange, form} = this.props;
        const {id} = record;
        props.field = `${dataIndex}-${id}`;
        props.colon = false;
        props.label = ' ';
        props.labelWidth = 20;

        const decorator = {};
        decorator.onChange = (e) => {
            let v;
            if (props.getValue) {
                v = props.getValue(e)
            } else {
                v = e.target.value;
            }

            const r = value.find(item => item.id === record.id);

            r[dataIndex] = v;
            onChange(value);
        };

        if (text) {
            decorator.initialValue = text;
        }

        return FormUtil.getFormItem({...props, decorator: {...props.decorator, ...decorator}}, form);
    };

    handleAddNewRow = () => {
        const {value, onChange, newRecord} = this.props;
        onChange([...value, {...newRecord}]);
    };

    render() {
        const {
            value,
            onChange,
            hasError,
            style,
            formRef,
            onRowMoved,
            ...others
        } = this.props;

        const tableStyle = {marginBottom: '16px', ...style};
        const dataSource = [...value];

        if (hasError) tableStyle.border = '1px solid #f5222d';

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

        return (
            <DragRowTable
                styleName="root"
                style={tableStyle}
                {...others}
                bordered
                columns={columns}
                dataSource={dataSource}
                pagination={false}
                rowKey={record => record.id}
                onRowMoved={onRowMoved}
                footer={() => (
                    <Button
                        icon="plus"
                        style={{width: '100%', height: '80px', lineHeight: '80px'}}
                        type="dashed"
                        onClick={this.handleAddNewRow}
                    >添加</Button>
                )}
            />
        );
    }
}
