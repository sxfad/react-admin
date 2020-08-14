import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Form} from 'antd';
import {QuestionCircleOutlined} from '@ant-design/icons';
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
    Tooltip,
    Transfer,
} from 'antd';
import IconPicker from '../icon-picker';
import './index.less';

const {TextArea, Password} = Input;
const FormItem = Form.Item;

// input hidden number textarea password mobile email select select-tree checkbox checkbox-group radio radio-button radio-group switch date time date-time date-range cascader

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

    const commonProps = {
        size: 'default',
    };
    // 样式
    // const width = props.width || '100%';
    // const elementCommonStyle = {width};
    // props.style = props.style ? {...elementCommonStyle, ...props.style} : elementCommonStyle;

    // 如果 component 存在，说明是自定义组件
    if (component) {
        return typeof component === 'function' ? component() : component;
    }

    if (isInputLikeElement(type)) {
        if (type === 'number') return <InputNumber {...commonProps} {...props}/>;
        if (type === 'textarea') return <TextArea {...commonProps} {...props}/>;
        if (type === 'password') return <Password {...commonProps} {...props}/>;

        return <Input {...commonProps} type={type} {...props}/>;
    }

    if (type === 'select') {
        const {options = [], ...others} = props;

        return (
            <Select {...commonProps} {...others}>
                {
                    options.map(opt => <Select.Option key={opt.value} {...opt}>{opt.label}</Select.Option>)
                }
            </Select>
        );
    }

    if (type === 'select-tree') return <TreeSelect {...commonProps} {...props} treeData={props.options}/>;

    if (type === 'checkbox') return <Checkbox {...commonProps} {...props}>{props.label}</Checkbox>;
    if (type === 'checkbox-group') return <Checkbox.Group {...commonProps} {...props}/>;

    if (type === 'radio') return <Radio {...commonProps} {...props}>{props.label}</Radio>;
    if (type === 'radio-group') return <Radio.Group {...commonProps} {...props}/>;
    if (type === 'radio-button') {
        const {options = [], ...others} = props;
        return (
            <Radio.Group buttonStyle="solid" {...commonProps} {...others}>
                {options.map(opt => <Radio.Button key={opt.value} {...opt}>{opt.label}</Radio.Button>)}
            </Radio.Group>
        );
    }

    if (type === 'cascader') return <Cascader {...commonProps} {...props}/>;

    if (type === 'switch') return <Switch {...commonProps} {...props} style={{...props.style, width: 'auto'}}/>;

    if (type === 'date') return <DatePicker {...commonProps} {...props}/>;

    if (type === 'date-time') return <DatePicker {...commonProps} showTime {...props}/>;

    if (type === 'date-range') return <DatePicker.RangePicker {...commonProps} {...props}/>;

    if (type === 'month') return <DatePicker.MonthPicker {...commonProps} {...props}/>;

    if (type === 'time') return <TimePicker {...commonProps} {...props}/>;

    if (type === 'transfer') return <Transfer {...commonProps} {...props}/>;

    if (type === 'icon-picker') return <IconPicker {...commonProps} {...props}/>;

    throw new Error(`no such type: ${type}`);
}

class FormElement extends Component {
    static propTypes = {
        // 自定义属性
        form: PropTypes.object,
        type: PropTypes.string.isRequired,
        labelWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        showLabel: PropTypes.bool,
        width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        labelTip: PropTypes.any,
        tip: PropTypes.any,
        decorator: PropTypes.object,
        style: PropTypes.object, // 最外层元素样式
        elementStyle: PropTypes.object, // 表单元素样式
        layout: PropTypes.bool,
        noSpace: PropTypes.bool, // 是否允许用户输入空格
        // 校验相关
        maxLength: PropTypes.number, // 允许输入最大字符数
        minLength: PropTypes.number, // 允许输入最小字符数

        // Form.Item属性
        colon: PropTypes.any,
        dependencies: PropTypes.any,
        extra: PropTypes.any,
        getValueFromEvent: PropTypes.any,
        hasFeedback: PropTypes.any,
        help: PropTypes.any,
        htmlFor: PropTypes.any,
        noStyle: PropTypes.any,
        label: PropTypes.any,
        labelAlign: PropTypes.any,
        labelCol: PropTypes.any,
        name: PropTypes.any,
        normalize: PropTypes.any,
        required: PropTypes.any,
        rules: PropTypes.any,
        shouldUpdate: PropTypes.any,
        trigger: PropTypes.any,
        validateFirst: PropTypes.any,
        validateStatus: PropTypes.any,
        validateTrigger: PropTypes.any,
        valuePropName: PropTypes.any,
        wrapperCol: PropTypes.any,

        // 其他
        className: PropTypes.any,
        onChange: PropTypes.any,
        onClick: PropTypes.any,
        onBlur: PropTypes.any,
        autoFocus: PropTypes.any,
        htmlType: PropTypes.any,
    };

    static defaultProps = {
        type: 'input',
        style: {},
        elementStyle: {},
        layout: false,
        noSpace: false,
        trim: true,
        showLabel: true,
        getValueFromEvent: e => {
            if (!e || !e.target) {
                return e;
            }
            const {target} = e;
            return target.type === 'checkbox' ? target.checked : target.value;
        },
    };

    // 获取校验信息
    getRules = (rules = [], requireMessage) => {
        const {
            required,
            maxLength,
            minLength,
        } = this.props;

        // 如果存在required属性，自动添加必填校验
        if (required && !rules.find(item => 'required' in item)) {
            rules.push({required: true, message: `${requireMessage}!`});
        }

        if (maxLength !== void 0 && !rules.find(item => 'max' in item)) {
            rules.push({max: maxLength, message: `最大长度不能超过 ${maxLength} 个字符！`});
        }

        if (minLength !== void 0 && !rules.find(item => 'min' in item)) {
            rules.push({min: minLength, message: `最小长度不能低于 ${minLength} 个字符！`});
        }

        return rules;
    };

    render() {
        let {
            // 自定义属性
            type = 'input',
            labelWidth,
            showLabel,
            width, // 整体宽度，默认 100%
            labelTip,
            tip,
            decorator,
            style,
            elementStyle,
            layout,
            forwardedRef,
            noSpace,
            trim,
            // 校验相关
            maxLength,
            minLength,

            // Form.Item属性
            colon,
            dependencies,
            extra,
            getValueFromEvent,
            hasFeedback,
            help,
            htmlFor,
            noStyle,
            label,
            labelAlign,
            labelCol,
            name,
            normalize,
            required,
            rules,
            shouldUpdate,
            trigger,
            validateFirst,
            validateStatus,
            validateTrigger,
            valuePropName,
            wrapperCol,

            children,

            // 其他的会直接作为Form 表单元素属性
            ...others
        } = this.props;


        if (type === 'switch' || type === 'checkbox') {
            valuePropName = 'checked';
        }

        if (type === 'transfer') {
            valuePropName = 'targetKeys';
        }

        let labelWithoutWidth = true;
        if (!labelCol && labelWidth !== undefined) {
            labelCol = {flex: `0 0 ${labelWidth}px`};
            labelWithoutWidth = false;
        }

        if (type === 'select' && ('showSearch' in others) && !('optionFilterProp' in others)) {
            others.optionFilterProp = 'children';
        }

        // 处理整体样式
        const wrapperStyle = {};
        if (width !== void 0) {
            wrapperStyle.width = width;
            wrapperStyle.flexBasis = width;
            wrapperStyle.flexGrow = 0;
            wrapperStyle.flexShrink = 0;
        } else {
            wrapperStyle.flex = 1;
        }

        // 处理元素样式
        let eleStyle = {width: '100%'};
        eleStyle = {...eleStyle, ...elementStyle};

        // 处理placeholder
        if (!('placeholder' in others)) {
            if (isInputLikeElement(type)) {
                others.placeholder = `请输入${label}`;
            } else if (type === 'date-range') {
                others.placeholder = ['开始日期', '结束日期'];
            } else {
                others.placeholder = `请选择${label}`;
            }
        }

        if (!('allowClear' in others) && isInputLikeElement(type)) {
            others.allowClear = true;
        }

        rules = this.getRules(rules, isInputLikeElement(type) ? `请输入${label}` : `请选择${label}`);

        if (rules.find(item => ('required' in item) && item.required)) {
            required = true;
        }

        let formLabel = label;
        if (labelTip) {
            formLabel = (
                <span>
                    <Tooltip
                        placement="bottom"
                        title={labelTip}
                    >
                        <QuestionCircleOutlined style={{marginRight: '4px'}}/>
                    </Tooltip>
                    {label}
                </span>
            );
        }

        const getValueFromEventNoSpace = noSpace ? (e) => {
            if (isInputLikeElement(type)) {
                let value = (!e || !e.target) ? e : e.target.value;

                if (value && typeof value === 'string') return value.replace(/\s/g, '');

                return value;
            } else {
                return getValueFromEvent(e);
            }
        } : getValueFromEvent;

        const elementProps = {
            ...others, ref: forwardedRef, style: eleStyle,
        };

        if (layout) {
            formLabel = formLabel || '';
            colon = false;
        } else {
            if (children && !shouldUpdate) {
                children = children ? React.cloneElement(children, elementProps) : null;
            } else {
                children = getElement({type, ...elementProps});
            }
        }

        // 不处理不显示红色星号
        if ((!formLabel && required) || !showLabel) formLabel = ' ';

        return (
            <div
                style={{display: type === 'hidden' ? 'none' : 'flex', ...wrapperStyle, ...style}}
                className="form-element-flex-root"
                ref={node => this.container = node}
            >
                <FormItem
                    colon={colon}
                    dependencies={dependencies}
                    extra={extra}
                    getValueFromEvent={getValueFromEventNoSpace}
                    hasFeedback={hasFeedback}
                    help={help}
                    htmlFor={htmlFor}
                    noStyle={noStyle}
                    label={formLabel}
                    labelAlign={labelAlign}
                    labelCol={labelCol}
                    name={name}
                    normalize={normalize}
                    required={required}
                    rules={rules}
                    shouldUpdate={shouldUpdate}
                    trigger={trigger}
                    validateFirst={validateFirst}
                    validateStatus={validateStatus}
                    validateTrigger={validateTrigger}
                    valuePropName={valuePropName}
                    wrapperCol={wrapperCol}
                    className={labelWithoutWidth ? 'frame-label-without-width' : ''}
                >
                    {children}
                </FormItem>
                {tip ? <div className="font-element-tip">{tip}</div> : null}
            </div>
        );
    }
}

export default React.forwardRef((props, ref) => {
    return <FormElement {...props} forwardedRef={ref}/>;
});
