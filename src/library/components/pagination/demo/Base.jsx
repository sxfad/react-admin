import React, {Component} from 'react';
import {Pagination} from '../../../index';

export default class Base extends Component {
    state = {
        total: 108,
    };

    handlePageSizeChange = (pageSize) => {
        this.setState({pageSize});
    };

    handlePageNumChange = (pageNum) => {
        this.setState({pageNum});
    };

    render() {
        const {total, pageNum, pageSize} = this.state;
        return (
            <div>
                <Pagination
                    total={total}
                    pageNum={pageNum}
                    pageSize={pageSize}
                    onPageSizeChange={this.handlePageSizeChange}
                    onPageNumChange={this.handlePageNumChange}
                />
            </div>
        );
    }
}

export const title = '基础用法';

export const markdown = `
基本用法
`;
