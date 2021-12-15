import { notification, Modal } from 'antd';
import { toLogin } from './index';

const ERROR_SERVER = '系统开小差了，请稍后再试或联系管理员！';
const ERROR_NOT_FOUND = '您访问的资源不存在！';
const ERROR_FORBIDDEN = '您无权访问！';
const ERROR_UNKNOWN = '未知错误';
const TIP_TITLE = '温馨提示';
const TIP = '失败';

function getErrorTip(error, tip) {
    if (tip && tip !== true) return tip;

    // http 状态码相关
    if (error?.response) {
        const { status } = error.response;

        if (status === 401) return toLogin();
        if (status === 403) return ERROR_FORBIDDEN;
        if (status === 404) return ERROR_NOT_FOUND;
        if (status >= 500) return ERROR_SERVER;
    }

    // 后端自定义信息
    const data = error?.response?.data || error;

    if (typeof data === 'string') return data;
    if (data?.message) return data.message;
    if (data?.msg) return data.msg;

    return ERROR_UNKNOWN;
}

export default function handleError({ error, tip, options = {} }) {
    const description = getErrorTip(error, tip);
    const { errorModal } = options;

    if (!description && !errorModal) return;

    // 避免卡顿
    setTimeout(() => {
        // 弹框提示
        if (errorModal) {
            // 详细配置
            if (typeof errorModal === 'object') {
                return Modal.error({
                    title: TIP_TITLE,
                    content: description,
                    ...errorModal,
                });
            }

            return Modal.error({
                title: TIP_TITLE,
                content: description,
            });
        }

        // 右上角滑出提示
        notification.error({
            message: TIP,
            description,
            duration: 2,
        });
    });
}
