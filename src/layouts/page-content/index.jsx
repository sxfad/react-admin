import React, {Component} from 'react';
import {Spin} from 'antd';
import PropTypes from 'prop-types';
import Footer from '../footer';
import {connect} from 'src/models';
import './style.less';

/**
 * 页面内容 容器
 * 1. 添加统一padding、background等样式
 * 1. 自动判断是否含有FixBottom，并为之腾出空间
 * 1. 是否含有公共footer
 */
@connect(state => ({
    pageLoading: state.page.loading,
    pageLoadingTip: state.page.loadingTip,
    sideWidth: state.side.width,
}))
export default class PageContent extends Component {
    static propTypes = {
        loading: PropTypes.bool,
        loadingTip: PropTypes.any,
        pageLoading: PropTypes.bool,
        footer: PropTypes.bool,
    };

    static defaultProps = {
        footer: false,
    };

    componentWillUnmount() {
        this.props.action.page.hideLoading();
    }

    render() {
        const {
            footer,
            loading,
            loadingTip,
            pageLoading,
            pageLoadingTip,
            children,
            action,
            className,
            sideWidth,
            ...others
        } = this.props;

        let hasFixBottom = false;
        React.Children.map(children, item => {
            if (item && item.type && item.type.__FIX_BOTTOM) hasFixBottom = true;
        }, null);

        const rootStyle = {};
        if (hasFixBottom) {
            rootStyle.marginBottom = '66px';
        }

        const isLoading = loading || pageLoading;
        const tip = loadingTip || pageLoadingTip;
        const top = this.root?.offsetTop || 0;

        return (
            <div ref={node => this.root = node} style={rootStyle} styleName="page-content-root">
                <div
                    styleName="page-loading"
                    style={{
                        display: isLoading ? 'block' : 'none',
                        left: sideWidth,
                        top,
                    }}
                >
                    <Spin spinning tip={tip}/>
                </div>
                <div
                    className={`${className} page-content`}
                    styleName="page-content"
                    {...others}
                >
                    {children}
                </div>
                {footer ? <div styleName="footer"><Footer/></div> : null}
            </div>
        );
    }
}
