import React, {useEffect} from 'react';
import {
    Form,
    Input,
    Row,
    Col,
} from 'antd';
import {PicCenterOutlined} from '@ant-design/icons';

import RadioGroup from '../radio-group';
import UnitInput from '../unit-input';
import QuickPosition from '../quick-position';
import ColorInput from '../color-input';


import './style.less';

const backgroundSizeOptions = [
    {value: 'width height', label: '宽高'},
    {value: 'contain', label: '等比填充'},
    {value: 'cover', label: '等比覆盖'},
];
const backgroundRepeatOptions = [
    {value: 'no-repeat', label: '不重复', icon: <PicCenterOutlined/>},
    {value: 'repeat', label: '垂直和水平重复', icon: <PicCenterOutlined/>},
    {value: 'repeat-x', label: '水平重复', icon: <PicCenterOutlined/>},
    {value: 'repeat-y', label: '垂直重复', icon: <PicCenterOutlined/>},
];
const quickPositionFields = {
    topLeft: {backgroundPositionX: 0, backgroundPositionY: 0},
    top: {backgroundPositionX: '50%', backgroundPositionY: 0},
    topRight: {backgroundPositionX: '100%', backgroundPositionY: 0},
    left: {backgroundPositionX: 0, backgroundPositionY: '50%'},
    center: {backgroundPositionX: '50%', backgroundPositionY: '50%'},
    right: {backgroundPositionX: '100%', backgroundPositionY: '50%'},
    bottomLeft: {backgroundPositionX: 0, backgroundPositionY: '100%'},
    bottom: {backgroundPositionX: '50%', backgroundPositionY: '100%'},
    bottomRight: {backgroundPositionX: '100%', backgroundPositionY: '100%'},

};
const layout = {
    labelCol: {flex: '58px'},
    wrapperCol: {flex: 1},
};
export default function Background(props) {
    const {value, onChange = () => undefined} = props;
    const [form] = Form.useForm();

    function handleChange(changedValues, allValues) {
        let {
            backgroundImage,
            backgroundSize,
            backgroundSizeWidth = '',
            backgroundSizeHeight = '',
        } = allValues;

        if (backgroundImage) {
            allValues.backgroundImage = `url('${backgroundImage}')`;
        } else {
            const fieldsValue = {
                backgroundSize: undefined,
                backgroundPositionX: undefined,
                backgroundPositionY: undefined,
                backgroundRepeat: undefined,
            };
            Object.entries(fieldsValue).forEach(([key, value]) => {
                allValues[key] = value;
            });

            form.setFieldsValue(fieldsValue);
        }

        if (backgroundSize === 'width height') {
            if (backgroundSizeWidth === '' && backgroundSizeHeight === '') {
                allValues.backgroundSize = undefined;
            } else {
                if (backgroundSizeWidth === '') backgroundSizeWidth = 'auto';
                if (backgroundSizeHeight === '') backgroundSizeHeight = 'auto';

                allValues.backgroundSize = `${backgroundSizeWidth} ${backgroundSizeHeight}`;
            }
        }

        console.log('allValues', JSON.stringify(allValues, null, 4));
        onChange(allValues);
    }

    useEffect(() => {
        // 先重置，否则会有字段不清空情况
        form.resetFields();
        form.setFieldsValue(value);

        let {
            backgroundImage,
            backgroundSize,
            backgroundPosition,
        } = value;

        // 背景图转换
        if (backgroundImage) {
            let [, image = ''] = (/url\(([^)]+)\)/.exec(backgroundImage) || []);
            if (image.startsWith('\'') || image.startsWith('"')) {
                image = image.substring(1, image.length - 1);
            }
            form.setFieldsValue({backgroundImage: image});
        }
        // 大小转换
        if (backgroundSize) {
            const values = backgroundSize.trim().replace(/\s{2,}/g, ' ').split(' ');
            if (values.length === 2) {
                const backgroundSizeWidth = values[0];
                const backgroundSizeHeight = values[1];
                const backgroundSize = 'width height';
                form.setFieldsValue({backgroundSize, backgroundSizeWidth, backgroundSizeHeight});
            }
        }
        // 位置转换
        if (backgroundPosition) {
            const values = backgroundPosition.trim().replace(/\s{2,}/g, ' ').split(' ');
            if (values.length === 2) {
                const backgroundPositionX = values[0];
                const backgroundPositionY = values[1];
                form.setFieldsValue({backgroundPositionX, backgroundPositionY});
            }
        }
    }, [value]);


    return (
        <div styleName="root">
            <Form
                form={form}
                onValuesChange={handleChange}
                name="background"
            >
                <Form.Item
                    label="填充颜色"
                    name="backgroundColor"
                    colon={false}
                >
                    <ColorInput
                        allowClear
                        placeholder='background-color'
                    />
                </Form.Item>
                <Form.Item
                    {...layout}
                    label="背景图片"
                    name="backgroundImage"
                    colon={false}
                >
                    <Input
                        allowClear
                        placeholder='background-image'
                    />
                </Form.Item>
                <Form.Item shouldUpdate noStyle>
                    {({getFieldValue}) => {
                        const backgroundImage = getFieldValue('backgroundImage');
                        if (!backgroundImage) return null;

                        return (
                            <>
                                <Form.Item
                                    {...layout}
                                    label="尺寸"
                                    name="backgroundSize"
                                    colon={false}
                                >
                                    <RadioGroup options={backgroundSizeOptions}/>
                                </Form.Item>
                                <Form.Item shouldUpdate noStyle>
                                    {({getFieldValue}) => {
                                        const backgroundSize = getFieldValue('backgroundSize');
                                        if (backgroundSize !== 'width height') return null;

                                        return (
                                            <Row styleName="backgroundSize" style={{paddingLeft: layout.labelCol.flex}}>
                                                <Col span={12}>
                                                    <Form.Item
                                                        labelCol={{flex: 0}}
                                                        wrapperCol={{flex: 1}}
                                                        label="宽"
                                                        name="backgroundSizeWidth"
                                                        colon={false}
                                                    >
                                                        <UnitInput placeholder="width"/>
                                                    </Form.Item>
                                                </Col>
                                                <Col span={12} style={{paddingLeft: 8}}>
                                                    <Form.Item
                                                        labelCol={{flex: 0}}
                                                        wrapperCol={{flex: 1}}
                                                        label="高"
                                                        name="backgroundSizeHeight"
                                                        colon={false}
                                                    >
                                                        <UnitInput placeholder="height"/>
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                        );
                                    }}
                                </Form.Item>
                                <Row>
                                    <Col
                                        flex={layout.labelCol.flex}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'flex-end',
                                            alignItems: 'center',
                                            paddingRight: 10,
                                        }}
                                    >
                                        定位
                                    </Col>
                                    <Col
                                        flex={1}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'flex-start',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Row>
                                            <Col flex={0}>
                                                <QuickPosition
                                                    type="rect"
                                                    selectedKey={item => {
                                                        const {value} = item;
                                                        const fieldsValue = quickPositionFields[value];
                                                        const values = form.getFieldsValue();

                                                        if ((
                                                            fieldsValue.backgroundPositionX === values.backgroundPositionX
                                                            && fieldsValue.backgroundPositionY === values.backgroundPositionY
                                                        )) {
                                                            return value;
                                                        }
                                                    }}
                                                    onClick={item => {
                                                        const {value} = item;
                                                        const fieldsValue = quickPositionFields[value];

                                                        form.setFieldsValue(fieldsValue);

                                                        handleChange(fieldsValue, form.getFieldsValue());
                                                    }}/>
                                            </Col>
                                            <Col
                                                flex={1}
                                                style={{
                                                    paddingLeft: 16,
                                                    paddingTop: 4,
                                                }}
                                            >
                                                <Form.Item
                                                    labelCol={{flex: 0}}
                                                    wrapperCol={{flex: 1}}
                                                    label="左"
                                                    name="backgroundPositionX"
                                                    colon={false}
                                                >
                                                    <UnitInput placeholder="left" style={{width: 80}}/>
                                                </Form.Item>
                                                <Form.Item
                                                    labelCol={{flex: 0}}
                                                    wrapperCol={{flex: 1}}
                                                    label="顶"
                                                    name="backgroundPositionY"
                                                    colon={false}
                                                >
                                                    <UnitInput placeholder="top" style={{width: 80}}/>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Form.Item
                                    {...layout}
                                    label="重复方式"
                                    name="backgroundRepeat"
                                    colon={false}
                                >
                                    <RadioGroup options={backgroundRepeatOptions}/>
                                </Form.Item>
                            </>
                        );
                    }}
                </Form.Item>
            </Form>
        </div>
    );
}
