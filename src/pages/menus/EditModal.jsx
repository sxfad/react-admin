import React, {Component} from 'react';
import {Form} from 'antd';
import {FormElement, FormRow, IconPicker, ModalContent} from 'ra-lib';
import config from 'src/commons/config-hoc';

export const targetOptions = [
    {value: '', label: '项目内部窗口'},
    {value: '_self', label: '替换当前窗口'},
    {value: '_blank', label: '打开新窗口'},
];

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
        const {key, parentKey} = values;
        const ajaxMethod = key ? this.props.ajax.put : this.props.ajax.post;
        const ajaxUrl = key ? `/menus/${key}` : '/menus';
        const {onOk} = this.props;

        this.setState({loading: true});
        ajaxMethod(ajaxUrl, {...values, id: key, parentId: parentKey})
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
        const {type, icon = 'bars'} = data;
        const isMenu = !type || type === '1';

        const formProps = {
            width: 300,
            labelWidth: 80,
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
                    initialValues={{...data, icon}}
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
                            autoFocus
                        />

                        {isMenu ? (
                            <FormElement
                                {...formProps}
                                width={180}
                                label="图标"
                                name="icon"
                            >
                                <IconPicker/>
                            </FormElement>
                        ) : (
                            <FormElement
                                {...formProps}
                                width="auto"
                                label="编码"
                                name="code"
                                required
                                labelTip="唯一标识，硬编码，前端一般会用于控制按钮是否显示。"
                            />
                        )}

                        {isMenu ? (
                            <FormElement
                                {...formProps}
                                labelWidth="auto"
                                width={120}
                                label="排序"
                                type="number"
                                name="order"
                                min={0}
                                step={1}
                            />
                        ) : null}
                    </FormRow>
                    <FormRow>
                        {!data?.parentKey && (
                            <FormElement
                                {...formProps}
                                label="基础路径"
                                name="basePath"
                                labelTip="菜单对应的页面基础地质地址，所有的子菜单「路径」「url」会拼接此「基础路径」"
                            />
                        )}
                        <FormElement
                            {...formProps}
                            label="路径"
                            name="path"
                            labelTip="菜单对应的页面地址，或者功能对应的页面地址。前端会基于用户所拥有的「路径」，对路由进行过滤。"
                        />
                    </FormRow>
                    {isMenu ? (
                        <FormRow>
                            <FormElement
                                {...formProps}
                                label="url"
                                name="url"
                                labelTip="iframe方式接入第三方网站的url，如果存在「基础路径」，会与基础路径进行拼接。"
                            />
                            <FormElement
                                {...formProps}
                                type="select"
                                label="target"
                                name="target"
                                options={targetOptions}
                                labelTip="iframe方式接入的第三方网站打开方式。"
                            />
                        </FormRow>
                    ) : null}
                </Form>
            </ModalContent>
        );
    }
}
