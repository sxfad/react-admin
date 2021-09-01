import React, {useState, useEffect} from 'react';
import {ConfigProvider} from 'antd';
import {Helmet} from 'react-helmet';
import {Provider} from 'react-redux';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn'; // 解决antd日期相关组件国际化问题
import {ComponentProvider, Loading, getLoginUser, setLoginUser, /*queryParse,*/ isLoginPage} from '@ra-lib/admin';
import AppRouter from './router/AppRouter';
import {Generator} from 'src/components';
import {APP_NAME, CONFIG_HOC, IS_MOBILE} from './config';
import {store} from './models';
import api from 'src/api';
import theme from 'src/theme.less';
import './App.less';

// 设置语言
moment.locale('zh-cn');

// 设置 Modal、Message、Notification rootPrefixCls。
ConfigProvider.config({
    prefixCls: theme.antPrefix,
});

export default function App(props) {
    const {children} = props;
    const [loading, setLoading] = useState(true);
    const [menus, setMenus] = useState([]);
    const [collectedMenus, setCollectedMenus] = useState(CONFIG_HOC.showCollectedMenus ? [] : null);

    async function handleMenuCollect(menu, collected) {
        await api.saveCollectedMenu({menuId: menu.id, collected});

        const collectedMenus = await api.getCollectedMenus();
        setCollectedMenus(collectedMenus);
    }

    // 一些初始化工作
    useEffect(() => {
        // 登录页面不请求
        if (isLoginPage()) return setLoading(false);

        // 获取用户菜单、权限等
        (async () => {
            try {
                let loginUser = getLoginUser();
                if (!loginUser) {
                    // 嵌入iframe等方式，没有经过登录页面，没有设置loginUser，需要请求loginUser
                    // 发请求，获取loginUser
                    // loginUser = await api.getLoginUser();
                    //
                    // const {token} = queryParse();
                    // if (token) loginUser.token = token;
                    //
                    // setLoginUser(loginUser);

                    return setLoading(false);
                }

                // 用户收藏菜单
                if (CONFIG_HOC.showCollectedMenus) {
                    const collectedMenus = await api.getCollectedMenus();
                    setCollectedMenus(collectedMenus);
                }

                // 获取用户菜单、权限等
                const menus = await api.getMenus();
                setMenus(menus);

                loginUser.permissions = await api.getPermissions();
                setLoginUser(loginUser);

            } finally {
                setLoading(false);
            }
        })();
    }, []);

    // 加载中不渲染实际内容
    if (loading) return <Loading progress={false} spin/>;

    // 加载完成后渲染，确保能拿到permissions等数据
    return (
        <Provider store={store}>
            <ConfigProvider locale={zhCN} prefixCls={theme.antPrefix}>
                <Helmet title={APP_NAME}/>
                <ComponentProvider
                    prefixCls={theme.raLibPrefix}
                    layoutPageOtherHeight={CONFIG_HOC.pageOtherHeight}
                    isMobile={IS_MOBILE}
                >
                    {children ? children : (
                        <AppRouter
                            menus={menus}
                            collectedMenus={collectedMenus}
                            onMenuCollect={handleMenuCollect}
                        />
                    )}
                    {process.env.NODE_ENV === 'development' ? (
                        <Generator/>
                    ) : null}
                </ComponentProvider>
            </ConfigProvider>
        </Provider>
    );
}

