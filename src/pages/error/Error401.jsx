import React, {Component} from 'react';
import {toLogin} from "@/commons";
import config from '@/commons/config-hoc';
import './style.less';

@config({
    router: true,
})
export default class Error401 extends Component {
    state = {
        time: 9,
    };

    handleGoBack = () => {
        this.props.history.goBack();
    };

    componentDidMount() {
        this.bodyOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        this.sI = setInterval(() => {
            const time = this.state.time - 1;

            if (time === 0) toLogin();

            this.setState({time});
        }, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.sI);
        document.body.style.overflow = this.bodyOverflow;
    }

    render() {
        const {history} = this.props;
        const {time} = this.state;
        return (
            <div styleName="root error401">
                <div styleName="container">
                    <div styleName="header">
                        <h3>需要登录</h3>
                    </div>
                    <p styleName="intro">
                        跳转到<a onClick={toLogin}> 登录页面({time}) </a>
                        {history.length >= 2 ? <span>或者返回 <a onClick={this.handleGoBack}>上一步</a></span> : null}
                    </p>
                </div>
            </div>
        );
    }
}
