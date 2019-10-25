import {notification} from 'antd';
import {toLogin} from './index';

/**
 * 尝试获取错误信息 errorTio > resData.message > error.message > '未知系统错误'
 *
 * @param error
 * @param errorTip
 * @returns {*}
 */
function getErrorTip({error, errorTip}) {
    const commonTip = '系统开小差了，请稍后再试或联系管理员';

    if (errorTip && errorTip !== true) return errorTip;

    if (error && error.response) {
        const {status, message} = error.response;

        if (status === 403) {
            return '您无权访问';
        }

        if (status === 404) {
            return '您访问的资源不存在';
        }

        if (status === 504) {
            return commonTip;
        }

        if (status === 500) {
            return commonTip;
        }

        // 后端自定义信息
        if (message) return message;
    }

    if (error && error.message && error.message.startsWith('timeout of')) return '方位超时';

    if (error) return error.message;

    return commonTip;
}

export default function handleError({error, errorTip}) {
    const {status} = error?.response || {};

    // 如果是未登录问题，不显示错误提示
    if (status === 401) return toLogin();

    if (errorTip === false) return;

    const description = getErrorTip({error, errorTip});

    notification.error({
        message: '失败',
        description,
        duration: 2,
    });
}
