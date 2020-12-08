import React from 'react';
import { Route } from 'react-router-dom';
import { isLogin, toLogin } from 'src/commons';
import config from 'src/commons/config-hoc';

/**
 * 与KeepPage配合使用的路由，进行页面的收集
 */
@config({
    pubSub: true,
    connect(state) {
        return {
            tabs: state.layout.tabs,
            title: state.layout.title,
            selectedMenu: state.layout.selectedMenu,
            keepAliveSystem: state.layout.keepAlive,
            showTabs: state.layout.showTabs,
        };
    },
})
export default class KeepAuthRoute extends React.Component {
    render() {
        const {
            component: Component,
            noAuth,
            tabs,
            keepAliveSystem,
            showTabs,
            ...rest
        } = this.props;

        return (
            <Route
                {...rest}
                render={props => {
                    if (!noAuth && !isLogin()) return toLogin();

                    return <Component {...props}/>;
                }}
            />
        );
    }
}
