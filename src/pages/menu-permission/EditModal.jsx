import React, {Component} from 'react';
import modal from '@/components/modal-hoc';
import {Button, Col, Form, Icon, Row} from "antd";
import {FormElement} from '@/library/antd';
import IconPicker from "@/components/icon-picker";
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

    FormElement = (props) => <FormElement form={this.props.form} labelWidth={70} {...props}/>;

    render() {
        const {form, data, form: {getFieldValue, setFieldsValue}} = this.props;
        const {iconVisible} = this.state;
        const initialType = '1';
        const type = form.getFieldValue('type') || data.type || initialType;

        const isMenu = type === '1';

        const FormElement = this.FormElement;
        return (
            <Form style={{padding: 16}}>
                <FormElement type="hidden" field="key" initialValue={data.key}/>
                <FormElement type="hidden" field="parentKey" initialValue={data.parentKey}/>
                <FormElement type="hidden" field="type" initialValue={data.type || initialType}/>
                <Row>
                    <Col span={12}>
                        <FormElement
                            label="名称"
                            field="text"
                            initialValue={data.text}
                            required
                        />
                    </Col>
                    {isMenu ? (
                        <Col span={12}>
                            <FormElement
                                label="图标"
                                field="icon"
                                initialValue={data.icon}
                                addonAfter={(
                                    <Icon
                                        style={{cursor: 'pointer'}}
                                        onClick={() => this.setState({iconVisible: true})}
                                        type={getFieldValue('icon') || data.icon || 'search'}
                                    />
                                )}
                            />
                        </Col>
                    ) : (
                        <Col span={12}>
                            <FormElement
                                label="编码"
                                field="code"
                                required
                                initialValue={data.code}
                                tip="唯一标识，硬编码，前端一般会用于控制按钮是否显示。"
                            />
                        </Col>
                    )}
                </Row>
                <Row>
                    <Col span={12}>
                        <FormElement
                            label="path"
                            field="path"
                            initialValue={data.path}
                            tip="菜单对应的页面地址，或者功能对应的页面地址。前端会基于用户所拥有的path，对路由进行过滤。"
                        />
                    </Col>
                    {isMenu ? (
                        <Col span={12}>
                            <FormElement
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
                                label="url"
                                field="url"
                                initialValue={data.url}
                            />
                        </Col>
                        <Col span={12}>
                            <FormElement
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

                <div className="ant-modal-footer">
                    <Button onClick={this.handleOk} type="primary">保存</Button>
                    <Button onClick={this.handleReset}>重置</Button>
                </div>
                <IconPicker
                    visible={iconVisible}
                    onOk={(type) => {
                        this.setState({iconVisible: false});
                        setFieldsValue({icon: type});
                    }}
                    onCancel={() => this.setState({iconVisible: false})}
                />
            </Form>
        );
    }
}
