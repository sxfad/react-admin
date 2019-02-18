import en_GB from './en_GB';
import zh_CN from './zh_CN';

const _defaultLang = {
    name: '语言',
    label: '简体中文',
    local: 'zh_CN',
    i18n: zh_CN,
};

let _currentLocal = _defaultLang.i18n;

/**
 * 设置当前语言集
 * @param current
 */
export function setCurrentLocal(current) {
    _currentLocal = current;
}

/**
 * 获取当前语言集
 */
export function getCurrentLocal() {
    return _currentLocal;
}

/**
 * 系统默认语言
 * @type {{name: string, label: string, local: string, i18n: {application, ajaxTip, menu, login, setting}}}
 */
export const defaultLang = _defaultLang;

/**
 * 默认导出所有语言集
 */
export default [
    {name: 'lang', label: 'English', local: 'en_GB', i18n: en_GB},
    {name: '语言', label: '简体中文', local: 'zh_CN', i18n: zh_CN},
];
