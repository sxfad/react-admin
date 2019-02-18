import {cloneDeep} from 'lodash/lang';

/**
 * 通用的一些工具方法
 * @module 通用工具方法
 * */

/**
 * 字符串中所有单词首字母大写
 * @param {String} str
 * @returns {String}
 */
export function firstUpperCase(str) {
    const s = typeof str !== 'string' ? `${str}` : str;
    return s.replace(/\b(\w)(\w*)/g, ($0, $1, $2) => $1.toUpperCase() + $2);
}


/**
 * 字符串中所有单词首字母小写
 * @param {String} str
 * @returns {String}
 */
export function firstLowerCase(str) {
    const s = typeof str !== 'string' ? `${str}` : str;
    return s.replace(/\b(\w)(\w*)/g, ($0, $1, $2) => $1.toLowerCase() + $2);
}

/**
 * 获取字符串字节长度，中文占两个字节
 * @param {String} value
 * @returns {number}
 */
export function getStringByteLength(value) {
    if (!value) return 0;
    const s = typeof value !== 'string' ? `${value}` : value;
    let length = s.length;

    for (let i = 0; i < s.length; i++) {
        if (s.charCodeAt(i) > 127) {
            length++;
        }
    }

    return length;
}

/**
 * 格式化字符串
 * @example
 * stringFormat('H{0}llo W{1}rld!', 'e', 'o');
 * stringFormat('H{eKey}llo W{oKey}rld!', {eKey: 'e', oKey: 'o'});
 * @param {String} value 需要格式化的字符串
 * @param {*} args 对象或者多个参数
 * @returns {*}
 */
export function stringFormat(value, ...args) {
    if (!value) return value;
    if (typeof value !== 'string') return value;
    if (!args || !args.length) return value;

    if (args.length === 1 && typeof (args[0]) === 'object') {
        const arg = args[0];
        Object.keys(arg).forEach(key => {
            if (arg[key] !== undefined) {
                const reg = new RegExp(`({${key}})`, 'g');
                value = value.replace(reg, arg[key]);
            }
        });
        return value;
    }

    for (let i = 0; i < args.length; i++) {
        if (args[i] !== undefined) {
            let reg = new RegExp(`({)${i}(})`, 'g');
            value = value.replace(reg, args[i]);
        }
    }
    return value;
}

/**
 * 获取cookie
 * @param {String} objName 存储coolie中数据的key
 * @returns {String}
 */
export function getCookie(objName) {
    let arrStr = document.cookie.split('; ');
    for (let i = 0; i < arrStr.length; i++) {
        let temp = arrStr[i].split('=');
        if (temp[0] === objName) return unescape(temp[1]);
    }
    return '';
}

/**
 * 获取浏览器
 * @returns {number}
 */
export function getScrollBarWidth() {
    let scrollDiv = document.createElement('div');
    scrollDiv.style.position = 'absolute';
    scrollDiv.style.top = '-9999px';
    scrollDiv.style.width = '50px';
    scrollDiv.style.height = '50px';
    scrollDiv.style.overflow = 'scroll';
    document.body.appendChild(scrollDiv);
    let scrollBarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
    window.document.body.removeChild(scrollDiv);
    return scrollBarWidth;
}

/**
 * 获得一个指定范围内的随机数
 * @param {number} min 最范围
 * @param {number} max 最大范围
 * @returns {number}
 */
export function getRandomNum(min, max) {
    const range = max - min;
    const rand = Math.random();
    return (min + Math.round(rand * range));
}

/**
 * 为一个dom元素移除class
 * @param {string} selector document.querySelectory 要到的选择器
 * @param {string} className 要移除的class
 */
export function removeClass(selector, className) {
    let doms = selector;
    if (typeof selector === 'string') {
        doms = document.querySelectorAll(selector);
    }
    if (!doms || !doms.length) return;
    if (!doms.length) doms = [doms];
    doms.forEach(dom => {
        let domClass = dom.className;
        if (domClass) {
            domClass = domClass.split(' ');
            if (!domClass || !domClass.length) return;
            dom.className = domClass.filter(c => c !== className).join(' ');
        }
    });
}

/**
 * 为一个dom元素添加class
 * @param {string} selector document.querySelectory 要到的选择器
 * @param {string} className 要添加的class
 */
export function addClass(selector, className) {
    let doms = selector;
    if (typeof selector === 'string') {
        doms = document.querySelectorAll(selector);
    }
    if (!doms || !doms.length) return;
    if (!doms.length) doms = [doms];
    doms.forEach(dom => {
        let domClass = dom.className;
        if (domClass) {
            domClass = domClass.split(' ');
            if (!domClass || !domClass.length || domClass.indexOf(className) > -1) return;
            domClass.push(className);
            dom.className = domClass.join(' ');
        } else {
            dom.className = className;
        }
    });
}

/**
 * 拼接get请求所需url
 * @param {string} url
 * @param {object} params 请求参数
 * @returns {string} 拼接后的url
 */
export function mosaicUrl(url, params) {
    if (!params) return url;
    const queryString = [];
    Object.keys(params).forEach(key => {
        let value = params[key];
        if (value !== undefined && value !== null) {
            queryString.push(`${key}=${value}`);
        }
    });
    const qStr = queryString.join('&');
    if (url.indexOf('?') < 0) {
        url += `?${qStr}`;
    } else if (url.endsWith('&')) {
        url += qStr;
    } else if (url.endsWith('?')) {
        url += `${qStr}`;
    } else {
        url += `&${qStr}`;
    }
    return url;
}

/**
 * 根据keyPath查找一个object中的数据
 * @param obj 需要查找的对象
 * @param {string} keyPath 类似： a.b.c
 * @returns {*} 查找到的数据
 */
function findObjByKeyPath(obj, keyPath) {
    const keys = keyPath.split('.');
    let targetObj = obj;
    keys.forEach(k => {
        targetObj = targetObj[k];
    });
    return targetObj;
}

/**
 * 从数组中删除一个元素
 * @param {Array} arr 需要操作的数组
 * @param {*} item 要删除的元素，注意：内部是用'==='比对的
 */
export function arrayRemove(arr, item) {
    if (!arr || !Array.isArray(arr) || !arr.length) return arr;
    const newArr = cloneDeep(arr);
    let itemIndex = -1;
    for (let i = 0; i < newArr.length; i++) {
        if (newArr[i] === item) {
            itemIndex = i;
            break;
        }
    }
    if (itemIndex > -1) {
        newArr.splice(itemIndex, 1);
    }
    return newArr;
}

/**
 * 从数组中删除一些元素
 * @param {Array} arr 需要操作的数组
 * @param {Array} items 需要删除的元素
 */
export function arrayRemoveAll(arr, items) {
    if (!arr || !Array.isArray(arr) || !arr.length) return arr;
    if (!items || !Array.isArray(items) || !items.length) return arr;
    return arr.filter(item => {
        return !items.find(it => it === item);
    });
}

/**
 * 加入元素到数组中，如果已存在就不添加了
 * @param array
 * @param item
 * @returns {...*[]}
 */
export function arrayPush(array, item) {
    if (!array || !Array.isArray(array)) return array;

    const arr = [...array];
    if (!arr.includes(item)) arr.push(item);

    return arr;
}

/**
 * 根据指定keyPath 添加元素
 * @param obj 要操作的数据
 * @param {string} keyPath 类似于：a.b.c，就会把value赋值给c
 * @param {*} value 要设置的数据
 * @throws Will throw error if keyPath dose not point to an object
 */
export function objSetValue(obj, keyPath, value) {
    const newObj = cloneDeep(obj);
    const pointLastIndex = keyPath.lastIndexOf('.');
    if (pointLastIndex < 0) {
        if (typeof newObj !== 'object') {
            throw new Error('keyPath dose not point to an object!');
        }
        newObj[keyPath] = value;
        return newObj;
    }
    const key = keyPath.substr(pointLastIndex + 1, keyPath.length);
    keyPath = keyPath.substr(0, pointLastIndex);
    let targetObj = findObjByKeyPath(newObj, keyPath);
    if (typeof targetObj !== 'object') {
        throw new Error('keyPath dose not point to an object!');
    }
    targetObj[key] = value;
    return newObj;
}

/**
 * 根据keyPath定位到指定元素，并将其删除
 * @param obj 要操作的数据
 * @param {string} keyPath keyPath 类似于：a.b.c，会把c删除
 * @throws Will throw error if keyPath dose not point to an object
 */
export function objRemove(obj, keyPath) {
    const newObj = cloneDeep(obj);
    const pointLastIndex = keyPath.lastIndexOf('.');
    if (pointLastIndex < 0) {
        if (typeof newObj !== 'object') {
            throw new Error('keyPath dose not point to an object!');
        }
        delete newObj[keyPath];
        return newObj;
    }
    const key = keyPath.substr(pointLastIndex + 1, keyPath.length);
    keyPath = keyPath.substr(0, pointLastIndex);
    let targetObj = findObjByKeyPath(newObj, keyPath);
    if (typeof targetObj !== 'object') {
        throw new Error('keyPath dose not point to an object!');
    }
    delete targetObj[key];
    return newObj;
}

/**
 * 根据keyPath定位到指定数组，并添加元素
 * @param obj 要操作的数据
 * @param keyPath 类似于：a.b.c，通过keyPath，定位到obj中某个数组
 * @param value 需要append的元素
 * @throws Will throw error if keyPath dose not point to an array
 */
export function arrAppendValue(obj, keyPath, value) {
    const newObj = cloneDeep(obj);
    let targetObj = findObjByKeyPath(newObj, keyPath);
    if (!Array.isArray(targetObj)) {
        throw new Error('keyPath dose not point to an array!');
    }
    if (Array.isArray(value) && value.length) {
        value.forEach(v => targetObj.push(v));
    } else {
        targetObj.push(value);
    }
    return newObj;
}

/**
 * 根据keyPath定位到指定数组，删除一个元素
 * @param obj 要操作的数据
 * @param keyPath 类似于：a.b.c，通过keyPath，定位到obj中某个数组
 * @param value 需要删除的数组元素
 * @throws Will throw error if keyPath dose not point to an array
 */
export function arrRemove(obj, keyPath, value) {
    const newObj = cloneDeep(obj);
    let targetObj = findObjByKeyPath(newObj, keyPath);
    if (!Array.isArray(targetObj)) {
        throw new Error('keyPath dose not point to an array!');
    }
    targetObj = arrayRemove(targetObj, value);
    return objSetValue(newObj, keyPath, targetObj);
}

/**
 * 根据keyPath定位到指定数组，删除所有跟value相同的元素
 * @param obj 要操作的数据
 * @param keyPath 类似于：a.b.c，通过keyPath，定位到obj中某个数组
 * @param value 移除的数组元素
 * @throws Will throw error if keyPath dose not point to an array
 */
export function arrRemoveAll(obj, keyPath, value) {
    const newObj = cloneDeep(obj);
    let targetObj = findObjByKeyPath(newObj, keyPath);
    if (!Array.isArray(targetObj)) {
        throw new Error('keyPath dose not point to an array!');
    }
    while (targetObj.indexOf(value) > -1) {
        targetObj = arrayRemove(targetObj, value);
    }
    return objSetValue(newObj, keyPath, targetObj);
}

/**
 * 数组去重，此方法不改变原有数据，返回新的数组
 * @param {Array} array
 * @returns {Array} 新数组
 */
export function uniqueArray(array) {
    const n = {}; // hash 表
    const r = []; // 临时数组
    for (let i = 0; i < array.length; i++) { // 遍历当前数组
        if (!n[array[i]]) { // 如果hash表中没有当前项
            n[array[i]] = true; // 存入hash表
            r.push(array[i]); // 把当前数组的当前项push到临时数组里面
        }
    }
    return r;
}

/**
 * 获取浏览器窗口大小
 * @returns {{width: (Number|number), height: (Number|number)}}
 */
export function getWindowSize() {
    const w = window;
    const d = document;
    const e = d.documentElement;
    const g = d.getElementsByTagName('body')[0];
    const width = w.innerWidth || e.clientWidth || g.clientWidth;
    const height = w.innerHeight || e.clientHeight || g.clientHeight;
    return {width, height};
}

/**
 * 为dom元素添加事件
 * @param element {Object} 需要添加事件的dom元素
 * @param type {String} 事件名称，比如 'click'
 * @param handler {function} 事件处理函数
 */
export function addEventListener(element, type, handler) {
    if (!element) return;
    if (element.addEventListener) {
        element.addEventListener(type, handler, false);
    } else if (element.attachEvent) {
        element.attachEvent(`on${type}`, handler);
    } else {
        element[`on${type}`] = handler;
    }
}

/**
 * 为dom元素移除事件
 * @param element {Object} 需要添加事件的dom元素
 * @param type {String} 事件名称，比如 'click'
 * @param handler {function} 事件处理函数
 */
export function removeEventListener(element, type, handler) {
    if (!element) return;
    if (element.removeEventListener) {
        element.removeEventListener(type, handler, false);
    } else if (element.detachEvent) {
        element.detachEvent(`on${type}`, handler);
    } else {
        element[`on${type}`] = null;
    }
}

/**
 * 将数值四舍五入后格式化成金额形式
 *
 * @param num 数值(Number或者String)
 * @param options 可选参数
 * @param options.prefix 金钱前缀，默认为空，一般为 ￥ 或 $
 * @param options.decimalNum 保留小数点个数，默认为2 一般为 0 1 2
 * @param options.splitSymbol 格式化分割符，默认为英文逗号，分隔符必须是单字符
 * @return 金额格式的字符串,如'￥1,234,567.45'
 * @type String
 */
export function formatCurrency(num, options = {}) {
    let {decimalNum, splitSymbol} = options;
    const {prefix = '￥'} = options;
    let centsPercent = 100;
    if (splitSymbol === undefined) splitSymbol = ',';
    if (decimalNum !== 0 && decimalNum !== 1 && decimalNum !== 2) decimalNum = 2;
    if (decimalNum === 0) centsPercent = 1;
    if (decimalNum === 1) centsPercent = 10;
    num = num.toString().replace(/\$|,/g, '');
    if (isNaN(num)) num = '0';
    const sign = (num === Math.abs(num).toString()) ? '' : '-';
    num = Math.abs(num);
    num = Math.floor((num * centsPercent) + 0.50000000001);
    let cents = num % centsPercent;
    num = Math.floor(num / centsPercent).toString();
    if (cents < 10 && decimalNum === 2) {
        cents = `0${cents}`;
    }
    for (let i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++) {
        const endPosition = (4 * i) + 3;
        num = num.substring(0, num.length - endPosition)
            + splitSymbol + num.substring(num.length - endPosition);
    }
    if (decimalNum === 0) {
        return prefix + sign + num;
    }
    return `${prefix}${sign}${num}.${cents}`;
}
