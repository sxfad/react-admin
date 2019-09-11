import React, {Component, Fragment} from 'react';
import {Button, Col, Form, Row} from "antd";
import {FormElement, IconPicker, modal, ModalContent} from '@/library/components';
import config from '@/commons/config-hoc';

@modal({
    width: 700,
    title: props => {
        const {data = {}} = props;
        const {key, type} = data;
        const isMenu = type === '1';

        if (isMenu) return key ? '编辑菜单' : '添加菜单';

        return key ? '编辑功能' : '添加功能';
    },
})
@config({ajax: true})
@Form.create()
export default class EditModal extends Component {
    state = {
        loading: false,
        iconVisible: false,
    };

    componentDidMount() {

    }

    handleOk = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);

                // 如果key存在视为修改，其他为添加
                const {key} = values;
                const ajax = key ? this.props.ajax.put : this.props.ajax.post;
                const {onOk} = this.props;

                // TODO
                this.setState({loading: true});
                ajax('/menus', values)
                    .then(() => {
                        this.setState({visible: false});
                        onOk && onOk();
                    })
                    .finally(() => this.setState({loading: false}));
            }
        });
    };

    handleReset = () => {
        this.props.form.resetFields();
    };

    handleCancel = () => {
        const {onCancel} = this.props;
        if (onCancel) onCancel();
    };

    render() {
        const {form, data} = this.props;
        const {loading} = this.state;
        const initialType = '1';
        const type = form.getFieldValue('type') || data.type || initialType;

        const isMenu = type === '1';

        const formElementProps = {
            form,
            labelWidth: 70,
        };
        return (
            <ModalContent
                surplusSpace={false}
                loading={loading}
                footer={
                    <Fragment>
                        <Button onClick={this.handleOk} type="primary">保存</Button>
                        <Button onClick={this.handleReset}>重置</Button>
                        <Button onClick={this.handleCancel}>取消</Button>
                    </Fragment>
                }
            >
                <Form style={{padding: 16}}>
                    <FormElement {...formElementProps} type="hidden" field="key" initialValue={data.key}/>
                    <FormElement {...formElementProps} type="hidden" field="parentKey" initialValue={data.parentKey}/>
                    <FormElement {...formElementProps} type="hidden" field="type" initialValue={data.type || initialType}/>
                    <Row>
                        <Col span={12}>
                            <FormElement
                                {...formElementProps}
                                label="名称"
                                field="text"
                                initialValue={data.text}
                                required
                            />
                        </Col>
                        {isMenu ? (
                            <Col span={12}>
                                <FormElement
                                    {...formElementProps}
                                    label="图标"
                                    field="icon"
                                    initialValue={data.icon}
                                >
                                    <IconPicker/>
                                </FormElement>
                            </Col>
                        ) : (
                            <Col span={12}>
                                <FormElement
                                    {...formElementProps}
                                    label="编码"
                                    field="code"
                                    required
                                    initialValue={data.code}
                                    labelTip="唯一标识，硬编码，前端一般会用于控制按钮是否显示。"
                                />
                            </Col>
                        )}
                    </Row>
                    <Row>
                        <Col span={12}>
                            <FormElement
                                {...formElementProps}
                                label="path"
                                field="path"
                                initialValue={data.path}
                                labelTip="菜单对应的页面地址，或者功能对应的页面地址。前端会基于用户所拥有的path，对路由进行过滤。"
                            />
                        </Col>
                        {isMenu ? (
                            <Col span={12}>
                                <FormElement
                                    {...formElementProps}
                                    label="排序"
                                    type="number"
                                    field="order"
                                    initialValue={data.order}
                                    min={0}
                                    step={1}
                                />
                            </Col>
                        ) : null}
                    </Row>
                    {isMenu ? (
                        <Row>
                            <Col span={12}>
                                <FormElement
                                    {...formElementProps}
                                    label="url"
                                    field="url"
                                    initialValue={data.url}
                                />
                            </Col>
                            <Col span={12}>
                                <FormElement
                                    {...formElementProps}
                                    type="select"
                                    label="target"
                                    field="target"
                                    initialValue={data.target}
                                    options={[
                                        {value: '', label: '项目内部窗口'},
                                        {value: '_self', label: '替换当前窗口'},
                                        {value: '_blank', label: '打开新窗口'},
                                    ]}
                                />
                            </Col>
                        </Row>
                    ) : null}
                </Form>
            </ModalContent>
        );
    }
}
