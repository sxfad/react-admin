import {notification} from 'antd';

export default function handleSuccess({data, tip}) {
    if (!tip) return;

    notification.success({
        message: '成功',
        description: tip,
        duration: 2,
    });
}
