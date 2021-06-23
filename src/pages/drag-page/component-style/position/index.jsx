import React, {useEffect} from 'react';
import {
    Form,
    InputNumber,
    Select,
} from 'antd';
import {
    PicCenterOutlined,
} from '@ant-design/icons';
import FontIcon from '../../font-icon';
import RadioGroup from '../radio-group';
import RectInputsWrapper from '../rect-inputs-wrapper';
import styles from './style.less';
import UnitInput from 'src/pages/drag-page/component-style/unit-input';
import {handleSyncFields} from 'src/pages/drag-page/component-style/util';
import QuickPosition from '../quick-position';

const positionOptions = [
    {value: 'static', label: '无定位', icon: <FontIcon type="icon-none"/>},
    {value: 'relative', label: '相对定位', icon: <FontIcon type="icon-position-relative"/>},
    {value: 'absolute', label: '绝对定位', icon: <FontIcon type="icon-position-absolute"/>},
    {value: 'fixed', label: '固定定位', icon: <FontIcon type="icon-position-fixed"/>},
    {value: 'sticky', label: '粘性定位', icon: <PicCenterOutlined/>},
];

const floatOptions = [
    {value: 'none', label: '不浮动', icon: <FontIcon type="icon-none"/>},
    {value: 'left', label: '左浮动', icon: <FontIcon type="icon-float-left"/>},
    {value: 'right', label: '右浮动', icon: <FontIcon type="icon-float-right"/>},
];
const clearOptions = [
    {value: 'none', label: '不清除', icon: <FontIcon type="icon-none"/>},
    {value: 'left', label: '左清除', icon: <FontIcon type="icon-clear-left"/>},
    {value: 'right', label: '右清除', icon: <FontIcon type="icon-clear-right"/>},
    {value: 'both', label: '左右清除', icon: <FontIcon type="icon-clear-both"/>},
];
const directionOptions = ['top', 'right', 'bottom', 'left'];
const quickPositionFields = {
    topLeft: {top: 0, left: 0},
    top: {top: 0, left: '50%', translateX: '-50%'},
    topRight: {top: 0, right: 0},
    left: {top: '50%', left: 0, translateY: '-50%'},
    center: {top: '50%', left: '50%', translateY: '-50%', translateX: '-50%'},
    right: {top: '50%', right: 0, translateY: '-50%'},
    bottomLeft: {bottom: 0, left: 0},
    bottom: {bottom: 0, left: '50%', translateX: '-50%'},
    bottomRight: {right: 0, bottom: 0},

};

export default function Position(props) {
    const {value, onChange = () => undefined} = props;
    const [form] = Form.useForm();

    function handleChange(changedValues, allValues) {
        const {translateY, translateX, position} = allValues;

        if (position === 'static') {
            const fields = ['top', 'right', 'bottom', 'left'];
            const fieldsValue = fields.reduce((prev, curr) => {
                allValues[curr] = prev[curr] = undefined;
                return prev;
            }, {});

            form.setFieldsValue(fieldsValue);
        }

        let {transform} = value;

        if (!transform) transform = '';

        const setTransform = (key, value) => {
            const re = new RegExp(`${key}([^)]+)`);

            if (value) {
                if (transform.includes(key)) {
                    transform = transform.replace(re, `${key}(${value})`);
                } else {
                    transform = `${transform} ${key}(${value})`;
                }
            } else {
                transform = transform.replace(re, '');
            }
            // 去前后空格
            transform = transform.trim();
            // 多个空格转为单个空格
            transform = transform.replace(/\s{2,}/g, ' ');
            Reflect.deleteProperty(allValues, key);
        };

        setTransform('translateY', translateY);
        setTransform('translateX', translateX);

        allValues.transform = transform;

        console.log('allValues', JSON.stringify(allValues, null, 4));
        onChange(allValues);
    }

    useEffect(() => {
        // 先重置，否则会有字段不清空情况
        form.resetFields();
        form.setFieldsValue(value);
        const {transform} = value;
        if (!transform) return;

        const [, translateY] = (/translateY\(([^)]+)\)/.exec(transform) || []);
        const [, translateX] = (/translateX\(([^)]+)\)/.exec(transform) || []);

        form.setFieldsValue({translateY, translateX});
    }, [value]);

    return (
        <div className={styles.root}>
            <Form
                form={form}
                onValuesChange={handleChange}
                name="position"
            >
                <Form.Item
                    label="定位类型"
                    name="position"
                    colon={false}
                >
                    <Select
                        placeholder="position"
                        options={positionOptions.map(item => {
                            const {value, label, icon} = item;

                            let lab = `${label} ${value}`;

                            if (icon) lab = <span>{icon} {lab}</span>;

                            return {
                                value,
                                label: lab,
                            };
                        })}
                    />
                </Form.Item>
                <Form.Item shouldUpdate noStyle>
                    {({getFieldValue}) => {
                        const position = getFieldValue('position');
                        if (position === 'absolute' || position === 'fixed') {

                            return (
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-around',
                                    marginLeft: 60,
                                    marginBottom: 5,
                                }}>
                                    <QuickPosition
                                        selectedKey={item => {
                                            const {value} = item;
                                            const fieldsValue = quickPositionFields[value];
                                            const {
                                                top = 'auto',
                                                right = 'auto',
                                                left = 'auto',
                                                bottom = 'auto',
                                                translateY,
                                                translateX,
                                            } = fieldsValue;

                                            const values = form.getFieldsValue();

                                            if ((
                                                values.top === top
                                                && values.right === right
                                                && values.left === left
                                                && values.bottom === bottom
                                                && values.translateY === translateY
                                                && values.translateX === translateX
                                            )) {
                                                return value;
                                            }
                                        }}
                                        onClick={item => {
                                            const {value} = item;
                                            const fieldsValue = quickPositionFields[value];
                                            const {
                                                top = 'auto',
                                                right = 'auto',
                                                left = 'auto',
                                                bottom = 'auto',
                                                translateY,
                                                translateX,
                                            } = fieldsValue;

                                            const fields = {
                                                top,
                                                right,
                                                left,
                                                bottom,
                                                translateY,
                                                translateX,
                                            };

                                            form.setFieldsValue(fields);

                                            handleChange(fields, form.getFieldsValue());
                                        }}/>
                                </div>
                            );
                        }
                    }}
                </Form.Item>
                <Form.Item shouldUpdate noStyle>
                    {({getFieldValue}) => {
                        const position = getFieldValue('position');

                        if (!position || position === 'static') return null;

                        return (
                            <RectInputsWrapper large style={{height: 110, marginLeft: 60, marginBottom: 8}}>
                                {directionOptions.map(item => {
                                    return (
                                        <Form.Item
                                            name={item}
                                            noStyle
                                            colon={false}
                                        >
                                            <UnitInput
                                                allowClear={false}
                                                placeholder="auto"
                                                onClick={event => handleSyncFields({event, form, fields: directionOptions, field: item, onChange: handleChange})}
                                                onKeyDown={event => handleSyncFields({enter: true, event, form, fields: directionOptions, field: item, onChange: handleChange})}
                                            />
                                        </Form.Item>
                                    );
                                })}
                            </RectInputsWrapper>
                        );
                    }}
                </Form.Item>
                <Form.Item
                    label="水平移动"
                    name="translateX"
                    colon={false}
                >
                    <UnitInput placeholder="translateX"/>
                </Form.Item>
                <Form.Item
                    label="垂直移动"
                    name="translateY"
                    colon={false}
                >
                    <UnitInput placeholder="translateY"/>
                </Form.Item>
                <Form.Item
                    label="层叠顺序"
                    name="zIndex"
                    colon={false}
                >
                    <InputNumber
                        style={{width: '100%'}}
                        step={1}
                        placeholder="z-index"
                    />
                </Form.Item>
                <Form.Item
                    label="浮动方向"
                    name="float"
                    colon={false}
                >
                    <RadioGroup options={floatOptions}/>
                </Form.Item>

                <Form.Item
                    label="清除浮动"
                    name="clear"
                    colon={false}
                >
                    <RadioGroup options={clearOptions}/>
                </Form.Item>
            </Form>
        </div>
    );
}
