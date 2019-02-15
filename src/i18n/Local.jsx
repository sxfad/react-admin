import React from 'react';
import {LocaleProvider} from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import enGB from 'antd/lib/locale-provider/en_GB';
import moment from 'moment';
import 'moment/locale/zh-cn'; // 解决 antd 日期组件国际化问题
import {connect} from '@/models';
import allI18n, {defaultLang} from './index';

@connect(state => {
    return {
        local: state.system.local,
        autoLocal: state.system.autoLocal,
    }
})
export default class Local extends React.Component {
    constructor(...props) {
        super(...props);
        let {local, autoLocal} = this.props;

        // 不基于浏览器自动获取，将语言设置为默认
        if (!autoLocal) local = defaultLang.local;

        // 从浏览器存储中恢复语言
        const storeLocal = window.localStorage.getItem('system-local');

        if (storeLocal) local = storeLocal;

        // 如果没有选择过语言，通过浏览器获取语言
        if (!local && autoLocal) {
            local = getLocalByBrowser();
        }

        this.props.action.system.setLocal(local);

        function getLocalByBrowser() {
            const type = navigator.appName;
            const defaultLocal = 'en_GB'; // 如果未获取到，默认语言为英文
            let lang;

            if (type === 'Netscape') {
                lang = navigator.language; // 获取浏览器配置语言，支持非IE浏览器
            } else {
                lang = navigator.userLanguage; // 获取浏览器配置语言，支持IE5+ == navigator.systemLanguage
            }

            if (!lang) return defaultLocal;

            lang = lang.replace('-', '_');

            const exactLang = allI18n.find(item => item.local === lang);
            const firstTowCharLang = allI18n.find(item => item.local.substr(0, 2) === lang.substr(0, 2));

            // 完全匹配了
            if (exactLang) return exactLang.local;

            // 前两位匹配
            if (firstTowCharLang) return firstTowCharLang.local;

            // 未查找到匹配的语言，设置成默认语言
            return defaultLocal;
        }
    }


    render() {
        const {children, local} = this.props;

        // FIXME 更多语言支持
        const momentLocalMap = {
            'zh_CN': 'zh-cn',
            'en_GB': 'en-gb',
        };
        const antLocalMap = {
            'zh_CN': zhCN,
            'en_GB': enGB,
        };

        const momentLocal = momentLocalMap[local];
        if (momentLocal) moment.locale(momentLocal);

        const antLan = antLocalMap[local];

        return (
            <LocaleProvider locale={antLan}>
                {children}
            </LocaleProvider>
        );
    }
}
