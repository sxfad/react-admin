import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'src/library/components';
import config from 'src/commons/config-hoc';
import { convertToTree, getGenerationKeys } from 'src/library/utils/tree-utils';
import { Table } from 'src/library/components';
import './style.less';

@config({
    ajax: true,
})
export default class index extends Component {
    static propTypes = {
        value: PropTypes.array,     // 选中的节点
        onChange: PropTypes.func,   // 选择节点时，触发
    };

    state = {
        loading: false,
        menus: [],
        allMenuKeys: [],
        expandedRowKeys: [],
    };

    columns = [
        {
            title: '名称', dataIndex: 'text', key: 'text',
            render: (value, record) => {
                const { icon } = record;

                if (icon) return <span><Icon type={icon}/> {value}</span>;

                return value;
            },
        },
        {
            title: '类型', dataIndex: 'type', key: 'type',
            render: (value, record) => {
                const { url } = record;
                if (url) return '站外菜单';
                if (value === '1') return '站内菜单';
                if (value === '2') return '功能';

                return '菜单';
            },
        },
    ];

    componentDidMount() {
        this.handleSearch();
    }

    handleSearch() {
        this.setState({ loading: true });
        this.props.ajax
            .get('/menus')
            .then(res => {
                const menus = res.map(item => ({ key: item.id, parentKey: item.parentId, ...item }));
                const allMenuKeys = menus.map(item => item.key);
                // 菜单根据order 排序
                const orderedData = [ ...menus ].sort((a, b) => {
                    const aOrder = a.order || 0;
                    const bOrder = b.order || 0;

                    // 如果order都不存在，根据 text 排序
                    if (!aOrder && !bOrder) {
                        return a.text > b.text ? 1 : -1;
                    }

                    return bOrder - aOrder;
                });

                const menuTreeData = convertToTree(orderedData);

                // 默认展开全部
                const expandedRowKeys = menus.map(item => item.key);
                this.setState({ menus: menuTreeData, allMenuKeys, expandedRowKeys });
            })
            .finally(() => this.setState({ loading: false }));

    }


    handleSelect = (record, selected, selectedRows, nativeEvent) => {
        const { value = [] } = this.props;
        const { menus } = this.state;

        const { key } = record;

        let allKeys = [ ...value ];

        // 全选 取消 子级
        const childrenKeys = getGenerationKeys(menus, key);
        const { parentKeys = [] } = record;
        if (selected) {
            // 子级全部加入
            allKeys = allKeys.concat(key, ...childrenKeys);

            // 父级状态 全部加入
            allKeys = allKeys.concat(...parentKeys);
        } else {
            // 子级全部删除
            allKeys = allKeys.filter(item => !(([ key, ...childrenKeys ]).includes(item)));

            // 判断父级状态 只要有后代选中就加入
            parentKeys.reverse().forEach(pk => {
                const cKs = getGenerationKeys(menus, pk);
                const hasChildSelected = cKs.some(ck => allKeys.includes(ck));

                if (hasChildSelected) {
                    allKeys.push(pk);
                } else {
                    allKeys = allKeys.filter(item => item !== pk);
                }
            });
        }

        const { onChange } = this.props;

        onChange && onChange(Array.from(new Set(allKeys)));
    };

    handleSelectAll = (selected) => {
        const { allMenuKeys } = this.state;
        const { onChange } = this.props;

        onChange && onChange(selected ? allMenuKeys : []);
    };

    indeterminate = (record) => {
        const { value } = this.props;
        const { menus } = this.state;
        const { key } = record;
        // 如果 部分子级被选中，就是半选
        const childrenKeys = getGenerationKeys(menus, key);
        return value.includes(key) && value.some(k => childrenKeys.includes(k)) && !childrenKeys.every(k => value.includes(k));
    };

    render() {
        const {
            menus,
            loading,
            expandedRowKeys,
        } = this.state;

        const { value, onChange, ...others } = this.props;

        return (
            <Table
                expandable={{
                    expandedRowKeys: expandedRowKeys,
                    onExpandedRowsChange: expandedRowKeys => this.setState({ expandedRowKeys }),
                }}
                rowSelection={{
                    selectedRowKeys: value,
                    onSelect: this.handleSelect,
                    onSelectAll: this.handleSelectAll,
                    getCheckboxProps: record => {
                        const indeterminate = this.indeterminate(record);
                        return { indeterminate };
                    },
                }}
                loading={loading}
                columns={this.columns}
                dataSource={menus}
                pagination={false}
                {...others}
            />
        );
    }
}

