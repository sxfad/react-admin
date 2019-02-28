import React, {Component} from 'react';
import {Icon, Tooltip} from 'antd';
import config from '@/commons/config-hoc';
import {loadScript} from '@/commons';
import ColorPicker from '@/components/color-picker';
import theme from '@/theme';
import './style.less';

const ROUTE_BASE_NAME = process.env.PUBLIC_URL || '';

const BASE_NAME = ROUTE_BASE_NAME ? ROUTE_BASE_NAME.replace('/', '') : '';

const OLD_LESS_ID = `less:${BASE_NAME ? BASE_NAME + '-' : ''}color:old`;
const LESS_ID = `less:${BASE_NAME ? BASE_NAME + '-' : ''}color`;
const LESS_URL = `${ROUTE_BASE_NAME}/less.min.js`;

@config({
    ajax: true,
    event: true,
    connect: (state) => {
        return {
            primaryColor: state.system.primaryColor,
            loading: state.system.loading,
            local: state.system.i18n.setting,
        };
    },
})
export default class ThemeColorPicker extends Component {
    constructor(...props) {
        super(...props);

        // 快速生效
        const themeStyleContent = window.localStorage.getItem('theme-style-content');
        if (themeStyleContent) {
            const themeStyle = document.createElement('style');
            themeStyle.type = 'text/css';
            themeStyle.id = OLD_LESS_ID;
            themeStyle.innerHTML = themeStyleContent;
            document.body.insertBefore(themeStyle, document.body.firstChild);
        }

        const {primaryColor} = this.props;

        // .less文件加载完成之后，生成主题，localStorage中的主题有可能过时，需要覆盖
        if (primaryColor) this.handleColorChange(primaryColor);

        this.props.addEventListener(document, 'click', () => this.handleToolTipHide(0));
    }

    state = {
        toolTipVisible: false,
    };

    handleColorChange = color => {
        const changeColor = () => {
            window.less
                .modifyVars({
                    ...theme,
                    '@primary-color': color,
                })
                .then(() => {
                    Icon.setTwoToneColor({primaryColor: color});
                    this.props.action.system.setPrimaryColor(color);

                    // 先清除缓存样式
                    const oldStyle = document.getElementById(OLD_LESS_ID);
                    if (oldStyle) oldStyle.remove();

                    // 将生成之后的style标签插入body首部
                    // 由于每个页面的css也是异步加载（无论开发、还是生产），会导致样式插入在生成的style标签之后，导致主题失效
                    const lessColor = document.getElementById(LESS_ID);
                    if (!lessColor) return;

                    // document.head.appendChild(lessColor);
                    document.body.insertBefore(lessColor, document.body.firstChild);
                    window.localStorage.setItem('theme-style-content', lessColor.innerHTML);
                });
        };

        if (this.lessLoaded) {
            changeColor();
        } else {
            window.less = {
                logLevel: 2,
                async: true,
                javascriptEnabled: true,
                modifyVars: { // less.js加载完成就会触发一次转换，需要传入变量
                    ...theme,
                    '@primary-color': color,
                },
            };

            loadScript(LESS_URL).then(() => {
                this.lessLoaded = true;
                changeColor();
            });
        }
    };

    handleToolTipShow = () => {
        if (this.ST) clearTimeout(this.ST);
        this.setState({toolTipVisible: true});
    };

    handleToolTipHide = (time = 300) => {
        this.ST = setTimeout(() => {
            this.setState({toolTipVisible: false})
        }, time);
    };

    render() {
        const {
            primaryColor = theme['@primary-color'],
            className,
            local,
        } = this.props;
        const {toolTipVisible} = this.state;
        return (
            <div styleName="root" className={`theme-color-picker ${className}`}>
                <Tooltip
                    visible={toolTipVisible}
                    placement="bottom"
                    title={local.selectPrimaryColor}
                >
                    <div styleName="picker"
                         onMouseEnter={this.handleToolTipShow}
                         onMouseLeave={() => this.handleToolTipHide()}
                    >
                        <ColorPicker
                            type="sketch"
                            small
                            color={primaryColor}
                            position="bottom"
                            presetColors={[
                                '#F5222D',
                                '#FA541C',
                                '#FA8C16',
                                '#FAAD14',
                                '#FADB14',
                                '#A0D911',
                                '#52C41A',
                                '#13C2C2',
                                '#1890FF',
                                '#2F54EB',
                                '#722ED1',
                                '#EB2F96',
                            ]}
                            onChangeComplete={this.handleColorChange}
                        />
                    </div>
                </Tooltip>
                <Icon style={{marginLeft: 4}} type="caret-down"/>
            </div>
        );
    }
}
