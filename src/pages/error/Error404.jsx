import React, {Component} from 'react';
import {Link} from 'react-router-dom'
import config from '@/commons/config-hoc';
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
            <div styleName="root error404">
                <div styleName="container">
                    <div styleName="header">
                        <h3>页面不存在</h3>
                    </div>
                    <p styleName="intro">
                        跳转到<Link to="/"> 首页 </Link>
                        {history.length >= 2 ? <span>或者返回 <a onClick={this.handleGoBack}>上一步（{time}）</a></span> : null}
                    </p>
                </div>
            </div>
        );
    }
}
