import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import config from 'src/commons/config-hoc';

@config({
    event: true,
})
export default class HeaderFullScreen extends Component {
    static propTypes = {
        placement: PropTypes.any,
        element: PropTypes.any,
        toFullTip: PropTypes.any,
        exitFullTip: PropTypes.any,
        onFull: PropTypes.func,
        onExit: PropTypes.func,
        inFrame: PropTypes.bool,

    };
    static defaultProps = {
        element: document.documentElement,
        toFullTip: '全屏',
        exitFullTip: '退出全屏',
        onFull: () => void 0,
        onExit: () => void 0,
        inFrame: false,
        placement: 'bottom',
    };
    state = {
        fullScreen: false,
        toolTipVisible: false,
        prevStyle: {},
    };

    componentDidMount() {
        let fullScreen = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;

        this.props.addEventListener(document, 'fullscreenchange', this.handleFullScreenChange);
        this.props.addEventListener(document, 'mozfullscreenchange', this.handleFullScreenChange);
        this.props.addEventListener(document, 'webkitfullscreenchange', this.handleFullScreenChange);
        this.props.addEventListener(document, 'msfullscreenchange', this.handleFullScreenChange);
        this.props.addEventListener(document, 'click', () => this.handleToolTipHide(0));
        this.setState({ fullScreen: !!fullScreen });

        this.props.addEventListener(document, 'keydown', this.handleKeyDown);
    }

    handleKeyDown = (e) => {
        const { keyCode } = e;
        const { element, inFrame, onExit } = this.props;
        const { fullScreen, prevStyle } = this.state;
        if (keyCode === 27 && fullScreen && inFrame) {
            Object.entries(prevStyle).forEach(([ key, value ]) => {
                element.style[key] = value;
            });
            onExit && onExit();
        }
    };

    handleFullScreenClick = () => {
        const { element, inFrame, onFull, onExit } = this.props;
        const { fullScreen, prevStyle } = this.state;
        if (inFrame) {
            if (fullScreen) {
                Object.entries(prevStyle).forEach(([ key, value ]) => {
                    element.style[key] = value;
                });
                onExit && onExit();

                this.setState({ fullScreen: false });

            } else {
                const prevStyle = {};
                [ 'position', 'top', 'right', 'bottom', 'left' ].forEach(key => {
                    prevStyle[key] = element.style[key];
                });
                this.setState({ prevStyle });

                Object.entries({
                    position: 'fixed',
                    top: '50px',
                    right: 0,
                    bottom: 0,
                    left: 0,
                }).forEach(([ key, value ]) => {
                    element.style[key] = value;
                });
                onFull && onFull();
                this.setState({ fullScreen: true });
            }
            return;
        }
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
        const { onFull, onExit } = this.props;
        const { fullScreen } = this.state;
        !fullScreen ? onFull() : onExit();
        this.setState({ fullScreen: !fullScreen });
    };

    handleToolTipShow = () => {
        if (this.ST) clearTimeout(this.ST);
        this.setState({ toolTipVisible: true });
    };

    handleToolTipHide = (time = 300) => {
        this.ST = setTimeout(() => {
            this.setState({ toolTipVisible: false });
        }, time);
    };

    render() {
        const { className, toFullTip, exitFullTip, placement } = this.props;
        const { fullScreen, toolTipVisible } = this.state;
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
                <Tooltip visible={toolTipVisible} placement={placement} title={fullScreen ? exitFullTip : toFullTip}>
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
