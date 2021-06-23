import React, {useEffect, useState} from 'react';
import {
    Form,
    InputNumber,
} from 'antd';
import FontIcon from 'src/pages/drag-page/font-icon';
import RadioGroup from '../radio-group';
import UnitInput from '../unit-input';
import RectInputsWrapper from '../rect-inputs-wrapper';
import {handleSyncFields} from '../util';
import './style.less';

const displayOptions = [
    {value: 'inline', label: '内联布局', icon: <FontIcon type="icon-display-inline"/>},
    {value: 'flex', label: '弹性布局', icon: <FontIcon type="icon-display-flex"/>},
    {value: 'inline-flex', label: '内联弹性布局', icon: <FontIcon type="icon-display-inline-flex"/>},
    {value: 'block', label: '块级布局', icon: <FontIcon type="icon-display-block"/>},
    {value: 'inline-block', label: '内联块布局', icon: <FontIcon type="icon-display-inline-block"/>},
    {value: 'none', label: '内联块布局', icon: <FontIcon type="icon-display-none"/>},
];

const flexDirectionOptions = [
    {value: 'row', label: '水平', tip: '水平方向，起点在左端'},
    {value: 'row-reverse', label: '逆水平', tip: '水平方向，起点在右端'},
    {value: 'column', label: '垂直', tip: '垂直方向，起点在上端'},
    {value: 'column-reverse', label: '逆垂直', tip: '垂直方向，起点在下端'},
];

const justifyContentOptions = [
    {value: 'flex-start', label: '开始对齐', icon: <FontIcon type="icon-content-start"/>},
    {value: 'flex-end', label: '结束对齐', icon: <FontIcon type="icon-content-end"/>},
    {value: 'center', label: '居中', icon: <FontIcon type="icon-content-center"/>},
    {value: 'space-between', label: '两端对齐', icon: <FontIcon type="icon-content-between"/>},
    {value: 'space-around', label: '横向平分', icon: <FontIcon type="icon-content-around"/>},
];
const alignItemsOptions = [
    {value: 'flex-start', label: '上对齐', icon: <FontIcon type="icon-items-start"/>},
    {value: 'flex-end', label: '下对齐', icon: <FontIcon type="icon-items-end"/>},
    {value: 'center', label: '居中', icon: <FontIcon type="icon-items-center"/>},
    {value: 'baseline', label: '基线对齐', icon: <FontIcon type="icon-items-baseline"/>},
    {value: 'stretch', label: '沾满容器', icon: <FontIcon type="icon-items-stretch"/>},
];
const flexWrapOptions = [
    {value: 'nowrap', label: '不换行'},
    {value: 'wrap', label: '正换行'},
    {value: 'wrap-reserve', label: '逆换行'},
];
const marginFields = [
    'marginTop',
    'marginRight',
    'marginBottom',
    'marginLeft',
];
const paddingFields = [
    'paddingTop',
    'paddingRight',
    'paddingBottom',
    'paddingLeft',
];


export default function Layout(props) {
    const {iframeDocument, componentId, value, onChange = () => undefined} = props;
    const [form] = Form.useForm();
    const [parentIsFlexBox, setParentIsFlexBox] = useState(false);

    function handleChange(changedValues, allValues) {
        const {display} = allValues;

        if (display !== 'flex' && display !== 'inline-flex') {
            allValues.flexDirection = undefined;
            allValues.justifyContent = undefined;
            allValues.alignItems = undefined;
            allValues.flexWrap = undefined;
        }

        // 同步表单数据
        form.setFieldsValue(allValues);
        onChange(allValues);
    }


    useEffect(() => {
        // 先重置，否则会有字段不清空情况
        form.resetFields();
        form.setFieldsValue(value);
    }, [value]);

    useEffect(() => {
        if (!iframeDocument || !componentId) return;

        const ele = iframeDocument.querySelector(`[data-component-id="${componentId}"]`);
        if (!ele?.parentNode) return;

        const display = window.getComputedStyle(ele.parentNode).display;
        setParentIsFlexBox(display === 'flex' || display === 'inline-flex');
    }, [componentId, iframeDocument]);

    return (
        <div styleName="root">
            <Form
                form={form}
                onValuesChange={handleChange}
                name="layout"
            >

                <Form.Item
                    label="布局模式"
                    name="display"
                    colon={false}
                >
                    <RadioGroup options={displayOptions}/>
                </Form.Item>
                <Form.Item shouldUpdate noStyle>
                    {({getFieldValue}) => {
                        const display = getFieldValue('display');
                        if (display !== 'flex' && display !== 'inline-flex') return null;

                        return (
                            <>
                                <Form.Item
                                    label="主轴方向"
                                    name="flexDirection"
                                    colon={false}
                                >
                                    <RadioGroup options={flexDirectionOptions}/>
                                </Form.Item>
                                <Form.Item
                                    label="主轴对齐"
                                    name="justifyContent"
                                    colon={false}
                                >
                                    <RadioGroup options={justifyContentOptions}/>
                                </Form.Item>
                                <Form.Item
                                    label="辅轴对齐"
                                    name="alignItems"
                                    colon={false}
                                >
                                    <RadioGroup options={alignItemsOptions}/>
                                </Form.Item>
                                <Form.Item
                                    label="换行方式"
                                    name="flexWrap"
                                    colon={false}
                                >
                                    <RadioGroup options={flexWrapOptions}/>
                                </Form.Item>
                            </>
                        );
                    }}
                </Form.Item>
                <RectInputsWrapper tip="margin" style={{height: 180, marginBottom: 8}}>
                    {marginFields.map(item => (
                        <Form.Item
                            name={item}
                            noStyle
                            colon={false}
                        >
                            <UnitInput
                                allowClear={false}
                                placeholder="0"
                                onClick={event => handleSyncFields({event, form, fields: marginFields, field: item, onChange: handleChange})}
                                onKeyDown={event => handleSyncFields({enter: true, event, form, fields: marginFields, field: item, onChange: handleChange})}
                            />
                        </Form.Item>
                    ))}
                    <RectInputsWrapper tip="padding" inner>
                        {paddingFields.map(item => (
                            <Form.Item
                                name={item}
                                noStyle
                                colon={false}
                            >
                                <UnitInput
                                    allowClear={false}
                                    placeholder="0"
                                    onClick={event => handleSyncFields({event, form, fields: paddingFields, field: item, onChange: handleChange})}
                                    onKeyDown={event => handleSyncFields({enter: true, event, form, fields: paddingFields, field: item, onChange: handleChange})}
                                />
                            </Form.Item>
                        ))}
                        <div styleName="innerInput">
                            <Form.Item
                                label="宽"
                                name="width"
                                colon={false}
                            >
                                <UnitInput
                                    style={{width: 60, marginRight: 8}}
                                    allowClear={false}
                                    placeholder="width"
                                />
                            </Form.Item>
                            <Form.Item
                                label="高"
                                name="height"
                                colon={false}
                            >
                                <UnitInput
                                    style={{width: 60}}
                                    allowClear={false}
                                    placeholder="height"
                                />
                            </Form.Item>
                        </div>
                    </RectInputsWrapper>
                </RectInputsWrapper>
                {parentIsFlexBox ? (
                    <>
                        <Form.Item
                            label="放大比例"
                            name="flexGrow"
                            colon={false}
                        >
                            <InputNumber style={{width: '100%'}} placeholder="flex-grow" min={0} step={1}/>
                        </Form.Item>
                        <Form.Item
                            label="缩小比例"
                            name="flexShrink"
                            colon={false}
                        >
                            <InputNumber style={{width: '100%'}} placeholder="flex-shrink" min={0} step={1}/>
                        </Form.Item>
                        <Form.Item
                            label="基础空间"
                            name="flexBasis"
                            colon={false}
                        >
                            <UnitInput placeholder="flex-basis"/>
                        </Form.Item>
                    </>
                ) : null}
            </Form>
        </div>
    );
}
