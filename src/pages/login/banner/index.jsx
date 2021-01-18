import React, { Component } from 'react';
import './style.less';
import logo from './logo.png';
import star from './star.png';
import cfg from 'src/config';

const { appName } = cfg;

export default class index extends Component {
    state = {
        isMount: false,
    };

    componentDidMount() {
        this.setState({ isMount: true });
    }

    render() {
        const { isMount } = this.state;

        return (
            <div styleName={isMount ? 'root active' : 'root'}>
                <div styleName="star">
                    <img src={star} alt="星星"/>
                </div>
                <div styleName="logo">
                    <img src={logo} alt="图标"/>
                    <span>{appName}</span>
                </div>
            </div>
        );
    }
}
