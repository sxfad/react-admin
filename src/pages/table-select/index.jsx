import React from 'react';
import {Checkbox} from 'antd';
import config from 'src/commons/config-hoc';
import {PageContent, Table} from '@ra-lib/components';
import {convertToTree, findGenerationNodes, findParentNodes} from '@ra-lib/util';

const testDataSource = [
    {id: '1', name: '名称1', remark: '备注1'},
    {id: '11', name: '名称11', remark: '备注11', parentId: '1'},
    {id: '111', name: '名称111', remark: '备注111', parentId: '11'},
    {id: '112', name: '名称112', remark: '备注112', parentId: '11'},
    {id: '113', name: '名称113', remark: '备注113', parentId: '11'},
    {id: '12', name: '名称12', remark: '备注12', parentId: '1'},
    {id: '13', name: '名称13', remark: '备注13', parentId: '1'},
    {id: '14', name: '名称14', remark: '备注14', parentId: '1'},
    {id: '2', name: '名称2', remark: '备注2'},
    {id: '3', name: '名称3', remark: '备注3'},
    {id: '4', name: '名称4', remark: '备注4'},
];


function renderTableCheckbox(WrappedTable) {
    return class WithCheckboxTable extends React.Component {
        state = {
            selectedRowKeys: [],
        };

        handleCheck = (e, record) => {
            const {dataSource, rowKey = 'key'} = this.props;
            const {checked} = e.target;
            const key = record[rowKey];
            const generationNodes = record.__generationNodes || findGenerationNodes(dataSource, key) || [];
            record.__generationNodes = generationNodes;
            const parentNodes = record.___parentNodes || findParentNodes(dataSource, key) || [];
            record.___parentNodes = parentNodes;
            record.__indeterminate = false;

            if (checked) {
                record.__checked = true;
                // 后代全部选中
                generationNodes.forEach(item => item.__checked = true);
            } else {
                record.__checked = false;
                // 后代全部取消选中
                generationNodes.forEach(item => item.__checked = false);
            }

            // 处理父级半选状态, 从底层向上处理
            [...parentNodes].reverse().forEach(node => {
                const key = node[rowKey];
                const generationNodes = node.__generationNodes || findGenerationNodes(dataSource, key);
                node.__generationNodes = generationNodes;

                let allChecked = true;
                let hasChecked = false;

                generationNodes.forEach(item => {
                    if (!item.__checked) allChecked = false;
                    if (item.__checked) hasChecked = true;
                });

                node.__checked = allChecked || hasChecked;

                node.__indeterminate = !allChecked && hasChecked;
            });

            this.setSelectedKeys(dataSource);
        };
        renderCell = (_checked, record, index, originNode) => {
            return (
                <Checkbox
                    checked={record.__checked}
                    onChange={e => this.handleCheck(e, record)}
                    indeterminate={record.__indeterminate}
                />
            )
        };
        handleSelectAll = (selected, selectedRows, changeRows) => {
            const {dataSource} = this.props;
            const loop = nodes => nodes.forEach(node => {
                const {children} = node;
                node.__checked = selected;
                node.__indeterminate = false;
                if (children) loop(children);
            });
            loop(dataSource);
            this.setSelectedKeys(dataSource);
        };

        setSelectedKeys = (dataSource) => {
            const {rowKey = 'key', rowSelection = {}} = this.props;
            const {onChange} = rowSelection;

            const selectedRows = [];
            const selectedRowKeys = [];

            const loop = nodes => nodes.forEach(node => {
                const {children} = node;
                const key = node[rowKey];
                if (node.__checked) {
                    selectedRowKeys.push(key);
                    selectedRows.push(node);
                }
                if (children) loop(children);
            });
            loop(dataSource);

            onChange && onChange(selectedRowKeys, selectedRows);
        };

        render() {
            const {rowSelection, columns, checkboxIndex = 0, ...otherProps} = this.props;
            const {selectedRowKeys, renderCell, onSelectAll, onChange, ...others} = rowSelection;


            const nextColumns = [...columns];
            const col = {...nextColumns[checkboxIndex]};
            if (!col.render) col.render = value => value;
            const render = (value, record, index) => (
                <>
                    {this.renderCell(null, record)}
                    <span style={{marginLeft: 8}}>
                        {col.render(value, record, index)}
                    </span>
                </>
            );
            nextColumns.splice(checkboxIndex, 1, {...col, render});

            return (
                <WrappedTable
                    {...otherProps}
                    columns={nextColumns}
                    rowSelection={{
                        ...others,
                        selectedRowKeys: selectedRowKeys,
                        renderCell: () => null,
                        // renderCell: this.renderCell,
                        onSelectAll: this.handleSelectAll,
                    }}
                />
            )
        }
    }
}

const CheckboxTable = renderTableCheckbox(Table);

@config({
    path: '/table/select',
})
export default class TableSelect extends React.Component {
    state = {
        dataSource: [],
        selectedRowKeys: [],
        selectedRows: [],
    };
    columns = [
        {
            title: '名称', dataIndex: 'name',
            render: (value, record) => value + 2222,
        },
        {title: '备注', dataIndex: 'remark'},
    ];

    componentDidMount() {
        this.setState({dataSource: convertToTree(testDataSource)});
    }

    handleChange = (selectedRowKeys, selectedRows) => {

        this.setState({selectedRowKeys, selectedRows});
    };

    render() {
        const {dataSource, selectedRowKeys} = this.state;

        console.log('selectedRowKeys', selectedRowKeys);

        return (
            <PageContent>
                <CheckboxTable
                    fitHeight
                    rowSelection={{
                        selectedRowKeys,
                        onChange: this.handleChange,
                    }}
                    columns={this.columns}
                    dataSource={dataSource}
                    rowKey="id"
                    pagination={false}
                />
            </PageContent>
        )
    }
}
