import React, {useContext, Component} from 'react';
import {Form} from 'antd';
import {FormElement} from 'src/library/components';
import uuid from 'uuid/v4';
import './style.less';

const EditableContext = React.createContext();

const EditableRow = ({initialValues, ...props}) => {
    const [form] = Form.useForm();
    return (
        <Form name={uuid()} form={form} component={false} initialValues={initialValues}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    );
};

const EditableCell = (options) => {
    const {
        children,
        record = {},
        rowIndex,
        col = {},
        ...restProps
    } = options;

    record._form = useContext(EditableContext);
    const {title, dataIndex, formProps} = col;

    let childNode = children;
    let eleProps = formProps;

    if (typeof formProps === 'function') {
        eleProps = formProps(record, rowIndex);
    }

    // eleProps 存在，即表示可编辑
    if (eleProps) {
        childNode = (
            <FormElement
                label={title}
                showLabel={false}
                colon={false}
                name={dataIndex}
                {...eleProps}
            />
        );
    }

    return <td {...restProps}>{childNode}</td>;
};


export default function editTable(OriTable) {
    return class EditTable extends Component {

        render() {
            const {columns, className = '', onRow, ...others} = this.props;
            const components = {
                body: {
                    row: EditableRow,
                    cell: EditableCell,
                },
            };

            const newColumns = columns.map(col => {
                if (!col.formProps) {
                    return col;
                }

                return {
                    ...col,
                    onCell: (record, rowIndex) => ({
                        record,
                        rowIndex,
                        col,
                    }),
                };
            });

            return (
                <OriTable
                    onRow={(record, index) => {
                        let result = {};
                        if (onRow) result = onRow(record, index);

                        const initialValues = {...record};
                        return {
                            ...result,
                            initialValues,
                        };
                    }}
                    className={`table-editable-root ${className}`}
                    components={components}
                    columns={newColumns}
                    {...others}
                />
            );
        }
    };
}
