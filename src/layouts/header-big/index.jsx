import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Icon} from 'antd';
import Link from '../page-link';
import Logo from '../logo';
import HeaderUser from '../header-user';
import HeaderMenu from '../header-menu';
import HeaderI18n from '../header-i18n';
import HeaderFullScreen from '../header-full-screen';
import ThemeColorPicker from '../header-color-picker';
import {connect} from '../../models/index';
import {PAGE_FRAME_LAYOUT} from '@/models/settings';
import Breadcrumb from '../breadcrumb';
import './style.less';

@connect(state => {
    const {menus, topMenu} = state.menu;
    const {show: showSide, width, collapsed, collapsedWidth, dragging} = state.side;
    const {local, i18n} = state.system;
    const {breadcrumbs} = state.page;
    const {pageFrameLayout} = state.settings;

    return {
        menus,
        topMenu,

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
    static propTypes = {
        layout: PropTypes.string,
        theme: PropTypes.string,
    };

    static defaultProps = {
        layout: PAGE_FRAME_LAYOUT.SIDE_MENU,    // top-side-menu top-menu side-menu
        theme: 'default',                       // default dark
    };

    handleToggle = () => {
        const {sideCollapsed} = this.props;
        this.props.action.side.setCollapsed(!sideCollapsed);
    };

    render() {
        let {
            layout,
            menus,          // 所有的菜单数据
            topMenu,        // 当前页面选中菜单的顶级菜单
            sideCollapsed,
            sideCollapsedWidth,
            sideWidth,
            sideDragging,
            i18n,
            breadcrumbs,
            children,
        } = this.props;

        sideWidth = sideCollapsed ? sideCollapsedWidth : sideWidth;

        const isTopSideMenu = layout === PAGE_FRAME_LAYOUT.TOP_SIDE_MENU;
        const isTopMenu = layout === PAGE_FRAME_LAYOUT.TOP_MENU;
        const isSideMenu = layout === PAGE_FRAME_LAYOUT.SIDE_MENU;
        const showToggle = isTopSideMenu || isSideMenu;
        const showMenu = isTopSideMenu || isTopMenu;

        let topMenus = menus;
        if (isTopSideMenu) {
            topMenus = menus && menus.map(item => ({key: item.key, text: item.text, path: item.path, icon: item.icon}));
        }
        if (isTopMenu) {
            topMenus = menus;
        }

        let transitionDuration = sideDragging ? '0ms' : '300ms';

        const theme = this.props.theme || ((isTopSideMenu || isSideMenu) ? 'default' : 'dark');

        return (
            <div styleName="header" data-theme={theme}>
                <div styleName="logo" style={{flex: `0 0 ${sideWidth}px`, transitionDuration}}>
                    <Link to="/">
                        <Logo
                            min={sideCollapsed}
                            title={i18n?.application?.name}
                        />
                    </Link>
                </div>
                {
                    showToggle ? (
                        <Icon
                            className="header-trigger"
                            styleName="trigger"
                            type={sideCollapsed ? 'menu-unfold' : 'menu-fold'}
                            onClick={this.handleToggle}
                            style={theme === 'dark' ? {color: '#fff', backgroundColor: '#222'} : null}
                        />
                    ) : null
                }
                {children ? (
                    <div styleName="center">{children}</div>
                ) : (
                    <div styleName="center">
                        {showMenu ? (
                            <HeaderMenu
                                theme={theme}
                                dataSource={topMenus}
                                selectedKeys={[topMenu && topMenu.key]}
                            />
                        ) : null}
                        {isSideMenu ? <div style={{marginLeft: 16}}><Breadcrumb theme={theme} dataSource={breadcrumbs}/></div> : null}
                    </div>
                )}

                <div styleName="right">
                    <HeaderFullScreen styleName="action" className="header-action"/>
                    <ThemeColorPicker styleName="action" className="header-action"/>
                    <HeaderI18n styleName="action" className="header-action" theme={theme}/>
                    <HeaderUser styleName="action" className="header-action" theme={theme}/>
                </div>
            </div>
        );
    }
}
