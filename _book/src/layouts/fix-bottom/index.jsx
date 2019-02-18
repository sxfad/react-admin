import React, {Component, cloneElement} from 'react';
import PropTypes from 'prop-types';
import {connect} from "../../models/index";
import './style.less';

/**
 * 固定底部容器
 */
@connect(state => ({
    sideWidth: state.side.width,
    sideCollapsed: state.side.collapsed,
    sideCollapsedWidth: state.side.collapsedWidth,
}))
export default class FixBottom extends Component {
    static __FIX_BOTTOM = true;
    static propTypes = {
        right: PropTypes.bool,  // 内部内容是否居又显示
    };

    static defaultProps = {
        right: true,
    };

    render() {
        let {
            right,
            sideWidth,
            sideCollapsedWidth,
            sideCollapsed,
            style = {},
            styleName,
            children,
            action,
            ...others
        } = this.props;

        sideWidth = sideCollapsed ? sideCollapsedWidth : sideWidth;

        style = {left: sideWidth, textAlign: right ? 'right' : 'left', ...style};
        styleName = styleName ? `${styleName} fix-bottom` : 'fix-bottom';

        return (
            <div
                {...others}
                styleName={styleName}
                style={style}
            >
                {React.Children.map(children, item => {
                    // 如果子元素是antd button ，自动处理间距
                    if (item && item.type.__ANT_BUTTON) {
                        let style = right ? {marginLeft: '8px'} : {marginRight: '8px'};
                        style = {...style, ...item.props.style};

                        return cloneElement(item, {style});
                    }
                    return item;
                })}
            </div>
        );
    }
}
