import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Table} from 'antd';

export default class TableComponent extends Component {
    static propTypes = {
        otherHeight: PropTypes.number,
    };

    state = {
        tableBodyHeight: 300,
    };

    componentDidMount() {
        this.tableBody = this.wrapper.querySelector('.ant-table-body');
        this.tablePlaceholder = this.wrapper.querySelector('.ant-table-placeholder');
        this.header = document.getElementById('header');
        this.tableHead = this.wrapper.querySelector('.ant-table-thead');
        this.pagination = document.querySelector('.pagination-wrap');

        window.addEventListener('resize', this.setTableBodyHeight);

        this.setTableBodyHeight();
    };

    componentDidUpdate(prevProps) {
        const prevDataSource = prevProps.dataSource;
        const {dataSource} = this.props;

        if (dataSource?.length !== prevDataSource?.length) {
            this.setTableBodyHeight();
        }
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.setTableBodyHeight);
    }

    setTableBodyHeight = () => {
        let {tableBodyHeight} = this.state;
        const {dataSource} = this.props;
        const windowHeight = document.documentElement.clientHeight;

        // 计算除了表格内容之外，其他高度
        if ('otherHeight' in this.props) {
            const {otherHeight} = this.props;
            tableBodyHeight = windowHeight - otherHeight;
        } else {
            const headerHeight = this.header.offsetHeight;
            const wrapperTop = this.wrapper.offsetTop;
            const tableHeadHeight = this.tableHead.offsetHeight + 1;
            const paginationHeight = this.pagination ? this.pagination.offsetHeight + 8 : 0;
            const bottomHeight = paginationHeight + 10 + 10;
            const otherHeight = headerHeight + wrapperTop + tableHeadHeight + bottomHeight;

            tableBodyHeight = windowHeight - otherHeight;
        }

        if (dataSource?.length) {
            this.tableBody.style.height = `${tableBodyHeight}px`;
        } else {
            this.tablePlaceholder.style.height = `${tableBodyHeight}px`;
        }

        this.setState({tableBodyHeight});
    };

    render() {
        const {scroll = {}, ...others} = this.props;
        const {tableBodyHeight} = this.state;
        let tableScroll = {y: tableBodyHeight, ...scroll};

        return (
            <div ref={node => this.wrapper = node}>
                <Table scroll={tableScroll} {...others}/>
            </div>
        );
    }
}
