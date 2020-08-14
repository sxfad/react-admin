import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Spin} from 'antd';
import {Helmet} from 'react-helmet';
import {withRouter} from 'react-router-dom';
import PageHead from '../page-head';
import Header from '../header';
import Side from '../side';
import PageTabs from '../page-tabs';
import {connect} from 'src/models';
import {getLoginUser, getSelectedMenuByPath, setLoginUser} from 'src/commons';
import {PAGE_FRAME_LAYOUT} from 'src/models/settings';
import './style.less';

@withRouter
@connect(state => {
    const {selectedMenu, menus} = state.menu;
    const {title, breadcrumbs, showHead} = state.page;
    const {show: showSide, width, collapsed, collapsedWidth, dragging} = state.side;
    const {loading, loadingTip, isMobile} = state.system;
    const {pageFrameLayout, pageHeadFixed, pageHeadShow, tabsShow} = state.settings;
    return {
        menus,
        selectedMenu,
        showPageHead: showHead,
        title,
        breadcrumbs,

        showSide,
        sideWidth: width,
        sideCollapsed: collapsed,
        sideCollapsedWidth: collapsedWidth,
        globalLoading: loading,
        globalLoadingTip: loadingTip,
        sideDragging: dragging,
        layout: pageFrameLayout,
        pageHeadFixed,
        pageHeadShow, // 设置中统一控制的头部是否显示
        tabsShow,
        isMobile,
    };
})
export default class FrameTopSideMenu extends Component {
    constructor(...props) {
        super(...props);
        const {action: {menu, side, system}, isMobile} = this.props;
        // 从Storage中获取出需要同步到redux的数据
        this.props.action.getStateFromStorage();

        const loginUser = getLoginUser();
        const userId = loginUser?.id;

        // 获取系统菜单 和 随菜单携带过来的权限
        this.state.loading = true;
        menu.getMenus({
            params: {userId},
            onResolve: (res) => {
                const menus = res || [];
                const permissions = [];
                const paths = [];

                menus.forEach(({type, path, code}) => {
                    if (type === '2' && code) permissions.push(code);

                    if (path) paths.push(path);
                });

                if (loginUser) {
                    loginUser.permissions = permissions;
                    setLoginUser(loginUser);
                }

                // 设置当前登录的用户到model中
                system.setLoginUser(loginUser);

                // 保存用户权限到model中
                system.setPermissions(permissions);

                // 保存当前用户可用path到model中
                system.setUserPaths(paths);
            },
            onComplete: () => {
                this.setState({loading: false});
            },
        });

        setTimeout(() => { // 等待getStateFromStorage获取配置之后再设置
            menu.getMenuStatus();
            side.show();
            this.setTitleAndBreadcrumbs();
            isMobile && side.setCollapsed(true);
        });

        this.props.history.listen(() => {
            // 加上timeout之后，tab页切换之后，对应页面就不render了，不知道为什么！
            setTimeout(() => {
                menu.getMenuStatus();
                side.show();
                this.setTitleAndBreadcrumbs();

                isMobile && side.setCollapsed(true);

                // 如果是移动端 隐藏菜单
            });
        });
    }

    static propTypes = {
        layout: PropTypes.string,
    };

    static defaultProps = {
        layout: PAGE_FRAME_LAYOUT.SIDE_MENU,    // top-menu side-menu
        pageHeadFixed: true,        // 页面头部是否固定
    };

    state = {};

    setTitleAndBreadcrumbs() {
        const {
            action: {page},
            pageHeadShow,
            menus,
            title: prevTitle,
            breadcrumbs: prevBreadcrumbs,
        } = this.props;

        const selectedMenu = getSelectedMenuByPath(window.location.pathname, menus);
        let breadcrumbs = [];
        let title = '';
        if (selectedMenu) {
            title = {
                text: selectedMenu.text,
            };
            if (selectedMenu.parentNodes) {
                breadcrumbs = selectedMenu.parentNodes.map(item => {
                    return {
                        key: item.key,
                        icon: item.icon,
                        text: item.text,
                        path: item.path,
                    };
                });
            }

            if (selectedMenu.path !== '/') {
                breadcrumbs.unshift({
                    key: 'index',
                    icon: 'home',
                    text: '首页',
                    path: '/',
                });
            }

            breadcrumbs.push({
                key: selectedMenu.key,
                icon: selectedMenu.icon,
                text: selectedMenu.text,
            });
        }

        // 从菜单中没有获取到，有肯能是当前页面设置了，但是没有菜单对应
        if (!breadcrumbs.length && prevBreadcrumbs && prevBreadcrumbs.length) {
            page.setBreadcrumbs(prevBreadcrumbs);
        } else {
            page.setBreadcrumbs(breadcrumbs);
        }

        // 从菜单中没有获取到，有肯能是当前页面设置了，但是没有菜单对应
        if (!title && prevTitle) {
            page.setTitle(prevTitle);
        } else {
            page.setTitle(title);
        }

        pageHeadShow ? page.showHead() : page.hideHead();
    }

    render() {
        let {
            layout,
            pageHeadFixed,
            showPageHead,
            tabsShow,
            title,
            breadcrumbs,

            showSide,
            sideCollapsed,
            sideCollapsedWidth,
            sideWidth,
            globalLoading,
            globalLoadingTip,
            sideDragging,
            isMobile,
        } = this.props;

        sideWidth = sideCollapsed ? sideCollapsedWidth : sideWidth;
        sideWidth = showSide ? sideWidth : 0;

        let transitionDuration = sideDragging ? '0ms' : `300ms`;

        const isTopSideMenu = layout === PAGE_FRAME_LAYOUT.TOP_SIDE_MENU;
        const isSideMenu = layout === PAGE_FRAME_LAYOUT.SIDE_MENU;
        const hasSide = isTopSideMenu || isSideMenu;

        if (!hasSide) {
            window.document.body.style.paddingLeft = '0px';
        } else {
            window.document.body.style.paddingLeft = `${sideWidth}px`;
        }

        const theme = 'default'; // (isTopSideMenu || isSideMenu) ? 'dark' : 'default';

        if (isMobile) {
            showPageHead = true;
            pageHeadFixed = true;
            tabsShow = false;
        }
        let pageHead = null;
        if (showPageHead) {
            pageHead = (
                <PageHead
                    title={title}
                    breadcrumbs={breadcrumbs}
                />
            );

            if (pageHeadFixed) {
                pageHead = (
                    <div className="frame-page-head-fixed" styleName={`page-head-fixed ${tabsShow ? 'with-tabs' : ''}`} style={{left: hasSide ? sideWidth : 0, transitionDuration}}>
                        {pageHead}
                    </div>
                );
            }
        }

        if (isSideMenu && !isMobile) pageHead = null;

        const titleText = title?.text || title;
        const titleIsString = typeof titleText === 'string';

        const topSpaceClass = ['content-top-space'];

        if (showPageHead && pageHead && pageHeadFixed) topSpaceClass.push('with-fixed-page-head');
        if (tabsShow) topSpaceClass.push('with-tabs');

        const windowWidth = window.innerWidth;
        const sideWidthSpace = hasSide ? sideWidth : 0;

        return (
            <div styleName="base-frame" className="no-print">
                <Helmet title={titleIsString ? titleText : ''}/>
                <Header/>
                <Side layout={layout} theme={theme}/>
                <div styleName={topSpaceClass.join(' ')} className={topSpaceClass.join(' ')}/>
                {pageHead}
                {tabsShow ? <div styleName="page-tabs" id="frame-page-tabs" style={{left: sideWidthSpace, width: windowWidth - sideWidthSpace, transitionDuration}}><PageTabs width={windowWidth - sideWidthSpace}/></div> : null}
                <div styleName="global-loading" style={{display: globalLoading ? 'block' : 'none'}}>
                    <Spin spinning size="large" tip={globalLoadingTip}/>
                </div>
            </div>
        );
    }
}
