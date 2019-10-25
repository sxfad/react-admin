import {notification} from 'antd';

export default function handleSuccess({successTip}) {
    successTip && notification.success({
        message: '成功',
        description: successTip,
        duration: 2,
    })
}
