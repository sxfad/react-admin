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
