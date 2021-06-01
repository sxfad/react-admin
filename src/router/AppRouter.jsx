import React, {Component} from 'react';
import {BrowserRouter, HashRouter, Route, Switch} from 'react-router-dom';
import {Error404} from '@ra-lib/components';
import {Layout/*, Footer*/} from 'src/components';
import {BASE_NAME, CONFIG_HOC, HASH_ROUTER} from 'src/config';
import routes from './routes';

const Router = HASH_ROUTER ? HashRouter : BrowserRouter;
const baseName = HASH_ROUTER ? '' : BASE_NAME;

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
        const userRoutes = this.getUserRoutes();
        return (
            <Router basename={baseName}>
                <Route path="/" render={props => {
                    return (
                        <Layout
                            {...props}
                            routes={userRoutes}
                            render404={props => <Error404 {...props}/>}
                            baseName={baseName}
                        />
                    );
                }}/>
                {!CONFIG_HOC.keepAlive ? (
                    <Switch>
                        {routes.map(item => {
                            const {path, component} = item;

                            return (
                                <Route
                                    key={path}
                                    exact
                                    path={path}
                                    component={component}
                                />
                            );
                        })}
                        <Route component={Error404}/>
                    </Switch>
                ) : null}
                {/*<Footer/>*/}
            </Router>
        );
    }
}
