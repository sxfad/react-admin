import React, {Component} from 'react';
import PropTypes from 'prop-types';
import config from 'src/commons/config-hoc';
import {convertToTree, findGenerationNodes} from '@ra-lib/util';
import {Table} from '@ra-lib/components';
import getMenus from 'src/menus';
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
            title: '标题', dataIndex: 'title', key: 'title',
        },
        {
            title: '类型', dataIndex: 'type', key: 'type', width: 80,
            render: (value, record) => {
                const {target} = record;
                if (target) return '站外菜单';
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
        this.setState({loading: true});
        // this.props.ajax
        //     .get('/menus')
        getMenus()
            .then(res => {
                const menus = res;
                const allMenuKeys = menus.map(item => item.id);
                const menuTreeData = convertToTree(menus);

                // 默认展开全部
                const expandedRowKeys = [...allMenuKeys];
                this.setState({menus: menuTreeData, allMenuKeys, expandedRowKeys});
            })
            .finally(() => this.setState({loading: false}));

    }

    handleSelect = (record, selected) => {
        const {value = []} = this.props;
        const {menus} = this.state;

        const {id} = record;

        let allKeys = [...value];

        // 全选 取消 子级
        const childrenKeys = findGenerationNodes(menus, id).map(item => item.id);
        const {parentKeys = []} = record;
        if (selected) {
            // 子级全部加入
            allKeys = allKeys.concat(id, ...childrenKeys);

            // 父级状态 全部加入
            allKeys = allKeys.concat(...parentKeys);
        } else {
            // 子级全部删除
            allKeys = allKeys.filter(item => !(([id, ...childrenKeys]).includes(item)));

            // 判断父级状态 只要有后代选中就加入
            parentKeys.reverse().forEach(pId => {
                const cKs = findGenerationNodes(menus, pId).map(item => item.id);
                const hasChildSelected = cKs.some(ck => allKeys.includes(ck));

                if (hasChildSelected) {
                    allKeys.push(pId);
                } else {
                    allKeys = allKeys.filter(item => item !== pId);
                }
            });
        }

        const {onChange} = this.props;

        onChange && onChange(Array.from(new Set(allKeys)));
    };

    handleSelectAll = (selected) => {
        const {allMenuKeys} = this.state;
        const {onChange} = this.props;

        onChange && onChange(selected ? allMenuKeys : []);
    };

    render() {
        const {
            menus,
            loading,
            expandedRowKeys,
        } = this.state;

        const {value, onChange, ...others} = this.props;

        return (
            <Table
                expandable={{
                    expandedRowKeys: expandedRowKeys,
                    onExpandedRowsChange: expandedRowKeys => this.setState({expandedRowKeys}),
                }}
                rowSelection={{
                    selectedRowKeys: value,
                    onSelect: this.handleSelect,
                    onSelectAll: this.handleSelectAll,
                }}
                loading={loading}
                columns={this.columns}
                dataSource={menus}
                pagination={false}
                rowKey="id"
                {...others}
            />
        );
    }
}

