import React, {Component} from 'react';
import {Col, Form, Modal, Row, Button, Spin} from 'antd';
import {FormElement} from '@/library/antd';
import validationRule from "@/library/utils/validation-rule";
import PageContent from '@/layouts/page-content';

/*
说明：
避免弹框打开之后，存在脏数据的问题
1. Modal 使用 destroyOnClose 属性，每次关闭，都销毁Modal中的子组件
2. Edit组件单独编写，作为Modal的子组件存在，可以保证每次Modal打开，都会重新创建一个新的Edit组件
3. Modal不用footer，避免跟Edit组件进行额外的数据交互，Modal单纯的作为一个弹框即可
* */

export default function (props) {
    const {visible, idForEdit, onCancel} = props;
    const isEdit = idForEdit !== null;

    // TODO 修改title
    const title = isEdit ? '修改' : '添加';
    return (
        <Modal
            destroyOnClose
            visible={visible}
            title={title}
            bodyStyle={{padding: 0}}
            footer={null}
            onCancel={onCancel}
        >
            <Edit {...props} isEdit={isEdit}/>
        </Modal>
    );
}

@Form.create()
class Edit extends Component {
    constructor(props) {
        super(props);
        const {idForEdit, isEdit} = this.props;

        // TODO 如果是修改，基于id查询所需要修改的数据
        if (isEdit) {
            this.state.loading = true;
            setTimeout(() => {
                this.setState({
                    loading: false,
                    data: {
                        id: idForEdit,
                        name: `name-${idForEdit}`,
                        mobile: '18611434366',
                        email: '11@qq.com',
                    },
                });
            }, 500)
        }
    }

    state = {
        loading: false,
        data: {}, // 表单回显数据
    };

    handleOk = () => {
        if (this.state.loading) return; // 防止重复提交

        this.props.form.validateFieldsAndScroll((err, values) => {
            if (err) return;

            const {isEdit} = this.props;

            // TODO 添加保存分别发请求
            if (isEdit) {

            } else {

            }

            this.setState({loading: true});
            setTimeout(() => {

                const {onOk} = this.props;
                if (onOk) onOk();

                this.setState({loading: false});
            }, 1000);
        });

    };

    handleCancel = () => {
        const {onCancel} = this.props;

        if (onCancel) onCancel();
    };

    handleReset = () => {
        this.props.form.resetFields();
    };

    // 这样可以保证每次render时，FormElement不是每次都创建，这里可以进行一些共用属性的设置
    FormElement = (props) => <FormElement form={this.props.form} labelWidth={100} disabled={this.props.isDetail} {...props}/>;

    render() {
        const {isEdit} = this.props;
        const {loading, data} = this.state;

        const FormElement = this.FormElement;
        return (
            <Spin spinning={loading}>
                <PageContent footer={false}>
                    <Form onSubmit={this.handleSubmit}>
                        {isEdit ? <FormElement type="hidden" field="id" initialValue={data.id}/> : null}
                        <Row>
                            <Col span={12}>
                                <FormElement
                                    label="用户名"
                                    field="name"
                                    initialValue={data.name}
                                />
                            </Col>
                            <Col span={12}>
                                <FormElement
                                    label="手机号码"
                                    field="mobile"
                                    initialValue={data.mobile}
                                    rules={[
                                        {required: true, message: '请输入手机号码！'},
                                        validationRule.mobile(),
                                    ]}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <FormElement
                                    label="邮箱"
                                    field="email"
                                    initialValue={data.email}
                                    rules={[
                                        {required: true, message: '请输入邮箱！'},
                                        validationRule.email(),
                                    ]}
                                />
                            </Col>
                            <Col span={12}>
                                <FormElement
                                    label="QQ"
                                    field="qq"
                                    initialValue={data.qq}
                                    rules={[
                                        {required: false, message: '请输入QQ！'},
                                        validationRule.qq(),
                                    ]}
                                />
                            </Col>
                        </Row>
                    </Form>
                </PageContent>
                <div className="ant-modal-footer">
                    <Button onClick={this.handleOk} type="primary">保存</Button>
                    <Button onClick={this.handleReset}>重置</Button>
                    <Button onClick={this.handleCancel}>取消</Button>
                </div>
            </Spin>
        );
    }
}

