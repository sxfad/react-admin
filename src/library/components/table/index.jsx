import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Table} from 'antd';
import {getElementTop} from 'src/library/utils';

export default class TableComponent extends Component {
    static propTypes = {
        surplusSpace: PropTypes.bool, // 是否使用剩余空间，如果 true 表格将铺满全屏
        serialNumber: PropTypes.bool, // 是否显示序号
        serialText: PropTypes.string, // 序号列表头名称
        pageSize: PropTypes.number,
        pageNum: PropTypes.number,
        otherHeight: PropTypes.number,
        offsetHeight: PropTypes.number,

        // 其他antd属性列出便于IDE提示
        tableLayout: PropTypes.any,
        bordered: PropTypes.any,
        columns: PropTypes.any,
        components: PropTypes.any,
        dataSource: PropTypes.any,
        expandable: PropTypes.any,
        footer: PropTypes.any,
        loading: PropTypes.any,
        locale: PropTypes.any,
        pagination: PropTypes.any,
        rowClassName: PropTypes.any,
        rowKey: PropTypes.any,
        rowSelection: PropTypes.any,
        scroll: PropTypes.any,
        showHeader: PropTypes.any,
        size: PropTypes.any,
        summary: PropTypes.any,
        title: PropTypes.any,
        onChange: PropTypes.any,
        onHeaderRow: PropTypes.any,
        onRow: PropTypes.any,
        getPopupContainer: PropTypes.any,
        sortDirections: PropTypes.any,
        showSorterTooltip: PropTypes.any,
    };

    static defaultProps = {
        surplusSpace: true,
        pagination: false,
        serialText: '#',
    };

    state = {
        tableBodyHeight: 300,
    };

    componentDidMount() {
        if (this.props.surplusSpace) {
            this.setTableBodyHeight();
            window.addEventListener('resize', this.setTableBodyHeight);
        }
    };

    componentDidUpdate(prevProps) {
        if (this.props.surplusSpace) {
            const prevDataSource = prevProps.dataSource;
            const {dataSource} = this.props;

            if (dataSource?.length !== prevDataSource?.length) {
                this.setTableBodyHeight();
            }
        }
    }

    componentWillUnmount() {
        if (this.props.surplusSpace) {
            window.removeEventListener('resize', this.setTableBodyHeight);
        }
    }

    setTableBodyHeight = () => {
        this.tableBody = this.wrapper.querySelector('.ant-table-tbody');
        this.tablePlaceholder = this.wrapper.querySelector('.ant-table-placeholder');
        this.tableHead = this.wrapper.querySelector('.ant-table-header');

        const {pathname, search} = window.location;
        const currentPath = window.decodeURIComponent(`${pathname}${search}`);
        const activeTab = document.getElementById(currentPath);
        this.pagination = (activeTab ? activeTab : document).querySelector('.pagination-wrap');

        let tableBodyHeight;
        const {dataSource} = this.props;
        const windowHeight = document.documentElement.clientHeight;

        // 计算除了表格内容之外，其他高度
        if ('otherHeight' in this.props) {
            const {otherHeight} = this.props;
            tableBodyHeight = windowHeight - otherHeight;
        } else {
            const tableHeadHeight = this.tableHead?.offsetHeight + 1 || 0;
            const paginationHeight = this.pagination ? this.pagination.offsetHeight : 0;
            const bottomHeight = paginationHeight + 10 + 10;

            const tableOffsetTop = getElementTop(this.wrapper);
            const otherHeight = tableOffsetTop + tableHeadHeight + bottomHeight;

            tableBodyHeight = windowHeight - otherHeight + 4;

            if ('offsetHeight' in this.props) tableBodyHeight = tableBodyHeight - this.props.offsetHeight;
        }

        if (dataSource?.length) {
            this.tableBody.style.height = `${tableBodyHeight}px`;
        } else {
            this.tableBody.style.height = '0px';
            this.tablePlaceholder.style.height = `${tableBodyHeight - 36}px`;
        }

        this.setState({tableBodyHeight});
    };

    render() {
        let {
            scroll = {},
            pagination,
            surplusSpace,
            serialNumber,
            serialText,
            // 分页属性

            pageSize,
            pageNum,

            rowSelection,
            columns,
            ...others
        } = this.props;
        const {tableBodyHeight} = this.state;
        let tableScroll = surplusSpace ? {y: tableBodyHeight, ...scroll} : scroll;

        if (rowSelection === true) rowSelection = {};

        if (!rowSelection) rowSelection = void 0;

        if (serialNumber) {
            if (this.pagination) {
                if (!('pageNum' in this.props)) console.error('分页表格如果显示序号，需要传递pageNum属性');
                if (!('pageSize' in this.props)) console.error('分页表格如果显示序号，需要传递pageSize属性');
            }

            columns = [
                {
                    title: serialText,
                    width: 70,
                    dataIndex: '__num',
                    key: '__num',
                    render: (value, record, index) => {
                        if (this.pagination) {
                            return (index + 1) + pageSize * (pageNum - 1);
                        } else {
                            return index + 1;
                        }
                    },
                },
                ...columns,
            ];
        }

        return (
            <div ref={node => this.wrapper = node}>
                <Table
                    scroll={tableScroll}
                    pagination={false}
                    rowSelection={rowSelection}
                    {...others}
                    columns={columns}
                />
            </div>
        );
    }
}
