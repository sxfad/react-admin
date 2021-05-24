import React, {useState, useEffect} from 'react';
import {ConfigProvider} from 'antd';
import {Helmet} from 'react-helmet';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/dist/locale/zh-cn'; // 解决antd日期相关组件国际化问题
import {ComponentProvider} from '@ra-lib/components';
import AppRouter from './router/AppRouter';
import {APP_NAME, CONFIG_HOC, IS_MOBILE} from 'src/config';
import {RouteLoading} from 'src/components';
import {MOCK} from 'src/config';
import {store} from 'src/models';
import {Provider} from 'react-redux';
import './App.less';
// import {getLoginUser} from 'src/commons';

// 设置语言
moment.locale('zh-cn');

// 开启mock，这个判断不要修改，否则会把mock相关js打入生产包，很大
if (process.env.NODE_ENV === 'development' && MOCK) {
    require('./mock/index');
    console.warn('mock is enabled!!!');
}

export default function App() {
    const [loading, setLoading] = useState(true);
    // 一些初始化工作
    useEffect(() => {
        (async () => {
            try {
                // 用户权限
                // const loginUser = getLoginUser();
                // if(loginUser) loginUser.permissions = []
                setLoading(false);
            } catch (e) {
                setLoading(false);
                throw e;
            }
        })();
    }, []);

    return (
        <Provider store={store}>
            <ConfigProvider locale={zhCN}>
                <Helmet title={APP_NAME}/>

                {loading ? (<RouteLoading tipe="加载中..."/>) : null}

                <ComponentProvider
                    layoutPageOtherHeight={CONFIG_HOC.pageOtherHeight}
                    isMobile={IS_MOBILE}
                >
                    <AppRouter/>
                </ComponentProvider>
            </ConfigProvider>
        </Provider>
    );
}

