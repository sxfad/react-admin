import React from 'react';
import { ConfigProvider, Spin } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import AppRouter from './router/AppRouter';
import { connect } from './models';
import moment from 'moment';
import { getLoginUser, setLoginUser } from '@/commons';
import 'moment/locale/zh-cn'; // 解决 antd 日期组件国际化问题
// 设置语言
moment.locale('zh-cn');

@connect()
export default class App extends React.Component {
    state = {
        loading: true,
    };

    componentDidMount() {
        const { action: { menu, system } } = this.props;
        // 从Storage中获取出需要同步到redux的数据
        this.props.action.getStateFromStorage();

        const loginUser = getLoginUser();
        const userId = loginUser?.id;

        // 获取系统菜单 和 随菜单携带过来的权限
        this.setState({ loading: true });
        menu.getMenus({
            params: { userId },
            onResolve: (res) => {
                const menus = res || [];
                const permissions = [];
                const paths = [];

                menus.forEach(({ type, path, code }) => {
                    if (type === '2' && code) permissions.push(code);

                    if (path) paths.push(path);
                });

                if (loginUser) {
                    loginUser.permissions = permissions;
                    setLoginUser(loginUser);
                }

                // 设置当前登录的用户到model中
                system.setLoginUser(loginUser);

                // 保存用户权限到model中
                system.setPermissions(permissions);

                // 保存当前用户可用path到model中
                system.setUserPaths(paths);
            },
            onComplete: () => {
                this.setState({ loading: false });
            },
        });
    }

    render() {
        const { loading } = this.state;

        return (
            <ConfigProvider locale={zhCN}>
                {loading ? (
                    <div style={{
                        display: 'flex',
                        width: '100%',
                        height: '100vh',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <Spin spinning tip="加载中..."/>
                    </div>
                ) : (
                    <AppRouter/>
                )}
            </ConfigProvider>
        );
    }
}
