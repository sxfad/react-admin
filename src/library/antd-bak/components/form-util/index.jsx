import React from 'react';
import FormItemLayout from '../form-item-layout';
import {
    InputNumber,
    Input,
    Select,
    TreeSelect,
    Checkbox,
    Radio,
    Switch,
    DatePicker,
    TimePicker,
    Cascader,
} from 'antd';

const {TextArea, Password} = Input;

// input number textarea password mobile email select select-tree checkbox radio switch date time date-time cascader
/*
 * item 大多是 FormItemLayout 所需参数 及 表单元素所需参数

 type: 'input',
 field: 'loginName',
 label: '登录名',
 labelSpaceCount: 3,
 labelWidth: 100,
 width: '25%',
 placeholder: '请输入登录名',
 decorator: {
     rules: [
        {required: false, message: '请输入用户名'},
     ],
 },
 props: {} 元素的一些props，具体参考antd
 *
 * */

/**
 * 类似 input 元素
 * @param type
 * @returns {boolean}
 */
function isInputLikeElement(type) {
    return [
        'input',
        'number',
        'textarea',
        'password',
        'mobile',
        'email',
    ].includes(type);
}

/**
 * 获取元素placeholder
 * @param item
 * @returns {*}
 */
export function getPlaceholder(item) {
    const {type = 'input', label = '', placeholder, props = {}} = item;

    if (props.placeholder) return props.placeholder;

    if (placeholder) return placeholder;

    // FIXME 国际化
    return isInputLikeElement(type) ? `请输入${label}` : `请选择${label}`;
}

/**
 * 获取表单元素
 * @param item {type, placeholder, props, component}
 * @returns {*}
 */
export function getFormElement(item) {
    const {type = 'input', component, ...props} = item;

    // 样式
    const width = props.width || '100%';
    const elementCommonStyle = {width};
    props.style = props.style ? {...elementCommonStyle, ...props.style} : elementCommonStyle;

    // 如果 component 存在，说明是自定义组件
    if (component) {
        return typeof component === 'function' ? component() : component;
    }

    if (isInputLikeElement(type)) {
        if (type === 'number') return <InputNumber {...props}/>;
        if (type === 'textarea') return <TextArea {...props}/>;
        if (type === 'password') return <Password {...props}/>;

        return <Input type={type} {...props}/>;
    }

    if (type === 'select') {
        const {options = [], ...others} = props;
        return (
            <Select {...others}>
                {
                    options.map(opt => <Select.Option key={opt.value} {...opt}>{opt.label}</Select.Option>)
                }
            </Select>
        );
    }

    if (type === 'select-tree') return <TreeSelect {...props} treeData={props.options}/>;
    if (type === 'checkbox-group') return <Checkbox.Group {...props}/>;
    if (type === 'radio-group') return <Radio.Group {...props}/>;
    if (type === 'cascader') return <Cascader {...props}/>;


    if (type === 'checkbox') return <Checkbox {...props}>{props.label}</Checkbox>;

    if (type === 'radio') return <Radio {...props}>{props.label}</Radio>;

    if (type === 'switch') return <Switch {...props} style={{...props.style, width: 'auto'}}/>;

    if (type === 'date') return <DatePicker {...props}/>;

    if (type === 'date-range') return <DatePicker.RangePicker {...props}/>;

    if (type === 'month') return <DatePicker.MonthPicker {...props}/>;

    if (type === 'time') return <TimePicker {...props}/>;


    throw new Error(`no such type: ${type}`);
}

export function getFormItem(item, form) {
    const {getFieldDecorator} = form;
    const {field, decorator} = item;
    return (
        <FormItemLayout key={item.field} {...item}>
            {getFieldDecorator(field, decorator)(getFormElement(item))}
        </FormItemLayout>
    );
}
