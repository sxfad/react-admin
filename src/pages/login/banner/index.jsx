import React, {Component} from 'react';
import loginBanner from './login_banner.png';
import logo from './logo.png';
import './style.less';

export default class Banner extends Component {
    render() {
        return (
            <div styleName="root">
                <div styleName="logo">
                    <img alt="logo" src={logo}/>
                    <i>React Admin</i>
                </div>
                <div styleName="banner">
                    <img alt="宣传图" src={loginBanner}/>
                </div>
            </div>
        );
    }
}
