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


                    // 给组件添加 key，如果多个tab公用一个页面（动态路由，比如用户详情页），tab切换时，保证组件卸载 重新加载
                    const key = props.location.pathname;

                    return <Component key={key} {...props} />;
                }}
            />
        );
    }
}
