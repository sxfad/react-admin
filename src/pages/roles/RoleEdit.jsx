import React, {Component} from 'react';
import {Modal, Form, Spin, Table, Icon, Row, Col} from 'antd';
import config from '@/commons/config-hoc';
import {FormElement} from '@/library/antd';
import localMenus from "@/menus";
import {convertToTree, getGenerationKeys} from "@/library/utils/tree-utils";
import {arrayRemove, arrayPush} from '@/library/utils';

@config({
    ajax: true,
})
@Form.create()
export default class RoleEdit extends Component {
    state = {
        loading: false,
        data: {},
        selectedRowKeys: [],
        halfSelectedRowKeys: [],
        menuTreeData: [],
    };

    columns = [
        {
            title: '名称', dataIndex: 'text', key: 'text', width: 250,
            render: (value, record) => {
                const {icon} = record;

                if (icon) return <span><Icon type={icon}/> {value}</span>;

                return value;
            }
        },
        {
            title: '类型', dataIndex: 'type', key: 'type', width: 80,
            render: value => {
                if (value === '1') return '菜单';
                if (value === '2') return '功能';
                // 默认都为菜单
                return '菜单';
            }
        },
        {title: 'path', dataIndex: 'path', key: 'path', width: 150},
        {title: 'url', dataIndex: 'url', key: 'url'},
        {title: 'target', dataIndex: 'target', key: 'target', width: 100},
    ];

    componentDidMount() {
        this.fetchMenus();
        this.windowHeight = document.body.clientHeight;
    }

    componentDidUpdate(prevProps) {
        const {visible, form: {resetFields}} = this.props;

        // 打开弹框
        if (!prevProps.visible && visible) {
            // 重置表单，接下来填充新的数据
            resetFields();

            // 重新获取数据
            this.fetchData();
        }
    }

    fetchData() {
        const {roleId} = this.props;

        if (!roleId) {
            // 添加操作
            this.setState({data: {}, selectedRowKeys: []});

        } else {
            // 修改操作

            // TODO 根据id 发送ajax请求获取数据
            this.setState({loading: true});
            setTimeout(() => {
                const data = {
                    id: roleId,
                    name: `角色名称${roleId}`,
                    description: `角色描述${roleId}`,
                    permissions: ['ajax', 'user', 'component', '/example/antd/async-select'],
                };

                const selectedRowKeys = data.permissions;

                this.setState({data, selectedRowKeys});

                // 如果不是所有的子级都选中，删除父级的key，父级为半选状态
                this.setSelectedRowKeys(selectedRowKeys);
                this.setState({loading: false});

            }, 500);
        }
    }

    fetchMenus() {
        localMenus().then(menus => {
            // 菜单根据order 排序
            const orderedData = [...menus].sort((a, b) => {
                const aOrder = a.order || 0;
                const bOrder = b.order || 0;

                // 如果order都不存在，根据 text 排序
                if (!aOrder && !bOrder) {
                    return a.text > b.text ? 1 : -1;
                }

                return bOrder - aOrder;
            });

            const menuTreeData = convertToTree(orderedData);

            this.setState({menuTreeData});
        });
        /*
        // TODO 获取所有的菜单，不区分用户
        this.setState({loading: true});
        this.props.ajax
            .get('/menus')
            .then(res => {
                this.setState({menus: res});
            })
            .finally(() => this.setState({loading: false}));
        */
    }

    handleOk = () => {
        const {loading, selectedRowKeys, halfSelectedRowKeys} = this.state;
        if (loading) return;
        const {onOk, form: {validateFieldsAndScroll}} = this.props;

        validateFieldsAndScroll((err, values) => {
            if (!err) {
                // 半选、全选都要提交给后端保存
                const keys = selectedRowKeys.concat(halfSelectedRowKeys);
                const params = {...values, keys};
                const {id} = values;

                console.log(params);

                // TODO ajax 提交数据

                // id存在未修改，不存在未添加
                const ajax = id ? this.props.ajax.put : this.props.ajax.post;

                this.setState({loading: true});
                ajax('/roles', params)
                    .then(() => {
                        if (onOk) onOk();
                    })
                    .finally(() => this.setState({loading: false}));
            }
        });
    };

    handleCancel = () => {
        const {onCancel} = this.props;
        if (onCancel) onCancel();
    };

    // 处理选中状态：区分全选、半选
    setSelectedRowKeys = (srk) => {
        let selectedRowKeys = [...srk];
        let halfSelectedRowKeys = [...this.state.halfSelectedRowKeys];
        const {menuTreeData} = this.state;

        const loop = (dataSource) => {
            dataSource.forEach(item => {
                const {children, key} = item;
                if (children?.length) {
                    // 所有后代节点
                    const keys = getGenerationKeys(dataSource, key);
                    // 未选中节点
                    const unSelectedKeys = keys.filter(it => !selectedRowKeys.find(sk => sk === it));

                    // 一个也未选中
                    if (unSelectedKeys.length && unSelectedKeys.length === keys.length) {
                        halfSelectedRowKeys = arrayRemove(halfSelectedRowKeys, key);
                        selectedRowKeys = arrayRemove(selectedRowKeys, key);
                    }

                    // 部分选中
                    if (unSelectedKeys.length && unSelectedKeys.length < keys.length) {
                        halfSelectedRowKeys = arrayPush(halfSelectedRowKeys, key);
                        selectedRowKeys = arrayRemove(selectedRowKeys, key);
                    }

                    // 全部选中了
                    if (!unSelectedKeys.length && keys.length) {
                        halfSelectedRowKeys = arrayRemove(halfSelectedRowKeys, key);
                        selectedRowKeys = arrayPush(selectedRowKeys, key);
                    }

                    loop(children);
                }
            });
        };

        loop(menuTreeData);

        this.setState({halfSelectedRowKeys, selectedRowKeys});
    };

    getCheckboxProps = (record) => {
        const {halfSelectedRowKeys, selectedRowKeys} = this.state;
        const {key} = record;

        // 半选
        if (halfSelectedRowKeys.includes(key)) return {checked: false, indeterminate: true};

        // 全选
        if (selectedRowKeys.includes(key)) return {checked: true, indeterminate: false};

        return {};
    };

    onSelect = (record, selected) => {
        const {key} = record;
        let selectedRowKeys = [...this.state.selectedRowKeys];

        // 选中、反选所有的子节点
        const keys = getGenerationKeys(this.state.menuTreeData, key);
        keys.push(key);

        keys.forEach(k => {
            if (selected) {
                selectedRowKeys = arrayPush(selectedRowKeys, k);
            } else {
                selectedRowKeys = arrayRemove(selectedRowKeys, k);
            }
            this.setSelectedRowKeys(selectedRowKeys);
        })
    };

    FormElement = (props) => <FormElement form={this.props.form} labelWidth={100} {...props}/>;

    render() {
        const {visible} = this.props;
        const {loading, data, menuTreeData, selectedRowKeys} = this.state;
        const FormElement = this.FormElement;
        return (
            <Modal
                destroyOnClose
                width="70%"
                confirmLoading={loading}
                visible={visible}
                title={data.id ? '编辑角色' : '添加角色'}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
            >
                <Spin spinning={loading}>
                    <Form>
                        {data.id ? (<FormElement type="hidden" field="id" decorator={{initialValue: data.id}}/>) : null}
                        <Row>
                            <Col span={10}>
                                <FormElement
                                    label="角色名称"
                                    field="name"
                                    decorator={{
                                        initialValue: data.name,
                                        rules: [
                                            {required: true, message: '请输入角色名称！'}
                                        ],
                                    }}
                                />
                            </Col>
                            <Col span={14}>
                                <FormElement
                                    label="角色描述"
                                    type="textarea"
                                    field="description"
                                    rows={1}
                                    decorator={{
                                        initialValue: data.description,
                                    }}
                                />
                            </Col>
                        </Row>
                    </Form>
                    <Table
                        size="small"
                        defaultExpandAllRows
                        columns={this.columns}
                        rowSelection={{
                            selectedRowKeys,
                            onChange: this.setSelectedRowKeys,
                            getCheckboxProps: this.getCheckboxProps,
                            onSelect: this.onSelect
                        }}
                        dataSource={menuTreeData}
                        pagination={false}
                        scroll={{y: this.windowHeight ? this.windowHeight - 390 : 400}}
                    />
                </Spin>
            </Modal>
        );
    }
}
