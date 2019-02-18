import React, {Component} from 'react';
import {Spin} from "antd";
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

export default class Index extends Component {
    constructor(...props) {
        super(...props);
        NProgress.start();
    }

    componentWillUnmount() {
        NProgress.done();
    }

    render() {
        const style = {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
        };
        return (
            <div style={style}>
                <Spin spinning size="large"/>
            </div>
        );
    }
}
