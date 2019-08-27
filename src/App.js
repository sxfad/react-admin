import React from 'react';
import {LocaleProvider} from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import AppRouter from './router/AppRouter';
import {connect} from './models';
import moment from 'moment';

@connect()
export default class App extends React.Component {
    constructor(...props) {
        super(...props);
        // 设置语言
        moment.locale('zh-cn')
    }

    render() {
        return (
            <LocaleProvider locale={zhCN}>
                <AppRouter/>
            </LocaleProvider>
        );
    }
}
