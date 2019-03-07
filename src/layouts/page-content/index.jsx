import React, {Component} from 'react';
import {Spin} from 'antd';
import PropTypes from 'prop-types';
import './style.less';
import Footer from '../footer';
import {connect} from '../../models/index';

/**
 * 页面内容 容器
 * 1. 添加统一padding、background等样式
 * 1. 自动判断是否含有FixBottom，并为之腾出空间
 * 1. 是否含有公共footer
 */
@connect(state => ({pageLoading: state.page.loading, smallFrame: state.system.smallFrame}))
export default class PageContent extends Component {
    static propTypes = {
        loading: PropTypes.bool,
        pageLoading: PropTypes.bool,
        footer: PropTypes.bool,
    };

    static defaultProps = {
        footer: true,
    };

    componentWillUnmount() {
        this.props.action.page.hideLoading();
    }

    render() {
        const {
            footer,
            loading,
            pageLoading,
            children,
            action,
            className,
            smallFrame,
            ...others
        } = this.props;

        let hasFixBottom = false;
        React.Children.map(children, item => {
            if (item && item.type && item.type.__FIX_BOTTOM) hasFixBottom = true;
        });

        const rootStyle = {};
        if (hasFixBottom) {
            rootStyle.marginBottom = '66px';
        }

        const contentStyle = {};
        if (smallFrame) {
            contentStyle.margin = '8px';
            contentStyle.padding = '8px';
        }

        return (
            <div style={rootStyle} styleName="page-content-root">
                <div styleName="page-loading" style={{display: loading || pageLoading ? 'block' : 'none'}}>
                    <Spin spinning size="large"/>
                </div>
                <div style={contentStyle} styleName="page-content" className={className} {...others} >{children}</div>
                {footer ? <div styleName="footer"><Footer/></div> : null}
            </div>
        );
    }
}
