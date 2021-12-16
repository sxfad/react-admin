import React, {useState, useRef, useEffect, useCallback} from 'react';
import {Helmet} from 'react-helmet';
import {Button, Form} from 'antd';
import {LockOutlined, UserOutlined, FileImageOutlined, MessageOutlined} from '@ant-design/icons';
import {FormItem, setLoginUser} from '@ra-lib/admin';
import config from 'src/commons/config-hoc';
import {toHome} from 'src/commons';
import {Logo} from 'src/components';
import {IS_DEV, IS_PREVIEW, IS_TEST} from 'src/config';
import s from './style.less';

// 开发模式下，自动填充表单数据
const formValues = {
    account: 'admin',
    password: '123456',
    imageCode: '0000',
    messageCode: '0000',
};

export default config({
    path: '/f/login',
    auth: false,
    layout: false,
})(function Login(props) {
    const login = props.ajax.usePost('/login');
    const [message, setMessage] = useState();
    const [isMount, setIsMount] = useState(false);
    const imageCodeRef = useRef(null);
    const [form] = Form.useForm();

    const handleFetchImageCode = useCallback(async () => {
        // 测试图片验证码
        const testImages = [
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAAAoCAIAAADmAupWAAABv0lEQVR42u3ZO04DMRAA0E3BCahScABOgYTEJWg4AhLiHpSkzhWouQDUaYKoOAhYmmBZHnt+zljZrK0ponxW+/ybWWf6XVibTuQ+Pm8ulwXuZh7g/7Z9+5IEcemn2zsccvPq4T3Gx9VPFsWfv+yei+ELLjoJMwCuH7/hRTBjXoqv3XBNm7EnVy2+dWKsghlIwZwKcRi00cyAiemnwuC+wBcMkmAOAWD8KQtmO6IK1mJSlXBVF8EQYCa+QExs2nwAY4xkhA2NAGcY1twEtk1pV3DNPCewcD6nmAAO7BawaJc2pNwjDm+GSc2qNVxLxZM2J3kML4uJGcuQmfhKq6W6smnpQY4Zywss6YLjajG4GJClbbWH+uHBAJaX0Kw5/QKYtWuYKS1Zs5wq1BJs/H62dbfu0o1gM1XeEbCNSdi+YCcqsYezZkewn5ZOWrTZDpYPb08tbRZtWkWP6jHYRjIk51SFl7QoLTkdcciraNVDP1YFs+6Ix1ZjdQDLky02W0pLVdbVggm2IdkS1JM7psXt4n6PY37n0kWGh603uCdjlv88DPAAD/AAD/C5gl836xiLG+EUj7tgEVM6lY81fO7tD3VbH+gso9PWAAAAAElFTkSuQmCC',
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAAAoCAIAAADmAupWAAAB2ElEQVR42u3Zu00EMRAGYEskZBRBCaQUcBEZBdAACRFC2pgmrguKoAUSCiAjgfDYk8F4x+OZf2zv3nLYmmjPOunbGT/X7f5Zcx3cwY3acHo+xh8ADy/PcSB/endzzUZgI/jh4iMOnPRw9pgGBCZUkJ3Txuw456mcUEE260zNrkArmFUtMRP5PvJawaxqg9mpWuQ5AasvQirjadpvtyc+QLD6LhyuBc1IqcuDNiD3zh+5nGSWyprXAp4gp6S04K0zswRWPa3AsTCu2Jzn+1dshj882DtjoTAzq6uUaXlTJi0Vo4Lv359ytapMV2K5Cm9EZktgJHtyn1FLalWdmZH0gn1UbTMwKwSXovnAgfr2+snvtExgMiBDJZu2HPOB49xWgX/n1agPGbfy3mtuMCnjWGsGsx0ELbgIy5jLq03Zdto/bAxGtMuA2bMR0daCQW0NeNQi+8rcXroKXKytBDfUGsCttDVg6zlJB+fM5CTMahscDBNY8/QqYDYErfXcr95yyOmVz/ojGL3isWpBsH55lgdbbzmIVr/TYi901HFbTGXNXlt2iWUGq2egBZpfkApabvQawMtrDwk+Ju16P7V0cBvtSsHzpfeowIh21z+XdnAHd3AHd/Cq2hc1CxHRUsOCMgAAAABJRU5ErkJggg==',
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAAAoCAIAAADmAupWAAAB1UlEQVR42u3YPU5DMQwH8I5MiIEZcQwugOAKnIGJmaniEHAddkYGhDgAKwsrpIoURY6f/bed99H2RR5eP6T2Jztxks3fkY3NCj6c8fF0voKHwW8/73iov335+5XD9I9vH0/aEL5/cf1aImnrlyVGBBdkHRGqyvaDg1qWCmpVKqL1ZFgePvDn95VVy37BN3v7gIVirp8TVdUScPflyg/G16oMTlSkpHtpWbC/pE3anFhkDk+jNfdhXFtqGFy0xgPXWhvYpM0Pp/c34BLdgvH2K4CJ1gAGtWRxAsEEZm1IuLYzmKzDtRYH+5pwZ7CqZbtOBCx8CoJZLQRGtO2bSdtxxQLBqlYHy1phO8Gm9+Xhjo2+YEGrgOX9Y6EOMdpQMxxsWmT/bANHGKZ67gVGtDvwEIPNLbIlztp5weYrHraYkd1/EMx6HPVsA7da8KxTa1vw89kWbEuOnlQfgM2XeAQMUrOQLM45EjWFnOrglgNMrwLGE8u2IkKN7LeQHSWiZcC11npMqcEt1TqZ8TMDXs98hq2JJbM3U2e/joXAPmoBT08Ngd3Uol3UhbsEjiR2lhp2a3fg/aU6wftLnQi8HKpDawMvijo6eGnUKTJ8ANoVfARjBR/6+AdF7ZppMTGUVgAAAABJRU5ErkJggg==',
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAAAoCAIAAADmAupWAAABh0lEQVR42u3YTU7DQAwF4NyAS8AFumTDEgmJW1TiEGWNWHEFbsER2FCp4gpcgiU/qjRyx/Gb58kMCa0jrzKjSl/tSWIPXyd2DQEO8MmCb3brfRR33m4u+LB+5Gx1EK7r7fpehgOckDJ6gzOqi51RNXtwUefVFs1Am8ztwa5/BGiZ+5YW3C+ANb4hmNQyq5ZWr/6CH7Yf/EnupG0Fvvy8SzE/uFprbZC8DOnI8OP7ZpmheXi/CcZJbpJe/q0LsmeVADi984CLWm3TxWnVPH5cUeDzp5d9dAKD1IG3Tkewlv9ENZh5riwFLDMs8Sn5DA8X82xgy2zVs8Rb2Sse3YnvJBJsfmm5wBY+JZ/ph/4f+Or1WYb2M9qlg7UQPJbJk/83X9F5e1hd0nwzZPkBqZh8AB5dOuiWtNkLdh1diR+FkZ3wKMwaeuRgqw0m5S4wSH7zvr87uOITRfIy/PTJjjnTmgKuTi+Y74CTXzQfyZiWwR/tXLpCHoP4AAc4wAEOcIADHOAAB7ju+gYSW9gRrGtiPAAAAABJRU5ErkJggg==',
        ];

        const index = Math.floor(Math.random() * (testImages.length + 2));
        return testImages[index];
    }, []);

    const handleSendMessage = useCallback(() => {
        // 返回true 或 promise.resolve(true) 则开始倒计时并按钮不可点击 返回其他不倒计时
        return true;
    }, []);

    const handleSubmit = useCallback(
        (values) => {
            if (login.loading) return;

            const params = {
                ...values,
            };

            alert('TODO 登录');
            login.run = async () => ({id: 1, name: '测试', token: 'test'});

            login
                .run(params, {errorTip: false})
                .then((res) => {
                    const {id, name, token, ...others} = res;
                    setLoginUser({
                        id, // 必须字段
                        name, // 必须字段
                        token,
                        ...others,
                        // 其他字段按需添加
                    });
                    toHome();
                })
                .catch((err) => {
                    console.error(err);
                    setMessage(err.response?.data?.message || '用户名或密码错误');
                    // 可以刷新图片验证码
                    imageCodeRef.current.refresh();
                });
        },
        [login],
    );

    useEffect(() => {
        // 开发时默认填入数据
        if (IS_DEV || IS_TEST || IS_PREVIEW) {
            form.setFieldsValue(formValues);
        }

        setTimeout(() => setIsMount(true), 300);
    }, [form]);

    const formItemClass = [s.formItem, {[s.active]: isMount}];

    return (
        <div className={s.root}>
            <Helmet title="欢迎登录" />
            <div className={s.logo}>
                <Logo />
            </div>
            <div className={s.box}>
                <Form form={form} name="login" onFinish={handleSubmit}>
                    <div className={formItemClass}>
                        <h1 className={s.header}>欢迎登录</h1>
                    </div>
                    <div className={formItemClass}>
                        <FormItem
                            name="account"
                            allowClear
                            autoFocus
                            prefix={<UserOutlined />}
                            placeholder="请输入用户名"
                            rules={[{required: true, message: '请输入用户名！'}]}
                        />
                    </div>
                    <div className={formItemClass}>
                        <FormItem
                            type="password"
                            name="password"
                            prefix={<LockOutlined />}
                            placeholder="请输入密码"
                            rules={[{required: true, message: '请输入密码！'}]}
                        />
                    </div>
                    <div className={formItemClass}>
                        <FormItem
                            type="image-code"
                            name="imageCode"
                            prefix={<FileImageOutlined />}
                            placeholder="请输入图片验证码"
                            src={handleFetchImageCode}
                            ref={imageCodeRef}
                            rules={[{required: true, message: '请输入图片验证码！'}]}
                        />
                    </div>
                    <div className={formItemClass}>
                        <FormItem
                            type="message-code"
                            name="messageCode"
                            prefix={<MessageOutlined />}
                            placeholder="请输入短信验证码"
                            onSend={handleSendMessage}
                            buttonType="text"
                            rules={[{required: true, message: '请输入短信验证码！'}]}
                        />
                    </div>
                    <div className={formItemClass}>
                        <FormItem noStyle shouldUpdate style={{marginBottom: 0}}>
                            {() => (
                                <Button
                                    className={s.submitBtn}
                                    loading={login.loading}
                                    type="primary"
                                    htmlType="submit"
                                    disabled={
                                        // 用户没有操作过，或者没有setFieldsValue
                                        !form.isFieldsTouched(true) ||
                                        // 表单中存在错误
                                        form.getFieldsError().filter(({errors}) => errors.length).length
                                    }
                                >
                                    登录
                                </Button>
                            )}
                        </FormItem>
                    </div>
                </Form>
                <div className={s.errorTip}>{message}</div>
            </div>
        </div>
    );
});
