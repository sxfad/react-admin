import React, {Component} from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import ReactLoadable from 'react-loadable';
import {isAuthenticated} from '@/commons';
import PageFrame from '@/layouts/frame';
import PageLoading from "@/layouts/page-loading";
import Error404 from '@/pages/error/Error404';
import config from '@/commons/config-hoc';
import KeepAuthRoute from './KeepAuthRoute';
import KeepPage from './KeepPage';
import routes, {noFrameRoutes, noAuthRoutes, /*commonPaths*/} from './routes';

// 如果项目挂载到网站的子目录下，可以配置ROUTE_BASE_NAME， 开发时拿不到 PUBLIC_URL
// export const ROUTE_BASE_NAME = '/react-admin-live';

// 直接挂载到域名根目录
export const ROUTE_BASE_NAME = '';

// 代码分割处理
const allRoutes = routes.map(item => {
    return {
        path: item.path,
        component: ReactLoadable({loader: item.component, loading: PageLoading}),
    };
});


@config({
    query: true,
    connect: state => ({userPaths: state.system.userPaths})
})
export default class AppRouter extends Component {
    render() {
        const {noFrame, noAuth} = this.props.query;

        // allRoutes为全部路由配置，根据用户可用 菜单 和 功能 的path，对allRoutes进行过滤，可以解决越权访问页面的问题
        // commonPaths 为所有人都可以访问的路径
        // const {userPaths} = this.props;
        // const allPaths = [...userPaths, ...commonPaths];
        // const userRoutes = allRoutes.filter(item => allPaths.includes(item.path));

        const userRoutes = allRoutes;

        return (
            <BrowserRouter basename={ROUTE_BASE_NAME}>
                <div style={{display: 'flex', flexDirection: 'column', position: 'relative', minHeight: '100vh'}}>
                    <Route path="/" render={props => {
                        // 框架组件单独渲染，与其他页面成为兄弟节点，框架组件和具体页面组件渲染互不影响

                        // 通过配置，筛选那些页面不需要框架
                        if (noFrameRoutes.includes(props.location.pathname)) {
                            return null;
                        }

                        // 框架内容属于登录之后内容，如果未登录，也不显示框架
                        if (!isAuthenticated()) {
                            return null;
                        }

                        // 如果浏览器url中携带了noFrame=true参数，不显示框架
                        if (noFrame === 'true') {
                            return null;
                        }

                        return <PageFrame {...props}/>;
                    }}/>

                    <KeepPage/>

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
