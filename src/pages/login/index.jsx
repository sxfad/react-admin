import React, {Component} from 'react'
import {Helmet} from 'react-helmet';
import {Form, Icon, Input, Button} from 'antd';
import {setLoginUser} from '@/commons';
import config from '@/commons/config-hoc';
import {ROUTE_BASE_NAME} from '@/router/AppRouter';
import Banner from './banner/index';
import './style.less'

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}

@Form.create()
@config({
    path: '/login',
    noFrame: true,
    noAuth: true,
    keepAlive: false,
})
export default class extends Component {
    state = {
        loading: false,
        message: '',
        isMount: false,
    };

    componentDidMount() {
        const {form: {validateFields, setFieldsValue}} = this.props;
        // 一开始禁用提交按钮
        validateFields(() => void 0);

        // 开发时方便测试，填写表单
        if (process.env.NODE_ENV === 'development') {
            setFieldsValue({userName: 'admin', password: '111'});
        }

        setTimeout(() => this.setState({isMount: true}), 200);
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({loading: true, message: ''});

                /**
                 * 加密传输用户名密码方案：
                 *   1 使用https；
                 *   2 使用非对称加密（RSA），后端提供公钥，前端加密，后端使用私钥解密；
                 * */
                    // TODO 发送请求进行登录，以下为前端硬编码，模拟请求
                const {userName, password} = values;

                setTimeout(() => {
                    this.setState({loading: false});

                    // 当需要指定登陆用户时，前端可以写死
                    let userA = userName === 'admin' && password === '111';
                    let userB = userName === 'admin2' && password === '222';
                    if (userA || userB) {
                        setLoginUser({
                            id: 'tempUserId',
                            name: 'Admin',
                        });
                        // 跳转页面，优先跳转上次登出页面
                        const lastHref = window.sessionStorage.getItem('last-href');

                        // 强制跳转 进入系统之后，需要一些初始化工作，需要所有的js重新加载
                        window.location.href = lastHref || `${ROUTE_BASE_NAME}/`;
                        // this.props.history.push(lastHref || '/');
                    } else {
                        this.setState({message: '用户名或密码错误！'});
                    }
                }, 1000)
            }
        });
    };

    render() {
        const {
            getFieldDecorator,
            getFieldsError,
            getFieldError,
            isFieldTouched,
            getFieldsValue,
        } = this.props.form;
        const {loading, message} = this.state;

        const {userName, password} = getFieldsValue();

        // Only show error after a field is touched.
        const userNameError = isFieldTouched('userName') && getFieldError('userName');
        const passwordError = isFieldTouched('password') && getFieldError('password');

        const {isMount} = this.state;
        const formItemStyleName = isMount ? 'form-item active' : 'form-item';

        return (
            <div styleName="root" className="login-bg">

                <Helmet title="欢迎登陆"/>
                {/*<div style={{position: 'fixed', bottom: -1000}}><Color/></div>*/}
                <div styleName="left">
                    <Banner/>
                </div>
                <div styleName="right">
                    <div styleName="box">
                        <Form onSubmit={this.handleSubmit} className='inputLine'>
                            <div styleName={formItemStyleName}>
                                <div styleName="header">欢迎登录</div>
                            </div>
                            <div styleName={formItemStyleName}>
                                <Form.Item
                                    validateStatus={userNameError ? 'error' : ''}
                                    help={userNameError || ''}
                                >
                                    {getFieldDecorator('userName', {
                                        rules: [{required: true, message: '请输入用户名'}],
                                    })(
                                        <Input allowClear autoFocus prefix={<Icon type="user" style={{fontSize: 13}}/>} placeholder="用户名"/>
                                    )}
                                </Form.Item>
                            </div>
                            <div styleName={formItemStyleName}>
                                <Form.Item
                                    validateStatus={passwordError ? 'error' : ''}
                                    help={passwordError || ''}
                                >
                                    {getFieldDecorator('password', {
                                        rules: [{required: true, message: '请输入密码'}],
                                    })(
                                        <Input.Password prefix={<Icon type="lock" style={{fontSize: 13}}/>} placeholder="密码"/>
                                    )}
                                </Form.Item>
                            </div>
                            <div styleName={formItemStyleName}>
                                <Button
                                    styleName="submit-btn"
                                    loading={loading}
                                    type="primary"
                                    htmlType="submit"
                                    disabled={hasErrors(getFieldsError())}
                                >
                                    登录
                                </Button>
                            </div>
                        </Form>
                        <div styleName="error-tip">{message}</div>
                        <div styleName="tip">
                            <span>用户名：{userName} </span>
                            <span>密码：{password}</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

