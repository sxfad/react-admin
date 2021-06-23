import React, {useEffect} from 'react';
import {
    Form,
    Row,
    Col,
    Tooltip,
    Select,
} from 'antd';
import FontIcon from '../../font-icon';

import RadioGroup from '../radio-group';
import UnitInput from '../unit-input';
import ColorInput from '../color-input';

import styles from './style.less';

const borderStyleOptions = [
    {value: 'none', label: '无边框'},
    {value: 'solid', label: '实线'},
    {value: 'dashed', label: '虚线'},
    {value: 'dotted', label: '点线'},
];

const radiusInputTypeOptions = [
    {value: 'all', title: '整体设置', icon: <FontIcon type="icon-radius-all"/>},
    {value: 'separate', title: '单独设置', icon: <FontIcon type="icon-radius"/>},
];

const borderInputTypeOptions = [
    {value: 'all', title: '整体设置', icon: <FontIcon type="icon-border"/>},
    {value: 'separate', title: '单独设置', icon: <FontIcon type="icon-border-split"/>},
];

const radiusKeys = [
    'TopLeft',
    'TopRight',
    'BottomLeft',
    'BottomRight',
];

const borderKeys = [
    'Top',
    'Right',
    'Bottom',
    'Left',
];
const borderPropKeys = [
    'Width',
    'Style',
    'Color',
];

const layout = {
    labelCol: {flex: '30px'},
    wrapperCol: {flex: 1},
};
export default function Background(props) {
    const {value, onChange = () => undefined} = props;
    const [form] = Form.useForm();

    function handleChange(changedValues, allValues) {
        const {__border, __borderRadius} = allValues;

        if (__border === 'all') {
            borderPropKeys.forEach(p => {
                borderKeys.forEach(item => {
                    const key = `border${item}${p}`;
                    allValues[key] = allValues[`border${p}`];
                });
            });

        }

        if (__borderRadius === 'all') {
            radiusKeys.forEach(p => {
                const key = `border${p}Radius`;
                allValues[key] = allValues.borderRadius;
            });
        }

        Reflect.deleteProperty(allValues, 'borderRadius');
        Reflect.deleteProperty(allValues, 'border');
        Reflect.deleteProperty(allValues, '__borderRadius');
        Reflect.deleteProperty(allValues, '__border');

        console.log('allValues', JSON.stringify(allValues, null, 4));
        onChange(allValues);
    }

    useEffect(() => {
        // 先重置，否则会有字段不清空情况
        form.resetFields();
        form.setFieldsValue(value);

        const isSame = arr => {
            if (!arr) return true;

            const value = arr[0];

            return arr.every(item => item === value);
        };

        const radiusValues = radiusKeys.map(key => value[`border${key}Radius`]);
        const borderValues = borderKeys.map(key => {
            return borderPropKeys.map(p => value[`border${key}${p}`]).join(' ');
        });

        if (isSame(radiusValues)) {
            form.setFieldsValue({
                __borderRadius: 'all',
                borderRadius: radiusValues[0],
            });

        } else {
            form.setFieldsValue({__borderRadius: 'separate'});
        }

        if (isSame(borderValues)) {
            const borders = {};
            borderPropKeys.forEach((p, index) => {
                const key = `border${p}`;
                borders[key] = borderValues[0].split(' ')[index];
            });

            form.setFieldsValue({
                __border: 'all',
                ...borders,
            });

        } else {
            form.setFieldsValue({__border: 'separate'});
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    return (
        <div className={styles.root}>
            <Form
                form={form}
                onValuesChange={handleChange}
                name="border"
            >
                <Form.Item
                    {...layout}
                    label="圆角"
                    name="__borderRadius"
                    colon={false}
                >
                    <RadioGroup
                        placement="top"
                        allowClear={false}
                        options={radiusInputTypeOptions}
                        onChange={() => {
                            setTimeout(() => {
                                const allValues = form.getFieldsValue();
                                handleChange({}, allValues);
                            });
                        }}
                    />
                </Form.Item>
                <Form.Item shouldUpdate noStyle>
                    {({getFieldValue}) => {
                        const __borderRadius = getFieldValue('__borderRadius');
                        if (__borderRadius === 'all') {
                            return (
                                <Form.Item
                                    {...layout}
                                    label=" "
                                    name="borderRadius"
                                    colon={false}
                                >
                                    <UnitInput
                                        placeholder="border-radius"
                                        onChange={e => {
                                            const {value} = e.target;
                                            const fieldsValue = {
                                                borderTopLeftRadius: value,
                                                borderTopRightRadius: value,
                                                borderBottomLeftRadius: value,
                                                borderBottomRightRadius: value,
                                            };
                                            form.setFieldsValue(fieldsValue);
                                            handleChange(fieldsValue, form.getFieldsValue());
                                        }}
                                    />
                                </Form.Item>
                            );
                        }

                        return (
                            <Row style={{paddingLeft: layout.labelCol.flex}}>
                                <Col span={12}>
                                    <Form.Item
                                        label={
                                            <Tooltip placement="top" title="左上角">
                                                <FontIcon type="icon-radius-top-left"/>
                                            </Tooltip>
                                        }
                                        name="borderTopLeftRadius"
                                        colon={false}
                                    >
                                        <UnitInput placeholder="top-left"/>
                                    </Form.Item>
                                </Col>
                                <Col span={12} style={{paddingLeft: 8}}>
                                    <Form.Item
                                        label={
                                            <Tooltip placement="top" title="右上角">
                                                <FontIcon type="icon-radius-top-right"/>
                                            </Tooltip>
                                        }
                                        name="borderTopRightRadius"
                                        colon={false}
                                    >
                                        <UnitInput placeholder="top-right"/>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label={
                                            <Tooltip placement="top" title="左下角">
                                                <FontIcon type="icon-radius-bottom-left"/>
                                            </Tooltip>
                                        }
                                        name="borderBottomLeftRadius"
                                        colon={false}
                                    >
                                        <UnitInput placeholder="bottom-left"/>
                                    </Form.Item>
                                </Col>
                                <Col span={12} style={{paddingLeft: 8}}>
                                    <Form.Item
                                        label={
                                            <Tooltip placement="top" title="右下角">
                                                <FontIcon type="icon-radius-bottom-right"/>
                                            </Tooltip>
                                        }
                                        name="borderBottomRightRadius"
                                        colon={false}
                                    >
                                        <UnitInput placeholder="bottom-right"/>
                                    </Form.Item>
                                </Col>
                            </Row>
                        );
                    }}
                </Form.Item>


                <Form.Item
                    {...layout}
                    label="边框"
                    name="__border"
                    colon={false}
                >
                    <RadioGroup
                        allowClear={false}
                        options={borderInputTypeOptions}
                        onChange={() => {
                            setTimeout(() => {
                                const allValues = form.getFieldsValue();
                                handleChange({}, allValues);
                            });
                        }}
                    />
                </Form.Item>

                <Form.Item shouldUpdate noStyle>
                    {({getFieldValue}) => {
                        const __border = getFieldValue('__border');
                        if (__border === 'all') {
                            return (
                                <Row>
                                    <Col span={10}>
                                        <Form.Item
                                            labelCol={layout.labelCol}
                                            label=" "
                                            name="borderWidth"
                                            colon={false}
                                        >
                                            <UnitInput
                                                placeholder="border-width"
                                                onChange={e => {
                                                    const {value} = e.target;
                                                    const fieldsValue = {
                                                        borderTopWidth: value,
                                                        borderRightWidth: value,
                                                        borderBottomWidth: value,
                                                        borderLeftWidth: value,
                                                    };
                                                    form.setFieldsValue(fieldsValue);
                                                    handleChange(fieldsValue, form.getFieldsValue());
                                                }}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={7} style={{paddingLeft: 8}}>
                                        <Form.Item
                                            name="borderStyle"
                                            colon={false}
                                        >
                                            <Select
                                                style={{width: '100%'}}
                                                placeholder="border-style"
                                                options={borderStyleOptions}
                                                onChange={value => {
                                                    const fieldsValue = {
                                                        borderTopStyle: value,
                                                        borderRightStyle: value,
                                                        borderBottomStyle: value,
                                                        borderLeftStyle: value,
                                                    };
                                                    form.setFieldsValue(fieldsValue);
                                                    handleChange(fieldsValue, form.getFieldsValue());
                                                }}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={7} style={{paddingLeft: 8}}>
                                        <Form.Item
                                            name="borderColor"
                                            colon={false}
                                        >
                                            <ColorInput
                                                placeholder="border-color"
                                                onChange={value => {
                                                    const fieldsValue = {
                                                        borderTopColor: value,
                                                        borderRightColor: value,
                                                        borderBottomColor: value,
                                                        borderLeftColor: value,
                                                    };
                                                    form.setFieldsValue(fieldsValue);
                                                    handleChange(fieldsValue, form.getFieldsValue());
                                                }}
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            );
                        }

                        return [
                            {label: '上边框', icon: <FontIcon type="icon-border-top"/>, name: 'borderTop', placeholder: 'border-top'},
                            {label: '右边框', icon: <FontIcon type="icon-border-right"/>, name: 'borderRight', placeholder: 'border-right'},
                            {label: '下边框', icon: <FontIcon type="icon-border-bottom"/>, name: 'borderBottom', placeholder: 'border-bottom'},
                            {label: '左边框', icon: <FontIcon type="icon-border-left"/>, name: 'borderLeft', placeholder: 'border-left'},
                        ].map(item => {
                            const {label, icon, name, placeholder} = item;

                            const lab = (
                                <Tooltip placement="left" title={label}>
                                    {icon}
                                </Tooltip>
                            );

                            return (
                                <Row>
                                    <Col span={10} style={{paddingLeft: layout.labelCol.flex}}>
                                        <Form.Item
                                            label={lab}
                                            name={`${name}Width`}
                                            colon={false}
                                        >
                                            <UnitInput placeholder={`${placeholder}-width`}/>
                                        </Form.Item>
                                    </Col>
                                    <Col span={7} style={{paddingLeft: 8}}>
                                        <Form.Item
                                            name={`${name}Style`}
                                            colon={false}
                                        >
                                            <Select
                                                style={{width: '100%'}}
                                                placeholder={`${placeholder}-style`}
                                                options={borderStyleOptions}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={7} style={{paddingLeft: 8}}>
                                        <Form.Item
                                            name={`${name}Color`}
                                            colon={false}
                                        >
                                            <ColorInput placeholder={`${placeholder}-color`}/>
                                        </Form.Item>
                                    </Col>
                                </Row>
                            );
                        });
                    }}
                </Form.Item>

            </Form>
        </div>
    );
}
