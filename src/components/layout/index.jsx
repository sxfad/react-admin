import { useEffect, useState } from 'react';
import { getQuery, isLogin, Layout as RALayout, KeepPageAlive } from '@ra-lib/admin';
import { APP_NAME, CONFIG_HOC, HASH_ROUTER, IS_SUB } from 'src/config';
import { toLogin, getCurrentPageConfig } from 'src/commons';
import { Header } from 'src/components';
import logo from 'src/components/logo/logo.png';

/**
 * 获取layout用到的配置
 */
function getOptions(options) {
    // 根据 config 高阶组件配置信息，进行Layout布局调整
    const currentPageConfig = options || getCurrentPageConfig();
    const { title: queryTitle } = getQuery();
    let {
        auth,
        layout,
        layoutType,
        header: showHeader,
        headerSideToggle: showHeaderSideToggle,
        pageHeader: showPageHeader,
        keepMenuOpen,
        side: showSide,
        sideCollapsed,
        selectedMenuPath,
        title: pageTitle,
        breadcrumb,
        appendBreadcrumb,
        tab: showTab,
        persistTab,
        tabHeight,
        tabSideToggle: showTabSideToggle,
        tabHeaderExtra: showTabHeaderExtra,
        searchMenu: showSearchMenu,
        headerTheme,
        sideTheme,
        sideMaxWidth,
        logoTheme,
    } = { ...CONFIG_HOC, ...currentPageConfig };

    pageTitle = queryTitle || pageTitle;

    if (layout === false) {
        showHeader = false;
        showSide = false;
        showPageHeader = false;
        showTab = false;
    }

    return {
        auth,
        layout,
        layoutType,
        showHeader,
        showHeaderSideToggle,
        showSide,
        showTab,
        showTabSideToggle,
        showTabHeaderExtra,
        showPageHeader,
        showSearchMenu,
        persistTab,
        tabHeight,
        keepMenuOpen,
        sideCollapsed,
        selectedMenuPath,
        pageTitle,
        breadcrumb,
        appendBreadcrumb,
        headerTheme,
        sideTheme,
        sideMaxWidth,
        logoTheme,
    };
}

// 如果其他组件有需求，可以通过layoutRef获取到Layout中一系列方法、数据，
// 注意 layoutRef.current可能不存在
export const layoutRef = { current: null };

export default function Layout(props) {
    const { menus, collectedMenus, onMenuCollect } = props;
    const { auth, ...nextState } = getOptions();

    if (auth && !isLogin()) toLogin();

    const [refresh, setRefresh] = useState({});

    useEffect(() => {
        // Layout有可能不渲染，layoutRef.current 有可能是null
        if (!layoutRef?.current?.setState) return;

        // 过滤掉函数，函数由layoutHoc处理
        const state = Object.entries(nextState).reduce((prev, curr) => {
            const [key, value] = curr;
            if (typeof value !== 'function') prev[key] = value;

            return prev;
        }, {});

        layoutRef.current.setState(state);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        // eslint-disable-next-line react-hooks/exhaustive-deps
        ...Object.values(nextState),
        refresh,
    ]);

    // 未使用 Layout 中任何功能，直接不渲染Layout
    let withoutLayout = [nextState.showHeader, nextState.showSide, nextState.showTab, nextState.showPageHeader].every(
        (item) => !item,
    );

    if (IS_SUB) withoutLayout = true;

    if (window.location.pathname !== '/layout/setting' && withoutLayout) {
        if (CONFIG_HOC.keepAlive) return <KeepPageAlive hashRouter={HASH_ROUTER} {...props} />;

        return null;
    }

    return (
        <RALayout
            className="no-print"
            ref={(current) => (layoutRef.current = { ...current, refresh: () => setRefresh({}) })}
            logo={logo}
            title={APP_NAME}
            menus={menus}
            collectedMenus={collectedMenus}
            onMenuCollect={onMenuCollect}
            headerExtra={<Header />}
            keepPageAlive={CONFIG_HOC.keepAlive}
            hashRouter={HASH_ROUTER}
            {...nextState}
            {...props}
        />
    );
}

// 处理函数配置
export function layoutHoc() {
    return (WrappedComponent) => {
        const componentName = WrappedComponent.displayName || WrappedComponent.name || 'Component';

        const WithLayout = (props) => {
            let nextState = getOptions();

            nextState = Object.entries(nextState).reduce((prev, curr) => {
                const [key, value] = curr;
                if (typeof value === 'function') prev[key] = value(props);
                return prev;
            }, {});

            if (Object.keys(nextState).length && props.active !== false) {
                // Warning: Cannot update a component (`ForwardRef`) while rendering a different component (`withLayout(Connect(WithAjax(WithConfig(UserEdit))))`).
                setTimeout(() => {
                    layoutRef?.current?.setState(nextState);
                });
            }

            return <WrappedComponent {...props} />;
        };

        WithLayout.displayName = `WithLayout(${componentName})`;

        return WithLayout;
    };
}
