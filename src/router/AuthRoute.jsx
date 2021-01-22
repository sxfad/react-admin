import React from 'react';
import {Route} from 'react-router-dom';
import {isLogin, toLogin} from 'src/commons';

/**
 * 未登录拦截
 * 前端判断是否登录，如果未登录直接跳转到登录页面
 */
export default class AuthRoute extends React.Component {
    render() {
        const {
            component: Component,
            noAuth,
            ...rest
        } = this.props;

        return (
            <Route
                {...rest}
                render={props => {
                    if (!noAuth && !isLogin()) return toLogin();

                    return <Component {...props} />;
                }}
            />
        );
    }
}
