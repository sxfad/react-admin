import React, {Component} from 'react';
import {Tabs, Tag} from 'antd';
import config from 'src/commons/config-hoc';
import PageContent from 'src/layouts/page-content';
import Fast from './Fast';
import Single from './Single';
import './style.less';

const {TabPane} = Tabs;

export const DB_URL_STORE_KEY = 'GEN_DB_URL';

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

                return {
                    id,
                    tableName,
                    field: camelCaseName,
                    comment: comment,
                    chinese: (chinese || camelCaseName).trim(),
                    name,
                    length,
                    type,
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

@config({
    title: '代码生成',
    path: '/gen',
})
export default class index extends Component {
    state = {};

    componentDidMount() {

    }

    render() {
        return (
            <PageContent styleName="root">
                <Tabs defaultActiveKey="single">
                    <TabPane key="fast" tab="快速生成">
                        <Fast/>
                    </TabPane>
                    <TabPane key="single" tab="单独生成">
                        <Single/>
                    </TabPane>
                </Tabs>
            </PageContent>
        );
    }
}
