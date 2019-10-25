import React from 'react';
import {ConfigProvider} from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import AppRouter from './router/AppRouter';
import {connect} from './models';
import moment from 'moment';
import 'moment/locale/zh-cn'; // 解决 antd 日期组件国际化问题
// 设置语言
moment.locale('zh-cn');

@connect()
export default class App extends React.Component {
    render() {
        return (
            <ConfigProvider locale={zhCN}>
                <AppRouter/>
            </ConfigProvider>
        );
    }
}
