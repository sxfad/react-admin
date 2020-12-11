import React, { Component } from 'react';
import { Form } from 'antd';
import { FormElement, ModalContent } from 'ra-lib';
import JSON5 from 'json5';
import config from 'src/commons/config-hoc';

@config({
    ajax: true,
    modal: {
        width: 1000,
        title: '批量添加',
    },
})
export default class BatchAddModal extends Component {
    state = {
        loading: false,
        iconVisible: false,
    };

    handleSubmit = (values) => {
        if (this.state.loading) return;

        const { menus, parentKey } = values;
        let menusJson = JSON5.parse(menus);
        if (!Array.isArray(menusJson)) {
            menusJson = [ menusJson ];
        }
        menusJson.forEach(item => {
            if (!item.parentKey) item.parentKey = parentKey;
            if (!item.icon) item.icon = 'bars';

            item.id = item.key;
            item.parentId = item.parentKey;
        });

        const { onOk } = this.props;

        this.setState({ loading: true });
        this.props.ajax.post('/batchAddMenus', { menus: menusJson })
            .then(() => {
                this.setState({ visible: false });
                onOk && onOk();
            })
            .finally(() => this.setState({ loading: false }));
    };

    handleCancel = () => {
        const { onCancel } = this.props;
        if (onCancel) onCancel();
    };

    render() {
        const { data } = this.props;
        const { loading } = this.state;

        const formProps = {
            labelWidth: 0,
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
                    style={{ padding: 16 }}
                    initialValues={{ ...data }}
                >
                    <FormElement {...formProps} type="hidden" name="parentKey"/>
                    <FormElement
                        {...formProps}
                        type="textarea"
                        label="名称"
                        name="menus"
                        colon={false}
                        rows={20}
                        required
                        autoFocus
                        rules={[
                            {
                                validator: (rule, value) => {
                                    if (!value) return Promise.resolve();

                                    try {
                                        JSON5.parse(value);
                                        return Promise.resolve();
                                    } catch (e) {
                                        return Promise.reject(e.message);
                                    }
                                },
                            },
                        ]}
                        placeholder={`批量添加菜单、功能，格式如下：
[
    { key: 'antDesign', text: 'Ant Design 官网', icon: 'ant-design', url: 'https://ant-design.gitee.io', target: '', order: 2000 },
    { key: 'document', text: '文档', icon: 'book', url: 'http://shubin.wang/docs', target: '_blank', order: 1200 },
    { key: 'customer-header', text: '自定义头部', icon: 'api', path: '/example/customer-header', order: 998 },
    { key: 'user', text: '用户管理', icon: 'user', path: '/users', order: 900 },
    { key: 'role', text: '角色管理', icon: 'lock', path: '/roles', order: 900 },
    { key: 'menu', text: '菜单管理', icon: 'align-left', path: '/menu', order: 900 },
    { key: 'gen', text: '代码生成', icon: 'code', path: '/gen', order: 900 },
    { key: 'page404', text: '404页面不存在', icon: 'file-search', path: '/404', order: 700 },
    { key: 'example', text: '示例', icon: 'align-left', order: 600 },
    { key: 'table-editable', parentKey: 'example', text: '可编辑表格', icon: 'align-left', path: '/example/table-editable', order: 600 },
]
                        `}
                    />
                </Form>
            </ModalContent>
        );
    }
}
