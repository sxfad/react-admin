import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Input, Button } from 'antd';
import { convertToTree, filterTree, Table, renderTableCheckbox } from '@ra-lib/admin';
import config from 'src/commons/config-hoc';
import options from 'src/options';

const menuTargetOptions = options.menuTarget;

const WithCheckboxTable = renderTableCheckbox(Table);

export default config()(function MenuTableSelect(props) {
    const { menus, value, onChange, topId, getCheckboxProps, ...others } = props;

    const [loading, setLoading] = useState(false);
    const [dataSource, setDataSource] = useState([]);
    const [menuTreeData, setMenuTreeData] = useState([]);
    const [allMenuKeys, setAllMenuKeys] = useState([]);
    const [expandedRowKeys, setExpandedRowKeys] = useState([]);
    const [expandedAll, setExpandedAll] = useState(true);

    const timerRef = useRef(0);

    const columns = [
        { title: '名称', dataIndex: 'title', key: 'title' },
        {
            title: '类型',
            dataIndex: 'type',
            key: 'type',
            width: 100,
            render: (value, record) => {
                if (value === 2) return '功能权限码';

                const { target } = record;

                return menuTargetOptions.find((item) => item.value === target)?.label || '-';
            },
        },
    ];

    useEffect(() => {
        (async () => {
            await handleSearch();
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!topId) return;
        const dataSource = [...menuTreeData].filter((item) => item.id === topId);

        setDataSource(dataSource);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [menuTreeData, topId]);

    const fetchMenus = useCallback(async () => {
        const res = await props.ajax.get('/menu/queryMenus', { enabled: true });

        return (res || []).map((item) => {
            return {
                ...item,
            };
        });
    }, [props.ajax]);

    const handleSearch = useCallback(async () => {
        setLoading(true);

        try {
            const menusRes = menus || (await fetchMenus());
            const allMenuKeys = menusRes.map((item) => item.id);
            const menuTreeData = convertToTree(menusRes);

            // 默认展开全部
            const expandedRowKeys = [...allMenuKeys];
            setDataSource(menuTreeData);
            setMenuTreeData(menuTreeData);
            setAllMenuKeys(allMenuKeys);
            setExpandedRowKeys(expandedRowKeys);

            setLoading(false);
        } catch (e) {
            setLoading(false);
            throw e;
        }
    }, [fetchMenus, menus]);

    const handleSearchValue = useCallback(() => {
        const dataSource = filterTree(menuTreeData, (node) => {
            let { title, path, name, code } = node;

            return [title, path, name, code].some((item) => {
                const lowerValue = (item || '').toLowerCase();
                return lowerValue.includes(value);
            });
        });
        setDataSource(dataSource);
        setExpandedAll(true);
        setExpandedRowKeys(allMenuKeys);
    }, [allMenuKeys, menuTreeData, value]);

    const handleSearchChange = useCallback(
        (e) => {
            if (timerRef.current) clearTimeout(timerRef.current);

            timerRef.current = setTimeout(() => handleSearchValue(e.target.value), 3000);
        },
        [handleSearchValue],
    );

    const handleToggleExpanded = useCallback(() => {
        const expandedRowKeys = !expandedAll ? allMenuKeys : [];
        setExpandedAll(!expandedAll);
        setExpandedRowKeys(expandedRowKeys);
    }, [allMenuKeys, expandedAll]);

    return (
        <>
            <div style={{ padding: 8, width: '100%', display: 'flex', alignItems: 'center' }}>
                <Input.Search
                    style={{ flex: 1 }}
                    allowClear
                    placeholder="输入关键字进行搜索"
                    onSearch={handleSearchValue}
                    onChange={handleSearchChange}
                />
                <Button type="text" style={{ flex: 0, marginLeft: 8 }} onClick={handleToggleExpanded}>
                    全部{expandedAll ? '收起' : '展开'}
                </Button>
            </div>
            <WithCheckboxTable
                expandable={{
                    expandedRowKeys: expandedRowKeys,
                    onExpandedRowsChange: (expandedRowKeys) => setExpandedRowKeys(expandedRowKeys),
                }}
                rowSelection={{
                    getCheckboxProps,
                    selectedRowKeys: value,
                    onChange: onChange,
                }}
                loading={loading}
                columns={columns}
                dataSource={dataSource}
                pagination={false}
                rowKey="id"
                size="small"
                {...others}
            />
        </>
    );
});
