import React, {Component} from 'react';
import {Button} from 'antd';
import config from 'src/commons/config-hoc';
import './style.less';

@config({
    router: true,
})
export default class Error404 extends Component {
    state = {
        time: 9,
    };

    handleGoBack = () => {
        this.props.history.goBack();
    };

    componentDidMount() {
        this.bodyOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        if (this.props.history.length >= 2) {
            this.sI = setInterval(() => {
                const time = this.state.time - 1;

                if (time === 0) this.handleGoBack();

                this.setState({time});
            }, 1000);
        }
    }

    componentWillUnmount() {
        clearInterval(this.sI);
        document.body.style.overflow = this.bodyOverflow;
    }

    render() {
        const {history} = this.props;
        const {time} = this.state;
        return (
            <div styleName="root">
                <div styleName="left"/>
                <div styleName="right">
                    <div styleName="right-inner">
                        <div styleName="code">404</div>
                        <div styleName="message">页面不存在</div>
                        <div styleName="buttons">
                            <Button type="primary" onClick={() => this.props.history.replace('/')}>返回首页</Button>
                            {history.length >= 2 ? <Button type="primary" onClick={this.handleGoBack}>返回上一步（{time})</Button> : null}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
