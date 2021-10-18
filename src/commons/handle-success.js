import {notification, Modal} from 'antd';

export default function handleSuccess({data, tip, options = {}}) {
    const {successModal} = options;

    if (!tip && !successModal) return;

    // 避免卡顿
    setTimeout(() => {
        if (successModal) {
            if (successModal === true) {
                return Modal.success({
                    title: '温馨提示',
                    content: tip,
                });
            }
            if (typeof successModal === 'object') {
                return Modal.success({
                    title: '温馨提示',
                    content: tip,
                    ...successModal,
                });
            }

            return Modal.success({
                title: '温馨提示',
                content: successModal,
            });
        }
        notification.success({
            message: '成功',
            tip: tip,
            duration: 2,
        });
    });
}
