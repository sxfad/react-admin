import appPackage from '../../package.json';
import {Storage} from '@ra-lib/util';
import {getLoginUser} from 'src/commons/index';

const STORAGE_PREFIX = `${appPackage.name}_${getLoginUser()?.id || ''}_`;

/**
 * 前端存储对象 storage.local storage.session storage.global
 * storage.local.setItem(key, value) storage.local.getItem(key, value)
 * @type {Storage}
 */
export default new Storage({prefix: STORAGE_PREFIX});
