import React, {Component} from 'react';
import {Form, Row, Col, Popconfirm} from 'antd';
import {FormElement} from '@/library/antd';
import pluralize from 'pluralize';
import {connect} from '@/models';
import {firstLowerCase, firstUpperCase, allUpperCase} from './utils';


@connect(state => ({baseInfo: state.baseInfo}))
@Form.create({
    mapPropsToFields: (props) => {
        const fields = {};

        Object.keys(props.baseInfo).forEach(key => {
            fields[key] = Form.createFormField({
                ...props.baseInfo[key],
                value: props.baseInfo[key].value,
            });
        });

        return fields;
    },
    onFieldsChange: (props, fields) => {
        props.action.baseInfo.setFields(fields);
    },
})
export default class BaseInfo extends Component {
    state = {};

    componentWillMount() {
        const {formRef, form, validate} = this.props;
        if (formRef) formRef(form);

        if (validate) validate(this.validate)
    }


    componentDidMount() {

    }

    validate = () => {
        const {form} = this.props;

        return new Promise((resolve, reject) => {
            form.validateFieldsAndScroll((err, values) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(values)
                }
            });
        });
    };


    handleChange = (e) => {
        e.preventDefault();

        const {form: {setFieldsValue}} = this.props;
        const name = e.target.value;

        const lowercaseName = firstLowerCase(name);
        const capitalName = firstUpperCase(name);
        const allCapitalName = allUpperCase(name);
        const pluralityName = pluralize(lowercaseName);

        setFieldsValue({
            lowercaseName,
            capitalName,
            allCapitalName,
            pluralityName,
        });
    };

    handleShowMore = (e) => {
        e.preventDefault();

        const {baseInfo: {showMore}} = this.props;
        this.props.action.baseInfo
            .setFields({showMore: !showMore});
    };

    FormElement = (props) => <FormElement form={this.props.form} labelWidth={150} {...props}/>;

    render() {
        const {baseInfo: {showMore}} = this.props;
        const span = 8;
        const FormElement = this.FormElement;

        return (
            <Form>
                <Row>
                    <Col span={span}>
                        <FormElement
                            label="模块英文名"
                            tip="以'-'分割，全英文小写命名，比如：user-center"
                            field="name"
                            decorator={{
                                rules: [
                                    {required: true, message: '请输入模块名',},
                                ],
                                onChange: this.handleChange,
                            }}
                        />
                    </Col>

                    <Col span={span}>
                        <FormElement
                            label="模块中文名"
                            field="chineseName"
                            decorator={{
                                rules: [
                                    {required: true, message: '请输入中文名',},
                                ],
                            }}
                        />
                    </Col>

                    <Col span={span}>
                        <FormElement form={null}>
                            <a style={{marginLeft: 16}} onClick={this.handleShowMore}>{showMore ? '隐藏更多' : '显示更多'}</a>
                            <Popconfirm title="您确认清空吗？" onConfirm={() => this.props.form.resetFields()}>
                                <a style={{marginLeft: 16}}>清空</a>
                            </Popconfirm>
                        </FormElement>
                    </Col>
                </Row>
                <Row style={{display: showMore ? 'block' : 'none'}}>
                    <Col span={span}>
                        <FormElement
                            label="全部大写命名"
                            field="allCapitalName"
                            decorator={{
                                rules: [
                                    {required: true, message: '请输入全部大写命名',},
                                ],
                            }}
                        />
                    </Col>

                    <Col span={span}>
                        <FormElement
                            label="驼峰命名"
                            field="lowercaseName"
                            decorator={{
                                rules: [
                                    {required: true, message: '请输入驼峰命名',},
                                ],
                            }}
                        />
                    </Col>

                    <Col span={span}>
                        <FormElement
                            label="复数命名"
                            field="pluralityName"
                            decorator={{
                                rules: [
                                    {required: true, message: '请输入复数命名',},
                                ],
                            }}
                        />
                    </Col>

                    <Col span={span}>
                        <FormElement
                            label="权限前缀"
                            field="permissionPrefix"
                        />
                    </Col>

                    <Col span={span}>
                        <FormElement
                            label="大写-驼峰命名"
                            field="capitalName"
                            decorator={{
                                rules: [
                                    {required: true, message: '请输入首字母大写驼峰命名',},
                                ],
                            }}
                        />
                    </Col>
                </Row>
            </Form>
        );
    }
}
