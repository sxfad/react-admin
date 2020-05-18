import React, {Component} from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {isLogin} from 'src/commons';
import PageFrame from 'src/layouts/frame';
import Error404 from 'src/components/error/Error404';
import config from 'src/commons/config-hoc';
import KeepAuthRoute from './KeepAuthRoute';
import KeepPage from './KeepPage';
import routes, {noFrameRoutes, noAuthRoutes /*commonPaths*/} from './routes';

// 直接挂载到域名根目录
export const ROUTE_BASE_NAME = process.env.BASE_NAME || '';

@config({
    query: true,
    connect: state => ({userPaths: state.system.userPaths, systemNoFrame: state.system.noFrame}),
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

        return (
            <BrowserRouter basename={ROUTE_BASE_NAME}>
                <div style={{display: 'flex', flexDirection: 'column', position: 'relative', minHeight: '100vh'}}>
                    <Route path="/" render={props => {
                        // 框架组件单独渲染，与其他页面成为兄弟节点，框架组件和具体页面组件渲染互不影响

                        if (systemNoFrame) return null;
                        // 通过配置，筛选那些页面不需要框架
                        if (noFrameRoutes.includes(props.location.pathname)) return null;

                        // 框架内容属于登录之后内容，如果未登录，也不显示框架
                        if (!isLogin()) return null;

                        // 如果浏览器url中携带了noFrame=true参数，不显示框架
                        if (queryNoFrame === 'true') return null;

                        return <PageFrame {...props}/>;
                    }}/>
                    <Route exact path={userRoutes.map(item => item.path)}>
                        <KeepPage/>
                    </Route>
                    <Switch>
                        {userRoutes.map(item => {
                            const {path, component} = item;
                            let isNoAuthRoute = false;

                            // 不需要登录的页面
                            if (noAuthRoutes.includes(path)) isNoAuthRoute = true;

                            // 如果浏览器url中携带了noAuthor=true参数，不需要登录即可访问
                            if (noAuth === 'true') isNoAuthRoute = true;

                            return (
                                <KeepAuthRoute
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
