import {notification} from 'antd';

export default function handleSuccess({data, tip}) {
    if (!tip) return;

    // 避免卡顿
    setTimeout(() => {
        notification.success({
            message: '成功',
            description: tip,
            duration: 2,
        });
    });
}
