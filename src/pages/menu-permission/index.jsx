import React, {Component} from 'react';
import {Table, Icon, Modal, Form, Row, Col} from 'antd';
import config from '@/commons/config-hoc';
import PageContent from '@/layouts/page-content';
import localMenus from '../../menus';
import {convertToTree} from "@/library/utils/tree-utils";
import {ToolBar, Operator, FormElement} from '@/library/antd';
import IconPicker from "@/components/icon-picker";
import './style.less';

@config({
    path: '/menu-permission',
    title: {local: 'menus', text: '菜单&权限', icon: 'lock'},
    ajax: true,
})
@Form.create()
export default class index extends Component {
    state = {
        loading: false,
        menus: [],
        visible: false,
        record: {},
        iconVisible: false,
    };

    columns = [
        // key 与parentKey自动生成了，不需要展示和编辑
        // {title: 'key', dataIndex: 'key', key: 'key'},
        // {title: 'parentKey', dataIndex: 'parentKey', key: 'parentKey'},
        {
            title: '名称', dataIndex: 'text', key: 'text', width: 200,
            render: (value, record) => {
                const {icon} = record;

                if (icon) return <span><Icon type={icon}/> {value}</span>;

                return value;
            }
        },
        {title: 'path', dataIndex: 'path', key: 'path', width: 100},
        {title: 'url', dataIndex: 'url', key: 'url'},
        {title: 'target', dataIndex: 'target', key: 'target', width: 60},
        {title: '国际化', dataIndex: 'local', key: 'local', width: 60},
        {
            title: '类型', dataIndex: 'type', key: 'type', width: 60,
            render: value => {
                if (value === '1') return '菜单';
                if (value === '2') return '功能';
                // 默认都为菜单
                return '菜单';
            }
        },
        {title: '功能编码', dataIndex: 'code', key: 'code', width: 100},
        {title: '排序', dataIndex: 'order', key: 'order', width: 60},
        {
            title: '操作', dataIndex: 'operator', key: 'operator', width: 150,
            render: (value, record) => {
                const items = [
                    {
                        label: '编辑',
                        icon: 'form',
                        onClick: () => this.handleEditNode(record),
                    },
                    {
                        label: '删除',
                        icon: 'delete',
                        color: 'red',
                        confirm: {
                            title: '您请确定要删除此节点及其子节点吗？',
                            onConfirm: () => this.handleDeleteNode(record),
                        }
                    },
                    {
                        label: '添加子菜单',
                        icon: 'folder-add',
                        onClick: () => this.handleAddSubMenu(record),
                    },
                    {
                        label: '添加子功能',
                        icon: 'file-add',
                        onClick: () => this.handleAddSubFunction(record),
                    },
                ];
                return <Operator items={items}/>
            },
        },
    ];

    componentDidMount() {
        this.fetchMenus();
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

            this.setState({menus: menuTreeData});
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

    handleAddTopMenu = () => {
        this.props.form.resetFields();
        this.setState({visible: true});
    };

    handleEditNode = (record) => {
        const {resetFields, setFieldsValue} = this.props.form;

        resetFields();
        const {
            key,
            parentKey,
            text,
            icon,
            path,
            url,
            target,
            local,
            type = '1',
            code,
            order,
        } = record;

        setTimeout(() => {
            setFieldsValue({
                key,
                parentKey,
                text,
                icon,
                path,
                url,
                target,
                local,
                type,
                code,
                order,
            })
        });
        this.setState({visible: true, record});
    };

    handleAddSubMenu = (record) => {
        const {resetFields, setFieldsValue} = this.props.form;

        resetFields();

        const parentKey = record.key;
        setTimeout(() => setFieldsValue({parentKey, type: '1'}));

        this.setState({visible: true, record});
    };

    handleAddSubFunction = (record) => {
        const {resetFields, setFieldsValue} = this.props.form;

        resetFields();
        const parentKey = record.key;
        setTimeout(() => setFieldsValue({parentKey, type: '2'}));

        this.setState({visible: true, record});
    };

    handleDeleteNode = (record) => {
        const {key} = record;

        // TODO
        this.setState({loading: true});
        this.props.ajax
            .del(`/menus/${key}`)
            .then(() => {
                this.setState({visible: false});
                this.fetchMenus();
            })
            .finally(() => this.setState({loading: false}));
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);

                // 如果key存在视为修改，其他为添加
                const {key} = values;
                const ajax = key ? this.props.ajax.post : this.props.ajax.put;

                // TODO
                this.setState({loading: true});
                ajax('/menus', values)
                    .then(() => {
                        this.setState({visible: false});
                        this.fetchMenus();
                    })
                    .finally(() => this.setState({loading: false}));
            }
        });
    };

    handleIconClick = () => {
        this.setState({iconVisible: true});
    };

    FormElement = (props) => <FormElement form={this.props.form} labelWidth={70} {...props}/>;

    render() {
        const {
            menus,
            visible,
            loading,
            iconVisible,
        } = this.state;
        const {form, form: {getFieldValue, setFieldsValue}} = this.props;

        const FormElement = this.FormElement;

        return (
            <PageContent styleName="root">
                <ToolBar items={[{type: 'primary', text: '添加顶级', onClick: this.handleAddTopMenu}]}/>
                <Table
                    loading={loading}
                    columns={this.columns}
                    dataSource={menus}
                    pagination={false}
                />
                <Modal
                    id="menu-modal"
                    title="菜单&权限"
                    visible={visible}
                    onOk={this.handleSubmit}
                    onCancel={() => this.setState({visible: false})}
                >
                    <Form onSubmit={this.handleSubmit}>
                        <FormElement type="hidden" field="key"/>
                        <FormElement type="hidden" field="parentKey"/>
                        <Row>
                            <Col span={12}>
                                <FormElement
                                    label="名称"
                                    field="text"
                                    decorator={{
                                        rules: [
                                            {required: true, message: '请输入名称！'},
                                        ],
                                    }}
                                />
                            </Col>
                            <Col span={12}>
                                <FormElement
                                    label="图标"
                                    field="icon"
                                    addonAfter={<Icon style={{cursor: 'pointer'}} onClick={this.handleIconClick} type={getFieldValue('icon') || 'search'}/>}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <FormElement
                                    label="类型"
                                    type="select"
                                    options={[
                                        {value: '1', label: '菜单'},
                                        {value: '2', label: '功能'},
                                    ]}
                                    field="type"
                                    decorator={{initialValue: '1'}}
                                    getPopupContainer={() => document.querySelector('.ant-modal-wrap')}
                                />
                            </Col>
                            <Col span={12}>
                                <FormElement
                                    disabled={form.getFieldValue('type') !== '2'}
                                    label="编码"
                                    field="code"
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <FormElement
                                    label="国际化"
                                    field="local"
                                />
                            </Col>
                            <Col span={12}>
                                <FormElement
                                    label="排序"
                                    type="number"
                                    field="order"
                                    min={0}
                                    step={1}
                                />
                            </Col>
                        </Row>
                        <FormElement
                            disabled={form.getFieldValue('type') === '2'}
                            label="path"
                            field="path"
                        />
                        <Row>
                            <Col span={15}>
                                <FormElement
                                    disabled={form.getFieldValue('type') === '2'}
                                    label="url"
                                    field="url"
                                />
                            </Col>
                            <Col span={9}>
                                <FormElement
                                    disabled={form.getFieldValue('type') === '2'}
                                    label="target"
                                    field="target"
                                />
                            </Col>
                        </Row>
                    </Form>
                </Modal>
                <IconPicker
                    visible={iconVisible}
                    onOk={(type) => {
                        this.setState({iconVisible: false});
                        setFieldsValue({icon: type});
                    }}
                    onCancel={() => this.setState({iconVisible: false})}
                />
            </PageContent>
        );
    }
}

