import React from 'react';
import {Tag} from 'antd';
import './style.less';

export const DB_URL_STORE_KEY = 'GEN_DB_URL';
export const SWAGGER_URL_STORE_KEY = 'GEN_SWAGGER_URL';

export function getLabel(str) {
    if (!str) return '未定义';

    if ((str.endsWith('id') || str.endsWith('Id')) && str.length > 2) return str.slice(0, -2);

    return str;
}

export function getFormElementType({oType = 'string', label = ''}) {
    let type = 'input';

    // FIXME 完善更多类型
    if (oType === 'array') type = 'select';

    if (label.startsWith('是否')) type = 'switch';

    if (label.startsWith('密码') || label.endsWith('密码')) type = 'password';

    if (label.includes('电话') || label.includes('手机')) type = 'mobile';

    if (label.includes('邮箱')) type = 'email';

    if (label.includes('时间') || label.includes('日期')) type = 'date';

    if (label.includes('描述') || label.includes('备注') || label.includes('详情')) type = 'textarea';

    return type;
}

export function getTables(res) {
    const tables = res.tables || {};
    const ignoreFields = res.ignoreFields || [];
    const selectedRowKeys = [];

    const dataSource = tables.map(({name: tableName, comment, columns}) => {
        const id = tableName;
        selectedRowKeys.push(id);
        let queryCount = 0;
        return {
            id,
            isTable: true,
            tableName,
            comment,
            listPage: true,
            query: true,
            selectable: true,
            pagination: true,
            serialNumber: true,
            add: true,
            operatorEdit: true,
            operatorDelete: true,
            batchDelete: true,

            modalEdit: true,
            pageEdit: false,
            children: columns.map(it => {
                const {camelCaseName, name, type, isNullable, comment, chinese, length} = it;
                const id = `${tableName}-${name}`;
                selectedRowKeys.push(id);

                const isIgnore = ignoreFields.includes(name);

                // 初始化时 默认选中两个作为条件
                let isQuery = !isIgnore;
                if (isQuery) queryCount++;
                if (queryCount > 2) isQuery = false;

                const formType = getFormElementType({oType: type, label: chinese});

                return {
                    id,
                    tableName,
                    field: camelCaseName,
                    comment: comment,
                    chinese: (chinese || camelCaseName).trim(),
                    name,
                    length,
                    type,
                    formType,
                    isNullable,
                    isColumn: !isIgnore,
                    isQuery,
                    isForm: !isIgnore,
                    isIgnore,
                };
            }),
        };
    });

    return {dataSource, selectedRowKeys};
}

export function renderTags(record, onClick = () => undefined) {
    if (!record) return;

    const configMap = {
        listPage: '列表页 orange',
        query: '查询条件 gold',
        selectable: '可选中 lime',
        pagination: '分页 green',
        serialNumber: '序号 cyan',
        add: '添加 blue',
        operatorEdit: '编辑 geekblue',
        operatorDelete: '删除 red',
        batchDelete: '批量删除 red',
        modalEdit: '弹框编辑 purple',
        pageEdit: '页面编辑 purple',
    };

    return Object.entries(configMap).map(([key, value]) => {
        const enabled = record[key];
        let [label, color] = value.split(' ');
        if (!enabled) color = '#ccc';

        return (
            <Tag
                key={label}
                color={color}
                styleName="tag"
                onClick={() => {
                    let nextEnabled = !record[key];
                    if (key === 'listPage') {
                        Object.keys(configMap).forEach(k => {
                            if (k !== 'modalEdit' && k !== 'pageEdit') {
                                record[k] = nextEnabled;
                            }
                        });

                    } else if (key === 'modalEdit' && nextEnabled) {
                        record.modalEdit = true;
                        record.pageEdit = false;
                    } else if (key === 'pageEdit' && nextEnabled) {
                        record.pageEdit = true;
                        record.modalEdit = false;
                    } else {
                        record[key] = nextEnabled;
                        if (key !== 'modalEdit' && key !== 'pageEdit' && nextEnabled) {
                            record.listPage = true;
                        }
                    }
                    onClick(key);
                }}
            >
                {label}
            </Tag>
        );

    });
}

export function renderFieldTags(record, onClick = () => undefined) {
    const {isColumn, isForm, isQuery} = record;
    const labelMap = {
        isColumn: '表格 orange',
        isQuery: '条件 green',
        isForm: '表单 purple',
    };
    return Object.entries({isColumn, isQuery, isForm}).map(([key, val]) => {
        const [label, color] = labelMap[key].split(' ');

        return (
            <Tag
                key={key}
                color={val ? color : '#ccc'}
                styleName="tag"
                onClick={() => {
                    record[key] = !record[key];
                    onClick(key);
                }}
            >
                {label}
            </Tag>
        );
    });
}
