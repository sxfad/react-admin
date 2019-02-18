import React, {Component} from 'react';
import {
    Form,
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
import './index.less';

const {TextArea, Password} = Input;
const FormItem = Form.Item;

// input hidden number textarea password mobile email select select-tree checkbox radio switch date time date-time cascader

/**
 * 类似 input 元素
 * @param type
 * @returns {boolean}
 */
function isInputLikeElement(type) {
    return [
        'input',
        'hidden',
        'number',
        'textarea',
        'password',
        'mobile',
        'email',
    ].includes(type);
}

function getElement(item) {
    const {type = 'input', component, ...props} = item;

    // 样式
    // const width = props.width || '100%';
    // const elementCommonStyle = {width};
    // props.style = props.style ? {...elementCommonStyle, ...props.style} : elementCommonStyle;

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

export default class FormElement extends Component {
    componentDidMount() {
        const {labelWidth} = this.props;
        if (labelWidth !== void 0) {
            const label = this.container.querySelector('.ant-form-item-label');
            if (label) label.style.flexBasis = typeof labelWidth === 'string' ? labelWidth : `${labelWidth}px`;
        }
    }

    render() {
        const {
            form,
            colon,
            extra,
            hasFeedback,
            help,
            label,
            labelWidth,
            width,
            labelCol,
            required,
            validateStatus,
            wrapperCol,

            field,
            decorator,

            children,
            ...others
        } = this.props;

        const {getFieldDecorator} = form;

        let elementStyle = {width: '100%'};
        if (width !== void 0) {
            elementStyle.width = width;
        }

        if (others.style) {
            elementStyle = {...elementStyle, ...others.style};
        }

        return (
            <div
                className="form-element-flex-root"
                ref={node => this.container = node}
            >
                <FormItem
                    colon={colon}
                    extra={extra}
                    hasFeedback={hasFeedback}
                    help={help}
                    label={label}
                    labelCol={labelCol}
                    required={required}
                    validateStatus={validateStatus}
                    wrapperCol={wrapperCol}
                >
                    {getFieldDecorator(field, decorator)(
                        getElement({...others, style: elementStyle})
                    )}
                    {children}
                </FormItem>
            </div>
        );
    }
}
