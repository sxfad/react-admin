import React, {Component} from 'react';
import {Avatar} from "antd";
import PropTypes from 'prop-types';

/**
 * 根据用户信息（name src）获取用户头像
 * 如果src存在，返回img头像
 * 如果src不存在，返回name[0] 待背景颜色的span（只有背景色，无其他样式）
 */
export default class UserAvatar extends Component {
    static propTypes = {
        name: PropTypes.string,
        src: PropTypes.string,
    };

    render() {
        const {name = 'unknown', src, ...others} = this.props;

        if (src) return <Avatar {...others} src={src}/>;

        const nameFirstChar = name[0];
        const colors = [
            'rgb(80, 193, 233)',
            'rgb(255, 190, 26)',
            'rgb(228, 38, 146)',
            'rgb(169, 109, 243)',
            'rgb(253, 117, 80)',
            'rgb(103, 197, 12)',
            'rgb(80, 193, 233)',
            'rgb(103, 197, 12)',
        ];
        const backgroundColor = colors[nameFirstChar.charCodeAt(0) % colors.length];

        if (!others.style) others.style = {};

        others.style.backgroundColor = backgroundColor;
        others.style.verticalAlign = 'middle';

        return (
            <Avatar{...others}>
                {nameFirstChar}
            </Avatar>
        );
    }
}
