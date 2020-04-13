import React, {Component} from 'react';
import {Helmet} from 'react-helmet';
import {Input, Button, Form} from 'antd';
import {LockOutlined, UserOutlined} from '@ant-design/icons';
import {setLoginUser, toHome} from 'src/commons';
import config from 'src/commons/config-hoc';
import Banner from './banner/index';
import './style.less';

@config({
    path: '/login',
    ajax: true,
    noFrame: true,
    noAuth: true,
})
export default class extends Component {
    state = {
        loading: false,
        message: '',
        isMount: false,
    };

    componentDidMount() {
        // 开发时方便测试，填写表单
        if (process.env.NODE_ENV === 'development' || process.env.BASE_NAME === '/react-admin-live') {
            this.form.setFieldsValue({userName: 'admin', password: '111'});
        }

        setTimeout(() => this.setState({isMount: true}), 300);
    }

    handleSubmit = (values) => {
        if (this.state.loading) return;

        const {userName, password} = values;
        const params = {
            userName,
            password,
        };

        setLoginUser({
            id: params.userName,
            name: params.userName,
        });
        toHome();

        /*
        this.setState({loading: true, message: ''});
        this.props.ajax.post('/mock/login', params, {errorTip: false})
            .then(res => {
                const {id, name} = res;
                setLoginUser({
                    id,
                    name,
                });
                toHome();
            })
            .catch(() => this.setState({message: '用户名或密码错误！'}))
            .finally(() => this.setState({loading: false}));
        */
    };

    render() {
        const {loading, message, isMount} = this.state;
        const formItemStyleName = isMount ? 'form-item active' : 'form-item';

        return (
            <div styleName="root" className="login-bg">
                <Helmet title="欢迎登陆"/>
                <div styleName="left">
                    <Banner/>
                </div>
                <div styleName="right">
                    <div styleName="box">
                        <Form
                            ref={form => this.form = form}
                            name="login"
                            className='inputLine'
                            onFinish={this.handleSubmit}
                        >
                            <div styleName={formItemStyleName}>
                                <div styleName="header">欢迎登录</div>
                            </div>
                            <div styleName={formItemStyleName}>
                                <Form.Item
                                    name="userName"
                                    rules={[{required: true, message: '请输入用户名'}]}
                                >
                                    <Input allowClear autoFocus prefix={<UserOutlined className="site-form-item-icon"/>} placeholder="用户名"/>
                                </Form.Item>
                            </div>
                            <div styleName={formItemStyleName}>
                                <Form.Item
                                    name="password"
                                    rules={[{required: true, message: '请输入密码'}]}
                                >
                                    <Input.Password prefix={<LockOutlined className="site-form-item-icon"/>} placeholder="密码"/>
                                </Form.Item>
                            </div>
                            <div styleName={formItemStyleName}>
                                <Form.Item shouldUpdate={true} style={{marginBottom: 0}}>
                                    {() => (
                                        <Button
                                            styleName="submit-btn"
                                            loading={loading}
                                            type="primary"
                                            htmlType="submit"
                                            disabled={
                                                !this.form?.isFieldsTouched(true) ||
                                                this.form?.getFieldsError().filter(({errors}) => errors.length).length
                                            }
                                        >
                                            登录
                                        </Button>
                                    )}
                                </Form.Item>
                            </div>
                        </Form>
                        <div styleName="error-tip">{message}</div>
                    </div>
                </div>
            </div>
        );
    }
}

