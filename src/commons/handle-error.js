import {notification} from 'antd';
import {toLogin} from './index';

/**
 * 尝试获取错误信息 errorTio > resData.message > resData.data > error.message > '未知系统错误'
 * @param error
 * @param errorTip
 * @returns {*}
 */
function getErrorTip({error, errorTip}) {
    const serverErrorTip = '系统开小差了，请稍后再试或联系管理员';

    if (errorTip && errorTip !== true) return errorTip;

    // 后端返回数据规范不同，这里可能需要修改
    if (error && error.response) {
        const {status, message, data} = error.response;

        if (status === 403) return '您无权访问';

        if (status === 404) return '您访问的资源不存在';

        if (status >= 500) return serverErrorTip;

        // 后端自定义信息
        if (message && typeof message === 'string') return message;

        if (data && typeof data === 'string') return data;
    }

    if (error && error.message && error.message.startsWith('timeout of')) return '访问资源超时';

    if (error?.message) return error.message;

    return serverErrorTip;
}

export default function handleError({error, errorTip}) {
    const {status} = error?.response || {};

    // 如果是未登录问题，不显示错误提示，直接跳转到登录页面
    if (status === 401) return toLogin();

    // 用户设置false，关闭提示，不显示错误信息
    if (errorTip === false) return;

    const description = getErrorTip({error, errorTip});

    notification.error({
        message: '失败',
        description,
        duration: 2,
    });
}
