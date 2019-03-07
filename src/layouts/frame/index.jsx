import React, {Component} from 'react';
import {connect} from '@/models/index';
import FrameBig from '@/layouts/frame-big';
import FrameSmall from '@/layouts/frame-small';

@connect(state => {
    const {smallFrame} = state.system;
    return {
        smallFrame,
    };
})
export default class FrameTopSideMenu extends Component {
    render() {
        const {smallFrame, ...others} = this.props;
        return smallFrame ? <FrameSmall {...others}/> : <FrameBig {...others}/>;
    }
}
