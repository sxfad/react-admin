import { withRouter } from 'react-router-dom';
import { createConfigHoc, modal as modalHoc, drawer as drawerHoc, getQuery, getLoginUser } from '@ra-lib/admin';
import { ajaxHoc } from 'src/commons/ajax';
import { connect as reduxConnect } from 'src/models';
import { CONFIG_HOC, IS_MOBILE } from 'src/config';
import { layoutHoc } from 'src/components/layout';
import React from 'react';

// 公共高阶组件，注入一些常用数据，比如 query loginUser等
function commonHoc(options) {
    const { query, loginUser } = options;
    return (WrappedComponent) => {
        const componentName = WrappedComponent.displayName || WrappedComponent.name || 'Component';

        const WithLayout = (props) => {
            // 默认添加属性到props中的属性
            const extendProps = {};
            if (query !== false) extendProps.query = getQuery();
            if (loginUser !== false) extendProps.loginUser = getLoginUser();

            return <WrappedComponent {...extendProps} {...props} />;
        };

        WithLayout.displayName = `WithCommon(${componentName})`;

        return WithLayout;
    };
}

export default function configHoc(options = {}) {
    // config 所有可用参数，以及默认值
    const {
        // 路由地址
        path,
        // 是否需要登录
        auth,
        // 是否显示顶部
        header,
        // 是否显示标签
        tab,
        // 是否显示页面头部
        pageHeader,
        // 是否显示侧边栏
        side,
        // 侧边栏是否收起
        sideCollapsed,
        // 设置选中菜单，默认基于 window.location选中 用于设置非菜单的子页面，菜单选中状态
        selectedMenuPath,
        // 设置页面、tab标题，默认基于选中菜单，也可以通过query string 设置 /xxx?title=页面标题
        title,
        // 自定义面包屑导航，默认基于选中菜单，false：不显示，[{icon, title, path}, ...]
        breadcrumb,
        // 基于菜单，追加面包屑导航
        appendBreadcrumb,
        // 页面保持，不销毁，需要设置config.KEEP_PAGE_ALIVE === true 才生效
        keepAlive,
        // 是否添加withRouter高级组件
        router = true,
        // props是否注入ajax
        ajax = CONFIG_HOC.ajax,
        // 连接models，扩展 props.action
        connect = CONFIG_HOC.connect,
        // 弹框高阶组件
        modal,
        // 抽屉高级组件
        drawer,
        ...others
    } = options;

    // config 传递 参数校验
    if (modal && drawer) throw Error('[config hoc] modal and drawer config can not be used together!');

    const hoc = [];

    // 公共高阶组件
    hoc.push(commonHoc(options));

    // 弹框高阶组件
    if (modal) hoc.push(modalHoc(modal, IS_MOBILE));

    // 抽屉高阶组件
    if (drawer) hoc.push(drawerHoc(drawer));

    // redux 连接高阶组件
    if (connect === true) hoc.push(reduxConnect());
    if (typeof connect === 'function') hoc.push(reduxConnect(connect));

    // ajax高阶组件
    if (ajax) hoc.push(ajaxHoc());

    // 路由高阶组件
    if (router) hoc.push(withRouter);

    // 放到最后，一些函数式配置，可以获取到更多的props数据
    hoc.push(layoutHoc(options));

    return createConfigHoc({
        hoc,
        onConstructor: () => void 0,
        onDidMount: () => void 0,
        onUnmount: () => void 0,
    })({ ...options, ...others });
}
