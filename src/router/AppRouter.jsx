import React, {Component} from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {isLogin} from 'src/commons';
import Error404 from 'src/components/error/Error404';
import config from 'src/commons/config-hoc';
import AuthRoute from './AuthRoute';
import routes, {noFrameRoutes, noAuthRoutes /*commonPaths*/} from './routes';
import LayoutFrame from 'src/layouts';
import cfg from 'src/config';

const {baseName} = cfg;

@config({
    query: true,
    connect: state => ({
        systemNoFrame: state.layout.systemNoFrame,
        userPaths: state.layout.userPaths,
    }),
})
export default class AppRouter extends Component {

    /**
     * allRoutes为全部路由配置，根据用户可用 菜单 和 功能 的path，对allRoutes进行过滤，可以解决越权访问页面的问题
     * commonPaths 为所有人都可以访问的路径 在.routes中定义
     * @returns {{path: *, component: *}[]}
     */
    getUserRoutes = () => {
        // const {userPaths} = this.props;
        // const allPaths = [...userPaths, ...commonPaths];
        // return routes.filter(item => allPaths.includes(item.path));
        return routes;
    };

    render() {
        const {noFrame: queryNoFrame, noAuth} = this.props.query;
        const {systemNoFrame} = this.props;
        const userRoutes = this.getUserRoutes();
        const style = {display: 'flex', flexDirection: 'column', flex: 1, position: 'relative', minHeight: '100vh'};

        return (
            <BrowserRouter basename={baseName}>
                <div style={style}>
                    <Route path="/" render={props => {
                        // 框架组件单独渲染，与其他页面成为兄弟节点，框架组件和具体页面组件渲染互不影响

                        // 系统级别配置，不渲染框架
                        if (systemNoFrame) return null;

                        // 通过配置，筛选那些页面不渲染框架
                        if (noFrameRoutes.includes(props.location.pathname)) return null;

                        // 框架内容属于登录之后内容，如果未登录，不渲染框架
                        if (!isLogin()) return null;

                        // 如果浏览器url中携带了noFrame=true参数，不渲染框架
                        if (queryNoFrame === 'true') return null;

                        // 如果是乾坤字项目，不渲染框架
                        if (window.__POWERED_BY_QIANKUN__) return null;

                        return <LayoutFrame {...props}/>;
                    }}/>
                    <Switch>
                        {userRoutes.map(item => {
                            const {path, component} = item;
                            let isNoAuthRoute = false;

                            // 不需要登录的页面
                            if (noAuthRoutes.includes(path)) isNoAuthRoute = true;

                            // 如果浏览器url中携带了noAuthor=true参数，不需要登录即可访问
                            if (noAuth === 'true') isNoAuthRoute = true;

                            return (
                                <AuthRoute
                                    key={path}
                                    exact
                                    path={path}
                                    noAuth={isNoAuthRoute}
                                    component={component}
                                />
                            );
                        })}
                        <Route component={Error404}/>
                    </Switch>
                </div>
            </BrowserRouter>
        );
    }
}
