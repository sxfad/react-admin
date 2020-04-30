import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Icon} from 'src/library/components';
import config from 'src/commons/config-hoc';
import localMenus from '../../menus';
import {convertToTree} from 'src/library/utils/tree-utils';
import {Table} from 'src/library/components';
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
        expandedRowKeys: [],
    };

    columns = [
        {
            title: '名称', dataIndex: 'text', key: 'text',
            render: (value, record) => {
                const {icon} = record;

                if (icon) return <span><Icon type={icon}/> {value}</span>;

                return value;
            },
        },
        {
            title: '类型', dataIndex: 'type', key: 'type',
            render: (value, record) => {
                const {url} = record;
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

            // 默认展开全部
            const expandedRowKeys = menus.map(item => item.key);
            this.setState({menus: menuTreeData, expandedRowKeys});
        });
    }

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
                    onChange,
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

