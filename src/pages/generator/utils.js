/**
 * 连字符(-) 命名 转 首字母大写转驼峰命名
 * @param str
 */
export function firstUpperCase(str) {
    const s = str.replace(/\b(\w)(\w*)/g, ($0, $1, $2) => $1.toUpperCase() + $2);
    return s.replace(/-/g, '');
}

/**
 * 连字符(-) 命名 转 首字母小写 驼峰命名
 * @param str
 */
export function firstLowerCase(str) {
    return str.replace(/-(\w)/g, (a, b) => b.toUpperCase());
}

/**
 * 连字符(-) 命名 转 大写 + 下划线
 * @param str
 * @returns {string}
 */
export function allUpperCase(str) {
    const s = str.toUpperCase();
    return s.replace(/-/g, '_');
}

export const typeOptions = [
    {label: 'input(输入框)', value: 'input'},
    {label: '隐藏(隐藏输入框)', value: 'hidden'},
    {label: 'number(数字输入框)', value: 'number'},
    {label: 'textarea(文本框)', value: 'textarea'},
    {label: 'password(密码框)', value: 'password'},
    {label: 'mobile(手机输入框)', value: 'mobile'},
    {label: 'email(邮件输入框)', value: 'email'},
    {label: 'select(下拉选择)', value: 'select'},
    {label: 'select-tree(下拉树)', value: 'select-tree'},
    {label: 'checkbox(多选框)', value: 'checkbox'},
    {label: 'checkbox-group(多选框组)', value: 'checkbox-group'},
    {label: 'radio(单选)', value: 'radio'},
    {label: 'radio-group(单选组)', value: 'radio-group'},
    {label: 'switch(切换按钮)', value: 'switch'},
    {label: 'date(日期)', value: 'date'},
    {label: 'date-time(日期-时间)', value: 'date-time'},
    {label: 'date-range(日期区间)', value: 'date-range'},
    {label: 'month(月份)', value: 'month'},
    {label: 'time(时间)', value: 'time'},
    {label: 'cascader(级联)', value: 'cascader'}
];

export function getTypeByMysqlType(mySqlType) {
    const typeMap = {
        // 数字
        tinyint: 'switch',
        smallint: 'number',
        mediumint: 'number',
        int: 'number',
        bigint: 'number',
        float: 'number',
        double: 'number',
        decimal: 'number',

        // 字符串
        char: 'switch',
        varchar: 'input',
        tinytext: 'input',
        text: 'input',
        mediumtext: 'input',
        longtext: 'textarea',

        // 日期
        date: 'date',
        time: 'time',
        datetime: 'date-time',
        timestamp: 'date-time',
    };

    return typeMap[mySqlType] || 'input';
}
