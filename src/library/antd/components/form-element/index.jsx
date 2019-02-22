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
    Cascader, Icon, Tooltip,
} from 'antd';
import './index.less';

const {TextArea, Password} = Input;
const FormItem = Form.Item;

// input hidden number textarea password mobile email select select-tree checkbox checkbox-group radio radio-group switch date time date-time date-range cascader

/**
 * 类似 input 元素
 * @param type
 * @returns {boolean}
 */
export function isInputLikeElement(type) {
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

    if (type === 'date-time') return <DatePicker showTime {...props}/>;

    if (type === 'date-range') return <DatePicker.RangePicker {...props}/>;

    if (type === 'month') return <DatePicker.MonthPicker {...props}/>;

    if (type === 'time') return <TimePicker {...props}/>;


    throw new Error(`no such type: ${type}`);
}

export default class FormElement extends Component {
    componentDidMount() {
        const {labelWidth} = this.props;
        const label = this.container.querySelector('.ant-form-item-label');

        if (label) {
            if (labelWidth !== void 0) {
                label.style.flexBasis = typeof labelWidth === 'string' ? labelWidth : `${labelWidth}px`;
            } else {
                label.style.paddingLeft = '16px';
            }
        }
    }

    render() {
        let {
            // 自定义属性
            form,
            type = 'input',
            labelWidth,
            width, // 元素宽度，默认 100%
            tip,
            field,
            decorator,
            wrapperStyle = {},
            layout = false,

            // Form.Item属性
            colon,
            extra,
            hasFeedback,
            help,
            label,
            labelCol,
            required,
            validateStatus,
            wrapperCol,

            children,
            ...others
        } = this.props;

        if (layout) {
            label = ' ';
            colon = false;
            form = null;
        }

        const {getFieldDecorator} = form || {};


        let elementStyle = {width: '100%'};
        if (width !== void 0) {
            elementStyle.width = width;
        }

        if (others.style) {
            elementStyle = {...elementStyle, ...others.style};
        }

        if (others.placeholder === void 0) {
            if (isInputLikeElement(type)) {
                others.placeholder = `请输入${label}`;
            } else {
                others.placeholder = `请选择${label}`;
            }
        }

        let formLabel = label;
        if (tip) {
            formLabel = (
                <span>
                    <Tooltip
                        placement="bottom"
                        title={tip}
                    >
                        <Icon type="question-circle-o" style={{marginRight: '4px'}}/>
                    </Tooltip>
                    {label}
                </span>
            );
        }

        return (
            <div
                style={{display: type === 'hidden' ? 'none' : 'block', ...wrapperStyle}}
                className="form-element-flex-root"
                ref={node => this.container = node}
            >
                <FormItem
                    colon={colon}
                    extra={extra}
                    hasFeedback={hasFeedback}
                    help={help}
                    label={formLabel}
                    labelCol={labelCol}
                    required={required}
                    validateStatus={validateStatus}
                    wrapperCol={wrapperCol}
                >
                    {form ? getFieldDecorator(field, decorator)(
                        getElement({type, ...others, style: elementStyle})
                    ) : null}
                    {children}
                </FormItem>
            </div>
        );
    }
}
