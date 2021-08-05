import React, {useState, useEffect} from 'react';
import {Helmet} from 'react-helmet';
import {Button, Form} from 'antd';
import {LockOutlined, UserOutlined} from '@ant-design/icons';
import {FormItem, setLoginUser} from '@ra-lib/admin';
import config from 'src/commons/config-hoc';
import {toHome} from 'src/commons';
import {Logo} from 'src/components';
import styles from './style.less';

export default config({
    path: '/portal/login',
    auth: false,
    layout: false,
})(function Login(props) {
    const p = {
        phoneCode: '0000',
        captchaCode: '0000',
        captchaId: '578721818865569792',
        srandNumFlagId: 1,
        isPhone: false,
        isCheck: true,
    };
    const queryString = Object.entries(p).map(([key, value]) => `${key}=${value}`).join('&');
    const login = props.ajax.usePost('/api/login/login?' + queryString, null, {baseURL: 'portal', errorTip: false});

    const [message, setMessage] = useState();
    const [isMount, setIsMount] = useState(false);
    const [form] = Form.useForm();

    function handleSubmit(values) {
        if (login.loading) return;

        const {account, password} = values;
        const params = {
            loginName: account,
            password,
        };

        login.run(params, {errorTip: false})
            .then(res => {
                const {id, loginName: name, token, ...others} = res;
                setLoginUser({
                    id,     // 必须字段
                    name,   // 必须字段
                    token,
                    ...others,
                    // 其他字段按需添加
                });
                toHome();
            })
            .catch((err) => {
                console.error(err);
                setMessage(err.response?.data?.message || '用户名或密码错误');
            });
    }

    useEffect(() => {
        // 开发时默认填入数据
        if (process.env.NODE_ENV === 'development' || process.env.REACT_APP_PREVIEW) {
            form.setFieldsValue({
                account: 'P101282',
                password: '0000',
            });
        }

        setTimeout(() => setIsMount(true), 300);
    }, [form]);

    const formItemClass = [styles.formItem, {[styles.active]: isMount}];

    return (
        <div className={styles.root}>
            <Helmet title="欢迎登录"/>
            <div className={styles.logo}>
                <Logo/>
            </div>
            <div className={styles.box}>
                <Form
                    form={form}
                    name="login"
                    onFinish={handleSubmit}
                >
                    <div className={formItemClass}>
                        <h1 className={styles.header}>欢迎登录</h1>
                    </div>
                    <div className={formItemClass}>
                        <FormItem
                            name="account"
                            allowClear
                            autoFocus
                            prefix={<UserOutlined/>}
                            placeholder="请输入用户名"
                            required
                        />
                    </div>
                    <div className={formItemClass}>
                        <FormItem
                            type="password"
                            name="password"
                            prefix={<LockOutlined/>}
                            placeholder="请输入密码"
                            required
                        />
                    </div>
                    <div className={formItemClass}>
                        <FormItem noStyle shouldUpdate style={{marginBottom: 0}}>
                            {() => (
                                <Button
                                    className={styles.submitBtn}
                                    loading={login.loading}
                                    type="primary"
                                    htmlType="submit"
                                    disabled={
                                        // 用户没有操作过，或者没有setFieldsValue
                                        !form.isFieldsTouched(true)
                                        // 表单中存在错误
                                        || form.getFieldsError().filter(({errors}) => errors.length).length
                                    }
                                >
                                    登录
                                </Button>
                            )}
                        </FormItem>
                    </div>
                </Form>
                <div className={styles.errorTip}>{message}</div>
            </div>
        </div>
    );
});

