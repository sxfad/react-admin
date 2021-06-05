import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Input, Button} from 'antd';
import {convertToTree, filterTree} from '@ra-lib/util';
import {Table, renderTableCheckbox} from '@ra-lib/components';
import config from 'src/commons/config-hoc';
import {menuTargetOptions} from 'src/commons/options';

const WithCheckboxTable = renderTableCheckbox(Table);

@config({
    ajax: true,
})
export default class MenuTableSelect extends Component {
    static propTypes = {
        value: PropTypes.array,     // 选中的节点
        onChange: PropTypes.func,   // 选择节点时，触发
    };

    state = {
        loading: false,
        dataSource: [],     // 表格展示的数据，搜索时是 menuTreeData 子集
        menuTreeData: [],   // 所有的菜单数据
        allMenuKeys: [],
        expandedRowKeys: [],
        expandedAll: true,
    };

    columns = [
        {title: '名称', dataIndex: 'title', key: 'title'},
        {
            title: '类型', dataIndex: 'type', key: 'type', width: 80,
            render: (value, record) => {
                if (value === '2') return '功能权限码';

                const {target} = record;

                return menuTargetOptions.find(item => item.value === target)?.label || '-';
            },
        },
    ];

    componentDidMount() {
        (async () => {
            await this.handleSearch();
        })();
    }

    fetchMenus = async () => {
        const res = await this.props.ajax.get('/authority/getSystemMenuAll');

        return (res || []).map(item => {
            return {
                ...item,
                parentId: item.parentsId ? item.parentsId + '' : undefined,
                order: item.sort,
                status: item.status === 1,
            };
        }).filter(item => item.status);
    };

    handleSearch = async () => {
        this.setState({loading: true});
        try {
            this.setState({loading: false});
            const menus = this.props.menus || await this.fetchMenus();
            const allMenuKeys = menus.map(item => item.id);
            const menuTreeData = convertToTree(menus);

            // 默认展开全部
            const expandedRowKeys = [...allMenuKeys];
            this.setState({dataSource: menuTreeData, menuTreeData, allMenuKeys, expandedRowKeys});

        } catch (e) {
            this.setState({loading: false});
            throw e;
        }
    };

    handleSearchValue = (value) => {
        const {menuTreeData, allMenuKeys} = this.state;

        const dataSource = filterTree(menuTreeData, node => {
            let {title, path, name, code} = node;

            return [title, path, name, code].some(item => {
                const lowerValue = (item || '').toLowerCase();
                return lowerValue.includes(value);
            });
        });
        this.setState({
            dataSource,
            expandedAll: true,
            expandedRowKeys: allMenuKeys,
        });
    };

    handleSearchChange = (e) => {
        // 防抖
        if (this.timer) clearTimeout(this.timer);

        this.timer = setTimeout(() => this.handleSearchValue(e.target.value), 300);
    };

    handleToggleExpanded = () => {
        const {expandedAll, allMenuKeys} = this.state;
        const expandedRowKeys = !expandedAll ? allMenuKeys : [];
        this.setState({expandedAll: !expandedAll, expandedRowKeys});
    };

    render() {
        const {
            dataSource,
            loading,
            expandedRowKeys,
            expandedAll,
        } = this.state;

        const {value, onChange, disabled, ...others} = this.props;

        return (
            <>
                <div style={{padding: 8, width: '100%', display: 'flex', alignItems: 'center'}}>
                    <Input.Search
                        style={{flex: 1}}
                        allowClear
                        placeholder="输入关键字进行搜索"
                        onSearch={this.handleSearchValue}
                        onChange={this.handleSearchChange}
                    />
                    <Button
                        type="text"
                        style={{flex: 0, marginLeft: 16}}
                        onClick={this.handleToggleExpanded}
                    >全部{expandedAll ? '收起' : '展开'}</Button>
                </div>
                <WithCheckboxTable
                    expandable={{
                        expandedRowKeys: expandedRowKeys,
                        onExpandedRowsChange: expandedRowKeys => this.setState({expandedRowKeys}),
                    }}
                    rowSelection={{
                        getCheckboxProps: () => {
                            return {disabled};
                        },
                        selectedRowKeys: value,
                        onChange: onChange,
                    }}
                    loading={loading}
                    columns={this.columns}
                    dataSource={dataSource}
                    pagination={false}
                    rowKey="id"
                    size="small"
                    {...others}
                />
            </>
        );
    }

}

