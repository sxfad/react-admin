import { notification, Modal } from 'antd';

const TIP_TITLE = '温馨提示';
const TIP = '成功';

export default function handleSuccess({ tip, options = {} }) {
    const { successModal } = options;

    if (!tip && !successModal) return;

    // 避免卡顿
    setTimeout(() => {
        // 弹框方式显示提示
        if (successModal) {
            // 详细配置
            if (typeof successModal === 'object') {
                return Modal.success({
                    title: TIP_TITLE,
                    content: tip,
                    ...successModal,
                });
            }

            return Modal.success({
                title: TIP_TITLE,
                content: successModal,
            });
        }

        notification.success({
            message: TIP,
            description: tip,
            duration: 2,
        });
    });
}
