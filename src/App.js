import React from 'react';
import {LocaleProvider} from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import AppRouter from './router/AppRouter';
import {connect} from './models';
import moment from 'moment';
import {getMenuTreeDataAndPermissions, getLoginUser, setLoginUser} from './commons'

@connect()
export default class App extends React.Component {
    constructor(...props) {
        super(...props);
        // 从Storage中获取出需要同步到redux的数据
        this.props.action.getStateFromStorage();

        const {system, menu} = this.props.action;
        const loginUser = getLoginUser();

        // 获取系统菜单 和 随菜单携带过来的权限
        this.state.loading = true;
        menu.getMenus({
            params: {userId: loginUser?.id},
            onResolve: (res) => {
                let menus = res || [];
                const {permissions} = getMenuTreeDataAndPermissions(menus);

                if (loginUser) {
                    loginUser.permissions = permissions;
                    setLoginUser(loginUser);
                }

                // 设置当前登录的用户到model中
                system.setLoginUser(loginUser);
                // 保存用户权限到model中
                system.setPermissions(permissions);
            },
            onComplete: () => {
                this.setState({loading: false});
            },
        });

        // 设置语言
        moment.locale('zh-cn')
    }

    state = {
        loading: true,
    };

    render() {
        return (
            <LocaleProvider locale={zhCN}>
                <AppRouter/>
            </LocaleProvider>
        );
    }
}
