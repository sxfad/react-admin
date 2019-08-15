import React from 'react';
import PropTypes from 'prop-types';
import {Icon} from 'antd';
import './index.less';

export default class QueryBar extends React.Component {
    static propTypes = {
        showCollapsed: PropTypes.bool,      // 是否显示隐藏 展开/收起 按钮
        collapsed: PropTypes.bool,          // 展开/收起 状态
        onCollapsedChange: PropTypes.func,  // 展开/收起 状态改变
    };

    static defaultProps = {
        showCollapsed: false,
        collapsed: true,
        onCollapsedChange: collapsed => collapsed,
    };

    state = {};

    handleCollapsedChange = (e) => {
        e.preventDefault();
        const {onCollapsedChange, collapsed} = this.props;

        if (onCollapsedChange) {
            onCollapsedChange(!collapsed);
        }
    };

    render() {
        const {
            collapsed,
            showCollapsed,
            className,
            onCollapsedChange,
            ...others
        } = this.props;

        return (
            <div
                className={`${className} sx-query-bar`}
                {...others}>
                {
                    showCollapsed ? (
                        <a className="sx-query-bar-collapsed" onClick={this.handleCollapsedChange}>
                            {collapsed ? '展开' : '收起'}
                            <Icon type={collapsed ? 'down' : 'up'}/>
                        </a>
                    ) : null
                }
                {this.props.children}
            </div>
        );
    }
}
