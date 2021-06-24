import React, {useEffect} from 'react';
import {Form, Button, Select, Row, Col} from 'antd';
import {PlusOutlined, MinusCircleOutlined} from '@ant-design/icons';
import {validateRules} from '@ra-lib/admin';
import PropTypes from 'prop-types';
import styles from './style.less';

export const options = [
    {value: 'required', label: '必填', rule: {required: true, message: '必填项！'}, ruleStr: '{required: true, message: \'必填项！\'}'},
    {value: 'mobile', label: '手机号', rule: validateRules.mobile(), ruleStr: 'validateRules.mobile()'},
];

const Rule = props => {
    const {value, onChange} = props;
    const [form] = Form.useForm();

    function handleChange(changedValues, allValues) {
        const {rules = []} = allValues;
        onChange([...rules]);
    }

    useEffect(() => {
        form.setFieldsValue({rules: value});
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    return (
        <div>
            <Form component={false} form={form} name="rules" onValuesChange={handleChange} autoComplete="off">
                <Form.List
                    name="rules"
                >
                    {(fields, {add, remove}, {errors}) => {
                        const usedRules = form.getFieldValue('rules') || [];

                        return (
                            <>
                                {fields.map((field, index) => {
                                    const nextOptions = options.filter(item => !usedRules.includes(item.value));
                                    const val = usedRules[index];
                                    if (val) nextOptions.push(options.find(item => item.value === val));

                                    return (
                                        <Form.Item
                                            label=""
                                            required={false}
                                            key={field.key}
                                        >
                                            <Row>
                                                <Col flex={1}>
                                                    <Form.Item
                                                        {...field}
                                                        noStyle
                                                    >
                                                        <Select
                                                            placeholder="请选择规则"
                                                            options={nextOptions}
                                                        />
                                                    </Form.Item>
                                                </Col>
                                                <Col flex={0}>
                                                    <MinusCircleOutlined
                                                        className={styles.dynamicDeleteButton}
                                                        onClick={() => remove(field.name)}
                                                    />
                                                </Col>
                                            </Row>
                                        </Form.Item>
                                    );
                                })}
                                <Form.Item>
                                    <Button
                                        block
                                        type="dashed"
                                        onClick={() => add()}
                                        icon={<PlusOutlined/>}
                                    >
                                        添加规则
                                    </Button>
                                    <Form.ErrorList errors={errors}/>
                                </Form.Item>
                            </>
                        );
                    }}
                </Form.List>
            </Form>
        </div>
    );
};

Rule.propTypes = {
    value: PropTypes.array,
    onChange: PropTypes.func,
};

export default Rule;
