import React, {useEffect, useRef, useMemo, useState} from 'react';
import {Form, ConfigProvider, Row, Col, Tooltip} from 'antd';
import elementMap, {getElement} from '../form-element';
import {showFieldByAppend} from 'src/pages/drag-page/component-config';
import {getLabelWidth} from 'src/pages/drag-page/util';
import {v4 as uuid} from 'uuid';
import config from 'src/commons/config-hoc';
import './style.less';

export default config({
    connect: state => {

        return {
            refreshProps: state.dragPage.refreshProps,
        };
    },
})(function ObjectElement(props) {

    let {
        node,
        refreshProps,
        action: {dragPage: dragPageAction},

        fields = [],
        value,
        onChange,
    } = props;

    const [form] = Form.useForm();
    const rootRef = useRef(null);
    const [formName/*, setFormName*/] = useState(uuid());

    const wrapperCol = {flex: '1 1 0%'};

    // 过滤掉函数
    // fields = fields.filter(item => item.type !== 'function');

    function handleChange(values) {
        if (!value) value = {};

        // 赋值 保留value引用
        Object.entries(values)
            .forEach(([key, val]) => {
                value[key] = val;
            });

        onChange(value);
    }

    // 表单回显
    useEffect(() => {
        form.resetFields();

        // 回显表单
        const fieldValues = {...value};

        // 设置默认属性
        fields.forEach(item => {
            const {field, defaultValue} = item;
            if (fieldValues[field] === undefined) {
                fieldValues[field] = defaultValue;
            }
        });

        // 设置表单
        form.setFieldsValue(fieldValues);

    }, [value, node, refreshProps]);

    // 基于fields 构建表单
    const element = useMemo(() => {
        // 最大字符标签
        let maxLabel = '';
        fields.forEach(item => {
            const {label, category} = item;
            if (!category && label.length > maxLabel.length) maxLabel = label;
        });
        // 设置label宽度
        const labelWidth = getLabelWidth(maxLabel);
        const labelCol = {flex: `${labelWidth}px`};

        // 获取分类字段
        const categories = [];
        fields.forEach(item => {
            const {category, categoryOrder} = item;
            if (!category) return;

            let node = categories.find(it => it.category === category);
            if (!node) {
                node = {category, fields: []};
                categories.push(node);
            }

            if (categoryOrder && !node.categoryOrder) node.categoryOrder = categoryOrder;

            node.fields.push(item);
        });

        // 渲染分类字段
        function renderCategory(index) {
            const _categories = categories.filter(item => {
                const {categoryOrder = 0} = item;

                return categoryOrder === index;

            });
            return _categories.map(item => {
                const {category, fields} = item;
                return (
                    <Col span={24}>
                        <div styleName="category">
                            <div styleName="label" style={{flex: `0 0 ${labelCol.flex}`}}>
                                {category}
                            </div>
                            <div styleName="wrapper">
                                {fields.map(it => {
                                    const {field} = it;
                                    const FormElement = elementMap.button({...it, node});

                                    return (
                                        <Form.Item
                                            labelCol={labelCol}
                                            wrapperCol={wrapperCol}
                                            name={field}
                                            colon={false}
                                            noStyle
                                        >
                                            <FormElement/>
                                        </Form.Item>
                                    );
                                })}
                            </div>
                        </div>
                    </Col>
                );
            });
        }

        // 渲染字段
        function renderField(option) {
            const {
                label,
                desc,
                title: tip,
                field,
                appendField,
                span = 24,
                onKeyDown,
            } = option;
            const title = tip || desc || label;

            let FormElement = getElement({...option, node});

            const labelEle = (
                <Tooltip placement="topRight" title={title} mouseLeaveDelay={0}>
                    {label}
                </Tooltip>
            );

            function handleKeyDown(e) {
                onKeyDown && onKeyDown(e, {
                    node,
                    dragPageAction,
                });
            }

            const element = (
                <Col span={span}>
                    <Form.Item
                        labelCol={labelCol}
                        wrapperCol={wrapperCol}
                        label={labelEle}
                        name={field}
                        colon={false}
                    >
                        <FormElement onKeyDown={handleKeyDown}/>
                    </Form.Item>
                </Col>
            );
            if (appendField) {
                return (
                    <Form.Item shouldUpdate noStyle>
                        {({getFieldsValue}) => {
                            let isShow = showFieldByAppend(getFieldsValue(), appendField);
                            if (isShow) return element;

                            if (value[field] !== undefined) {

                                Reflect.deleteProperty(value, field);

                                form.setFieldsValue({[field]: undefined});

                                // dragPageAction.render();
                            }

                            return null;
                        }}
                    </Form.Item>
                );
            }
            return element;
        }

        const commonFields = fields.filter(item => !item.category);

        if (!commonFields.length) {
            return renderCategory(0);
        }

        return commonFields.map((item, index) => {
            let category = renderCategory(index);
            const field = renderField(item);

            return [category, field];
        });

    }, [fields, node]);

    return (
        <div ref={rootRef}>
            <ConfigProvider autoInsertSpaceInButton={false} getPopupContainer={() => rootRef.current}>
                <Form
                    form={form}
                    onValuesChange={(_, allValues) => handleChange(allValues)}
                    name={formName}
                >
                    <Row>
                        {element}
                    </Row>
                </Form>
            </ConfigProvider>
        </div>
    );
});
