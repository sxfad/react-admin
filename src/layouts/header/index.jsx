import React, {Component} from 'react';
import {connect} from '@/models/index';
import HeaderBig from '@/layouts/header-big';
import HeaderSmall from '@/layouts/header-small';

@connect(state => {
    const {smallFrame} = state.system;
    return {
        smallFrame,
    };
})
export default class FrameTopSideMenu extends Component {
    render() {
        const {smallFrame, ...others} = this.props;
        return smallFrame ? <HeaderSmall {...others}/> : <HeaderBig {...others}/>;
    }
}
