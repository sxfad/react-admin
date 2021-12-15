import { Form } from 'antd';
import { ModalContent, FormItem } from '@ra-lib/admin';
import config from 'src/commons/config-hoc';

export default config({
    modal: {
        title: '修改密码',
        width: 500,
    },
})(function PasswordModal(props) {
    const { onOk, onCancel } = props;

    function handleSubmit(values) {
        alert('TODO 接口对接');
        console.log(props.ajax);
        onOk();
    }

    const layout = {
        labelCol: { flex: '100px' },
    };

    return (
        <Form onFinish={handleSubmit}>
            <ModalContent okHtmlType="submit" onCancel={onCancel}>
                <FormItem {...layout} type="password" label="原密码" name="oldPassword" required />
                <FormItem {...layout} type="password" label="新密码" name="password" required />
                <FormItem
                    {...layout}
                    type="password"
                    label="确认新密码"
                    name="rePassword"
                    required
                    dependencies={['password']}
                    rules={[
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('确认新密码与新密码不同！'));
                            },
                        }),
                    ]}
                />
            </ModalContent>
        </Form>
    );
});
