import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Icon} from 'antd';
import Logo from '../logo';
import {connect} from '../../models/index';
import {PAGE_FRAME_LAYOUT} from '@/models/settings';
import Side from '@/layouts/side';
import './style.less';

@connect(state => {
    const {menus, topMenu, selectedMenu} = state.menu;
    const {show: showSide, width, collapsed, collapsedWidth, dragging} = state.side;
    const {local, i18n} = state.system;
    const {breadcrumbs} = state.page;
    const {pageFrameLayout} = state.settings;

    return {
        menus,
        topMenu,
        selectedMenu,

        showSide,
        sideWidth: width,
        sideCollapsed: collapsed,
        sideCollapsedWidth: collapsedWidth,
        sideDragging: dragging,
        local,
        i18n,
        breadcrumbs,

        layout: pageFrameLayout,
    };
})
export default class Header extends Component {
    constructor(...props) {
        super(...props);
        this.props.action.side.setCollapsed(false);
    }

    static propTypes = {
        layout: PropTypes.string,
        theme: PropTypes.string,
    };

    static defaultProps = {
        layout: PAGE_FRAME_LAYOUT.SIDE_MENU,    // top-side-menu top-menu side-menu
        theme: 'dark',                       // default dark
    };

    state = {
        menuVisible: false,
        settingVisible: false,
    };


    static getDerivedStateFromProps(nextProps, nextState) {
        const {selectedMenu = {}} = nextProps;
        const nextKey = selectedMenu?.key;
        const stateSelectedMenuKey = nextState?.selectedMenu?.key;
        if (nextKey !== stateSelectedMenuKey) {
            return {selectedMenu, menuVisible: false, settingVisible: false};
        }
        return null;
    }

    handleMenuToggle = () => {
        const {menuVisible} = this.state;
        this.setState({menuVisible: !menuVisible});
    };

    handleSettingToggle = () => {
        const {settingVisible} = this.state;
        this.setState({settingVisible: !settingVisible});
    };

    render() {
        let {
            layout,
            children,
        } = this.props;
        const {menuVisible, settingVisible} = this.state;

        const isTopSideMenu = layout === PAGE_FRAME_LAYOUT.TOP_SIDE_MENU;
        const isSideMenu = layout === PAGE_FRAME_LAYOUT.SIDE_MENU;


        const theme = this.props.theme || ((isTopSideMenu || isSideMenu) ? 'default' : 'dark');

        return (
            <div styleName="header" data-theme={theme}>
                <Icon
                    className="header-trigger"
                    styleName="trigger"
                    type={menuVisible ? 'menu-fold' : 'menu-unfold'}
                    onClick={this.handleMenuToggle}
                    style={theme === 'dark' ? {color: '#fff', backgroundColor: '#222'} : null}
                />
                <div styleName="center">{children ? children : <Logo style={{color: theme === 'dark' ? '#fff' : '#000'}}/>}</div>

                <div styleName="right">
                    <Icon type="setting" styleName="setting" onClick={this.handleSettingToggle}/>
                </div>

                <div
                    styleName="left-drawer"
                    style={{
                        transform: menuVisible ? 'translateX(0%)' : 'translateX(-100%)',
                    }}
                >
                    <Side style={{top: 0}} theme={theme}/>
                    <div
                        style={{background: menuVisible ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0)',}}
                        styleName="left-blank"
                        onClick={this.handleMenuToggle}
                    />
                </div>
                <div
                    styleName="right-drawer"
                    style={{
                        transform: settingVisible ? 'translateX(0%)' : 'translateX(100%)',
                    }}
                >
                    <div
                        style={{background: settingVisible ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0)',}}
                        styleName="right-blank"
                        onClick={this.handleSettingToggle}
                    />

                    <div styleName="right-drawer-content">
                        设置内容
                    </div>
                </div>
            </div>
        );
    }
}
