import React, {Component} from 'react';
import {FullscreenExitOutlined, FullscreenOutlined} from '@ant-design/icons';
import {Tooltip} from 'antd';
import config from 'src/commons/config-hoc';

@config({
    event: true,
})
export default class HeaderFullScreen extends Component {
    state = {
        fullScreen: false,
        toolTipVisible: false,
    };

    componentDidMount() {
        let fullScreen = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;

        this.props.addEventListener(document, 'fullscreenchange', this.handleFullScreenChange);
        this.props.addEventListener(document, 'mozfullscreenchange', this.handleFullScreenChange);
        this.props.addEventListener(document, 'webkitfullscreenchange', this.handleFullScreenChange);
        this.props.addEventListener(document, 'msfullscreenchange', this.handleFullScreenChange);
        this.props.addEventListener(document, 'click', () => this.handleToolTipHide(0));
        this.setState({fullScreen: !!fullScreen});
    }

    handleFullScreenClick = () => {
        const {fullScreen} = this.state;
        if (fullScreen) {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
        } else {
            const element = document.documentElement;
            if (element.requestFullscreen) {
                element.requestFullscreen();
            } else if (element.mozRequestFullScreen) {
                element.mozRequestFullScreen();
            } else if (element.msRequestFullscreen) {
                element.msRequestFullscreen();
            } else if (element.webkitRequestFullscreen) {
                element.webkitRequestFullScreen();
            }
        }
    };

    handleFullScreenChange = () => {
        const {fullScreen} = this.state;
        this.setState({fullScreen: !fullScreen});
    };

    handleToolTipShow = () => {
        if (this.ST) clearTimeout(this.ST);
        this.setState({toolTipVisible: true});
    };

    handleToolTipHide = (time = 300) => {
        this.ST = setTimeout(() => {
            this.setState({toolTipVisible: false});
        }, time);
    };

    render() {
        const {className} = this.props;
        const {fullScreen, toolTipVisible} = this.state;
        return (
            <div
                className={className}
                style={{
                    fontSize: 14,
                }}
                onClick={this.handleFullScreenClick}
                onMouseEnter={this.handleToolTipShow}
                onMouseLeave={() => this.handleToolTipHide()}
            >
                <Tooltip visible={toolTipVisible} placement="bottom" title={fullScreen ? '退出全屏' : '全屏'}>
                    {fullScreen ? (
                        <FullscreenExitOutlined/>
                    ) : (
                        <FullscreenOutlined/>
                    )}
                </Tooltip>
            </div>
        );
    }
}
