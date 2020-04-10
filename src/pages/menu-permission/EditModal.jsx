import React, {Component} from 'react';
import {Form} from 'antd';
import {FormElement, FormRow, IconPicker, ModalContent} from 'src/library/components';
import config from 'src/commons/config-hoc';

@config({
    ajax: true,
    modal: {
        width: 700,
        title: props => {
            const {data = {}} = props;
            const {key, type} = data;
            const isMenu = type === '1';

            if (isMenu) return key ? '编辑菜单' : '添加菜单';

            return key ? '编辑功能' : '添加功能';
        },
    },
})
export default class EditModal extends Component {
    state = {
        loading: false,
        iconVisible: false,
    };

    handleSubmit = (values) => {
        if (this.state.loading) return;

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
    };

    handleCancel = () => {
        const {onCancel} = this.props;
        if (onCancel) onCancel();
    };

    render() {
        const {data} = this.props;
        const {loading} = this.state;
        const {type} = data;
        const isMenu = type === '1';

        const formProps = {
            labelWidth: 70,
        };
        return (
            <ModalContent
                surplusSpace={false}
                loading={loading}
                okText="保存"
                onOk={() => this.form.submit()}
                cancelText="重置"
                onCancel={() => this.form.resetFields()}
            >
                <Form
                    ref={form => this.form = form}
                    onFinish={this.handleSubmit}
                    style={{padding: 16}}
                    initialValues={data}
                >
                    <FormElement {...formProps} type="hidden" name="key"/>
                    <FormElement {...formProps} type="hidden" name="parentKey"/>
                    <FormElement {...formProps} type="hidden" name="type"/>
                    <FormRow>
                        <FormElement
                            {...formProps}
                            label="名称"
                            name="text"
                            required
                        />
                        {isMenu ? (
                            <FormElement
                                {...formProps}
                                label="图标"
                                name="icon"
                            >
                                <IconPicker/>
                            </FormElement>
                        ) : (
                            <FormElement
                                {...formProps}
                                label="编码"
                                name="code"
                                required
                                labelTip="唯一标识，硬编码，前端一般会用于控制按钮是否显示。"
                            />
                        )}
                    </FormRow>
                    <FormRow>
                        <FormElement
                            {...formProps}
                            label="path"
                            name="path"
                            labelTip="菜单对应的页面地址，或者功能对应的页面地址。前端会基于用户所拥有的path，对路由进行过滤。"
                        />
                        {isMenu ? (
                            <FormElement
                                {...formProps}
                                label="排序"
                                type="number"
                                name="order"
                                min={0}
                                step={1}
                            />
                        ) : null}
                    </FormRow>
                    {isMenu ? (
                        <FormRow>
                            <FormElement
                                {...formProps}
                                label="url"
                                name="url"
                            />
                            <FormElement
                                {...formProps}
                                type="select"
                                label="target"
                                name="target"
                                options={[
                                    {value: '', label: '项目内部窗口'},
                                    {value: '_self', label: '替换当前窗口'},
                                    {value: '_blank', label: '打开新窗口'},
                                ]}
                            />
                        </FormRow>
                    ) : null}
                </Form>
            </ModalContent>
        );
    }
}
