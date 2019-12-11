import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Table} from 'antd';
import {Pagination} from '@/library/components';
import {getElementTop} from '@/library/utils';

export default class TableComponent extends Component {
    static propTypes = {
        surplusSpace: PropTypes.bool, // 是否使用剩余空间，如果 true 表格将铺满全屏
        serialNumber: PropTypes.bool, // 是否显示序号
        serialText: PropTypes.string,
        otherHeight: PropTypes.number,
        pagination: PropTypes.bool,
    };

    static defaultProps = {
        surplusSpace: true,
        pagination: true,
        pageSize: 10,
        pageNum: 1,
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
        this.tableBody = this.wrapper.querySelector('.ant-table-body');
        this.tablePlaceholder = this.wrapper.querySelector('.ant-table-placeholder');
        this.tableHead = this.wrapper.querySelector('.ant-table-thead');
        this.pagination = document.querySelector('.pagination-wrap');

        let {tableBodyHeight} = this.state;
        const {dataSource} = this.props;
        const windowHeight = document.documentElement.clientHeight;

        // 计算除了表格内容之外，其他高度
        if ('otherHeight' in this.props) {
            const {otherHeight} = this.props;
            tableBodyHeight = windowHeight - otherHeight;
        } else {
            const tableHeadHeight = this.tableHead.offsetHeight + 1;
            const paginationHeight = this.pagination ? this.pagination.offsetHeight + 8 : 0;
            const bottomHeight = paginationHeight + 10 + 10;

            const tableOffsetTop = getElementTop(this.wrapper);
            const otherHeight = tableOffsetTop + tableHeadHeight + bottomHeight;

            tableBodyHeight = windowHeight - otherHeight;
        }

        if (dataSource?.length) {
            this.tableBody.style.height = `${tableBodyHeight}px`;
        } else {
            this.tableBody.style.height = '0px';
            this.tablePlaceholder.style.height = `${tableBodyHeight}px`;
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

            size,
            showSizeChanger,
            showQuickJumper,
            showMessage,
            pageSize,
            pageNum,
            total,
            onPageNumChange,
            onPageSizeChange,

            rowSelection,
            columns,
            ...others
        } = this.props;
        const {tableBodyHeight} = this.state;
        let tableScroll = surplusSpace ? {y: tableBodyHeight, ...scroll} : scroll;

        if (rowSelection === true) rowSelection = {};

        if (!rowSelection) rowSelection = void 0;

        if (serialNumber) {
            columns = [
                {
                    title: serialText,
                    width: 70,
                    dataIndex: '__num',
                    key: '__num',
                    render: (value, record, index) => (index + 1) + pageSize * (pageNum - 1),
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
                {pagination ? (
                    <Pagination
                        size={size}
                        showSizeChanger={showSizeChanger}
                        showQuickJumper={showQuickJumper}
                        showMessage={showMessage}
                        pageSize={pageSize}
                        pageNum={pageNum}
                        total={total}
                        onPageNumChange={onPageNumChange}
                        onPageSizeChange={onPageSizeChange}
                    />
                ) : null}
            </div>
        );
    }
}
