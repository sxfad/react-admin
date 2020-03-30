import React from 'react';
import PropTypes from 'prop-types';
import {DownCircleOutlined, UpCircleOutlined} from '@ant-design/icons';
import classNames from 'classnames';
import './index.less';

export default class QueryBar extends React.Component {
    static propTypes = {
        collapsed: PropTypes.bool,          // 展开/收起 状态
        onCollapsedChange: PropTypes.func,  // 展开/收起 状态改变
    };

    static defaultProps = {
        onCollapsedChange: collapsed => collapsed,
    };

    state = {
        showCollapsed: false,
    };

    static getDerivedStateFromProps(nextProps) {
        const showCollapsed = 'collapsed' in nextProps;

        return {showCollapsed};
    }

    handleCollapsedChange = (e) => {
        e.preventDefault();
        const {onCollapsedChange, collapsed} = this.props;

        if (onCollapsedChange) {
            onCollapsedChange(!collapsed);
        }

        // 页面内容有改动，页面中有可能有撑满全屏的元素，需要调整
        // 切换时，滚动条会有闪动，需要调整body的overflow
        const oldOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
            document.body.style.overflow = oldOverflow;
        });
    };

    render() {
        const {
            collapsed,
            className,
            onCollapsedChange,
            ...others
        } = this.props;
        const {showCollapsed} = this.state;

        return (
            <div
                className={classNames(className, 'sx-query-bar', {'with-collapse': showCollapsed})}
                {...others}
            >
                {
                    showCollapsed ? (
                        <a className="sx-query-bar-collapsed" onClick={this.handleCollapsedChange}>
                            {collapsed ? <DownCircleOutlined/> : <UpCircleOutlined/>}
                        </a>
                    ) : null
                }
                {this.props.children}
            </div>
        );
    }
}
