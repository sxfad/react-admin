import appPackage from '../../package.json';
import {Storage} from '@ra-lib/util';
// import { getLoginUser } from './index';
// 不使用getLoginUser，与 index 不依赖
const userId = window.sessionStorage.getItem('loginUserId');
const STORAGE_PREFIX = `${appPackage.name}_${userId || ''}_`;

/**
 * 前端存储对象 storage.local storage.session storage.global
 * storage.local.setItem(key, value) storage.local.getItem(key, value)
 * @type {Storage}
 */
export default new Storage({prefix: STORAGE_PREFIX});
