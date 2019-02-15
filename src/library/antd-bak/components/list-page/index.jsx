import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Table from 'antd/lib/table';
import 'antd/lib/table/style/css';
import QueryBar from '../query-bar';
import QueryItem from '../query-item';
import ToolBar from '../tool-bar';
import PaginationComponent from '../pagination';

/**
 * 列表页的封装，通过传入相应的配置，生成列表页
 */
export default class extends Component {

    static propTypes = {
        queryItems: PropTypes.array,
        queryExtra: PropTypes.any,
        toolItems: PropTypes.array,
        searchOnMount: PropTypes.bool,
        showSearchButton: PropTypes.bool,
        showResetButton: PropTypes.bool,
        showPagination: PropTypes.bool,
        showSequenceNumber: PropTypes.bool,
        showCollapsed: PropTypes.bool,
        tableProps: PropTypes.object.isRequired,
        formRef: PropTypes.func, // 获取查询条件表单对象
        onSearch: PropTypes.func, // 触发查询

        total: PropTypes.number,
        pageNum: PropTypes.number,
        onPageNumChange: PropTypes.func,
        pageSize: PropTypes.number,
        onPageSizeChange: PropTypes.func,
    };

    static defaultProps = {
        toolItems: [],
        queryItems: [],
        searchOnMount: true,
        showSearchButton: true,
        showResetButton: true,
        showPagination: true,
        showSequenceNumber: true,
        showCollapsed: false,
        queryExtra: null,
        total: 0,
    };

    state = {
        query: {},
        collapsed: false,
        pageSize: 10,
        pageNum: 1,
    };

    componentDidMount() {
        const {searchOnMount} = this.props;
        if (searchOnMount) {
            this.search();
        }
    }

    search = (p = {}) => {
        const {onSearch, showPagination} = this.props;
        const {query} = this.state;
        let params = {};
        if (showPagination) {
            const pageNum = this.props.pageNum || this.state.pageNum;
            const pageSize = this.props.pageSize || this.state.pageSize;
            params = {
                ...query,
                pageNum,
                pageSize,
                ...p,

            };
        } else {
            params = {
                ...query,
                ...p,
            };
        }
        onSearch && onSearch(params);
    };

    handleQuery = (params) => {
        if (this.queryForm) {
            this.queryForm.validateFieldsAndScroll((err, values) => {
                if (!err) {
                    this.setState({query: values}, () => this.search(params));
                }
            });
        } else {
            this.search(params);
        }
    };

    handleQueryItemSubmit = () => {
        const {pageNum, onPageNumChange} = this.props;
        if (pageNum && onPageNumChange) {
            setTimeout(() => this.handleQuery({pageNum: 1}));
        } else {
            this.setState({pageNum: 1}, this.handleQuery)
        }
    };

    handlePageNumChange = (pn) => {
        const {pageNum, onPageNumChange} = this.props;
        if (pageNum && onPageNumChange) {
            onPageNumChange(pn);
            // setTimeout(this.handleQuery); // 如果编写了 pageNum, onPageNumChange 需要自己触发请求
        } else {
            this.setState({pageNum: pn}, this.handleQuery);
        }
    };

    handlePageSizeChange = ps => {
        const {pageSize, onPageSizeChange, pageNum, onPageNumChange} = this.props;
        if (pageSize && onPageSizeChange) {
            onPageSizeChange(ps);

            // 返回第一页
            if (pageNum && onPageNumChange) {
                onPageNumChange(1);
            } else {
                this.setState({pageNum: 1});
                setTimeout(this.handleQuery);
            }
        } else {
            this.setState({pageSize: ps, pageNum: 1}, this.handleQuery);
        }
    };

    render() {
        let {
            toolItems,
            queryItems,
            showSearchButton,
            showResetButton,
            showSequenceNumber,
            showCollapsed,
            formRef,
            total,
            showPagination,
            queryExtra,
        } = this.props;
        const {collapsed} = this.state;

        let pageNum = this.props.pageNum || this.state.pageNum;
        let pageSize = this.props.pageSize || this.state.pageSize;

        pageNum = pageNum <= 0 ? 1 : pageNum;

        // 解决如果各个组件都不传递tableProps，组件将都使用默认tableProps，而且是同一个tableProps，会产生互相干扰
        let tableProps = {...this.props.tableProps};

        const {
            rowKey,
            columns = [],
        } = tableProps;

        // 默认 id 作为rowKey
        if (!rowKey) tableProps.rowKey = record => record.id;

        // columns key可以缺省，默认与dataIndex，如果有相同dataIndex列，需要指定key；
        const tableColumns = columns.map(item => {
            return item.key ? {...item} : {key: item.dataIndex, ...item};
        });

        // 是否显示序号列
        showSequenceNumber && tableColumns.unshift({
            title: '序号',
            key: '__num__',
            width: 80,
            render: (text, record, index) => (index + 1) + ((pageNum - 1) * pageSize),
        });

        tableProps.columns = tableColumns;

        return (
            <div>
                {
                    queryItems && queryItems.length ?
                        <QueryBar
                            showCollapsed={showCollapsed}
                            collapsed={collapsed}
                            onCollapsedChange={co => this.setState({collapsed: co})}
                        >
                            <QueryItem
                                formRef={(form) => {
                                    this.queryForm = form;
                                    formRef && formRef(form);
                                }}
                                collapsed={collapsed}
                                items={queryItems}
                                showSearchButton={showSearchButton}
                                showResetButton={showResetButton}
                                onSubmit={this.handleQueryItemSubmit}
                                extra={queryExtra}
                            />
                        </QueryBar>
                        : null
                }
                {
                    toolItems && toolItems.length ?
                        <ToolBar items={toolItems}/>
                        : null
                }
                <Table
                    size="large"
                    pagination={false}
                    {...tableProps}
                />
                {
                    showPagination ?
                        <PaginationComponent
                            pageSize={pageSize}
                            pageNum={pageNum}
                            total={total}
                            onPageNumChange={this.handlePageNumChange}
                            onPageSizeChange={this.handlePageSizeChange}
                        />
                        : null
                }
            </div>
        );
    }
}
