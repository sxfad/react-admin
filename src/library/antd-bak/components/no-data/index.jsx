import React from 'react';

/**
 * 暂无数据的封装
 */
export default function NoData(props) {
    return (
        <div className="ant-table-placeholder" style={{border: 'none'}} {...props}>
            <span>
                <i className="anticon anticon-frown-o"/>
                暂无数据
            </span>
        </div>
    );
}
