import React from 'react';
import {Form} from 'antd';

const {Item} = Form;

export default function DynamicFormItem(props) {
    const {
        appendField,
        appendFieldValue,
        children,
        ...others
    } = props;
    let values = appendFieldValue;
    if (appendFieldValue) {
        values = appendFieldValue.split(',');
    }
    if (!values?.length) values = [];

    return (
        <Item {...others} shouldUpdate noStyle>
            {({getFieldValue}) => {
                const val = getFieldValue(appendField);
                // eslint-disable-next-line
                const match = values.find(item => item == val); // 使用弱等

                if (match) return children;

                return null;
            }}
        </Item>
    );
}
