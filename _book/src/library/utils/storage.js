/**
 * localStorage 和 sessionStorage 封装
 *
 *
 * @example
 * // 引入
 * import * as storage from 'path/to/storage';
 *
 * @example
 // 初始化，如果不需要keyPrefix，可以不初始化
 storage.init({
    keyPrefix: user.id,
 });
 *
 * @example
 * // 使用localStorage相关方法
 * storage.setItem('user', userObj);
 *
 * @example
 * // 使用sessionStorage相关方法
 * import {session} from 'path/to/storage';
 * session.setItem('user', userObj);
 *
 *
 * @module 本地存储
 */

const localStorage = window.localStorage;
const sessionStorage = window.sessionStorage;
let _keyPrefix = 'default-prefix-';

/**
 * 初始化配置
 * @param options keyPrefix：存储前缀，用来区分不同用户数据，否则同一台电脑，不同人存储数据会互相干扰。
 */
export function init(options) {
    const {keyPrefix = 'default-prefix'} = options;
    _keyPrefix = `${keyPrefix}-`;
}

/**
 * localStorage 存储数据
 * @param {string} key 数据的key
 * @param {*} value 要存储的数据
 */
export function setItem(key, value) {
    key = _keyPrefix + key;
    value = JSON.stringify(value);
    localStorage.setItem(key, value);
}

/**
 * localStorage 获取数据
 * @param {string} key
 * @return {json} key 对应的数据
 */
export function getItem(key) {
    key = _keyPrefix + key;
    let value = localStorage.getItem(key);
    return JSON.parse(value);
}

/**
 * localStorage 根据keyPrefix清空数据
 */
export function clear() {
    const localStorageKeys = Object.keys(localStorage);
    if (localStorageKeys && localStorageKeys.length) {
        localStorageKeys.forEach(item => {
            if (item.startsWith(_keyPrefix)) {
                localStorage.removeItem(item);
            }
        });
    }
}

/**
 * localStorage 删除数据
 * @param key
 */
export function removeItem(key) {
    key = _keyPrefix + key;
    localStorage.removeItem(key);
}

/**
 * localStorage 根据keys 获取一组数据
 * @param {array} keys
 * @returns {{json}}
 */
export function multiGet(keys) {
    let values = {};
    keys.forEach(key => values[key] = getItem(key));
    return values;
}

/**
 * localStorage 根据keys 删除一组数据
 * @param {array} keys
 */
export function multiRemove(keys) {
    keys.forEach(key => removeItem(key));
}

/**
 * sessitonStorage 封装，具有localStorage同样方法
 *
 * @type {{setItem(*=, *=): void, getItem(*=): *, clear(): void, removeItem(*=): void, multiGet(*): *, multiRemove(*): void}}
 */
export const session = {
    setItem(key, value) {
        key = _keyPrefix + key;
        value = JSON.stringify(value);
        sessionStorage.setItem(key, value);
    },
    getItem(key) {
        key = _keyPrefix + key;
        let value = sessionStorage.getItem(key);
        return JSON.parse(value);
    },
    // 根据 keyPrefix 清除用户数据
    clear() {
        const sessionStorageKeys = Object.keys(sessionStorage);
        if (sessionStorageKeys && sessionStorageKeys.length) {
            sessionStorageKeys.forEach(item => {
                if (item.startsWith(_keyPrefix)) {
                    sessionStorage.removeItem(item);
                }
            });
        }
    },
    removeItem(key) {
        key = _keyPrefix + key;
        sessionStorage.removeItem(key);
    },
    multiGet(keys) {
        let values = {};
        keys.forEach(key => values[key] = this.getItem(key));
        return values;
    },
    multiRemove(keys) {
        keys.forEach(key => this.removeItem(key));
    },
};


const globalStorage = {};
/**
 * 全局存储封装，刷新之后将被清空
 * @type {{setItem(*, *): void, getItem(*): *, clear(): void, removeItem(*): void, multiGet(*): *, multiRemove(*): void}}
 */
export const global = {
    setItem(key, value) {
        key = _keyPrefix + key;
        globalStorage[key] = value;
    },
    getItem(key) {
        key = _keyPrefix + key;
        return globalStorage[key];
    },
    clear() {
        Object.keys(globalStorage).forEach(key => {
            if (key.startsWith(_keyPrefix)) {
                delete globalStorage[key];
            }
        });
    },
    removeItem(key) {
        key = _keyPrefix + key;
        delete globalStorage[key];
    },
    multiGet(keys) {
        let values = {};
        keys.forEach(key => values[key] = this.getItem(key));
        return values;
    },
    multiRemove(keys) {
        keys.forEach(key => this.removeItem(key));
    },
};
