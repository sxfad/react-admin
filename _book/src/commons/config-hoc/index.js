import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {compose} from '@/commons'
import queryHoc from '@/commons/query-hoc';
import {connect as reduxConnect} from '@/models';
import {ajaxHoc} from '@/commons/ajax';
import pubSubHoc from '@/library/utils/pub-sub-hoc'
import eventHoc from '@/library/utils/dom-event-hoc';
import PubSub from 'pubsub-js'
import {ROUTE_BASE_NAME} from '@/router/AppRouter';

/**
 * 页面配置高阶组件，整合了多个高阶组件
 * @param options
 * @returns {function(*): WithConfig}
 */
export default (options) => {
    return WrappedComponent => {
        const {
            // path = void 0,       // 页面路由地址，如果存在path配置，会通过脚本抓取，当前组件将会作为路由页面，path将作为路由地址
            // noFrame = false,     // 标记当前页面为不需要导航框架的页面，比如登录页，通过脚本抓取实现
            // noAuth = false,      // 标记当前页面为不需要登录即可访问的页面，通过脚本抓取实现
            // keepAlive,           // 页面内容保持
            title = true,           // true：当前页面显示通过菜单结构自动生成的title；false：当前页面不显示title；string：自定义title，并不参与国际化；object：{local, text}，text对应国际化menu中的配置，label为国际化失败之后的默认显示；function(props): 返回值作为title
            breadcrumbs = true,     // true：当前页面显示通过菜单结构自动生成的面包屑；false：当前页面不显示面包屑；object：[{local, text, ...}]，local对应国际化menu中的配置，text为国际化失败之后的默认显示；function(props): 返回值作为面包屑
            appendBreadcrumbs = [], // 在当前面包屑基础上添加；function(props): 返回值作为面包屑
            pageHead,               // 页面头部是否显示
            side,                   // 页面左侧是否显示
            sideCollapsed,          // 左侧是否收起
            router = false,         // 是否添加withRouter装饰器，如果设置了path，将自动使用了withRouter，组件内部可以使用history等API
            query = false,          // 是否添加地址查询字符串转换高阶组件，内部可以通过this.props.query访问查询字符串
            ajax = false,           // 是否添加ajax高阶组件，内部可以通过this.props.ajax使用ajax API
            connect = false,        // 是否与redux进行连接，true：只注入了this.props.action相关方法；false：不与redux进行连接；(state) => ({title: state.page.title})：将函数返回的数据注入this.props
            event = false,          // 是否添加event高阶组件，可以使用this.props.addEventListener添加dom事件，并在组件卸载时会自动清理；通过this.props.removeEventListener移出dom事件
            pubSub = false,         // 是否添加发布订阅高阶组件，可以使用this.props.subscribe(topic, (msg, data) => {...})订阅事件，并在组件卸载时，会自动取消订阅; 通过this.props.publish(topic, data)发布事件
        } = options;

        const hocFuncs = [];

        if (event) hocFuncs.push(eventHoc());

        if (pubSub) hocFuncs.push(pubSubHoc());

        if (query === true) hocFuncs.push(queryHoc());

        if (router === true) hocFuncs.push(withRouter);

        if (ajax === true) hocFuncs.push(ajaxHoc());

        hocFuncs.push(reduxConnect());

        if (connect === true) hocFuncs.push(reduxConnect());

        if (typeof connect === 'function') hocFuncs.push(reduxConnect(connect));

        const hocs = compose(hocFuncs);

        const componentName = WrappedComponent.displayName || WrappedComponent.name || 'Component';

        @hocs
        class WithConfig extends Component {
            constructor(...args) {
                super(...args);
                this.initFrame();

                const {pathname, search} = window.location;
                let currentPath = window.decodeURIComponent(`${pathname}${search}`);
                currentPath = currentPath.replace(ROUTE_BASE_NAME, '');

                this.tabShowToken = PubSub.subscribe('tab-show', (msg, targetPath) => {
                    targetPath = window.decodeURIComponent(targetPath);

                    if (currentPath === targetPath) {
                        // 框架级的数据可能被改了，重新显示之后，根据当前页面的设置，再改回来
                        this.initFrame();

                        this.onShow && this.onShow();
                    }
                });

                this.tabHideToken = PubSub.subscribe('tab-hide', (msg, targetPath) => {
                    targetPath = window.decodeURIComponent(targetPath);

                    if (currentPath === targetPath && this.onHide) {
                        this.onHide();
                    }
                });
            }

            componentWillUnmount() {
                PubSub.unsubscribe(this.tabShowToken);
                PubSub.unsubscribe(this.tabHideToken);
            }

            // 设置框架级的一些数据
            initFrame = () => {
                const {page, side: sideAction, system} = this.props.action;

                // 页面标题设置
                if (title === false) {
                    page.setTitle('');
                }

                if (title && title !== true) {
                    let nextTitle = title;

                    if (typeof title === 'function') {
                        nextTitle = title(this.props);
                    }

                    page.setTitle(nextTitle);

                    // 刷新时候，由于设置顺序问题，需要timeout
                    setTimeout(() => system.setCurrentTabTitle(nextTitle));
                }

                // 页面面包屑导航
                if (breadcrumbs === false) {
                    page.setBreadcrumbs([]);
                }

                if (breadcrumbs && breadcrumbs !== true) {
                    let nextBreadcrumbs = breadcrumbs;

                    if (typeof breadcrumbs === 'function') {
                        nextBreadcrumbs = breadcrumbs(this.props);
                    }

                    page.setBreadcrumbs(nextBreadcrumbs);
                }

                if (Array.isArray(appendBreadcrumbs) && appendBreadcrumbs.length) {
                    page.appendBreadcrumbs(appendBreadcrumbs);
                }

                if (typeof appendBreadcrumbs === 'function') {
                    const nextAppendBreadcrumbs = appendBreadcrumbs(this.props);

                    page.appendBreadcrumbs(nextAppendBreadcrumbs);
                }

                // 页面头部是否显示
                if (pageHead !== undefined) pageHead ? page.showHead() : page.hideHead();

                // 页面左侧是否显示
                if (side !== undefined) side ? sideAction.show() : sideAction.hide();

                // 页面左侧是否收起
                if (sideCollapsed !== undefined) sideAction.setCollapsed(sideCollapsed);
            };

            static displayName = `WithConfig(${componentName})`;

            render() {
                return (
                    <WrappedComponent
                        onComponentWillShow={func => this.onShow = func}
                        onComponentWillHide={func => this.onHide = func}
                        {...this.props}
                    />
                );
            }
        }

        return WithConfig;
    };
}
