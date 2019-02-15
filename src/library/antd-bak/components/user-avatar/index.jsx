import React, {Component} from 'react';
import PropTypes from 'prop-types';

/**
 * 根据用户信息（name avatar）获取用户头像
 * 如果avatar存在，返回img头像
 * 如果avatar不存在，返回name[0] 待背景颜色的span（只有背景色，无其他样式）
 */
export default class UserAvatar extends Component {
    static propTypes = {
        name: PropTypes.string,
        avatar: PropTypes.string,
    };

    static defaultProps = {
        name: '匿名',
        avatar: '',
    };

    render() {
        const {name, avatar, style, ...others} = this.props;

        if (avatar) {
            return (
                <img
                    {...others}
                    style={{
                        width: '35px',
                        height: '35px',
                        borderRadius: '50%',
                        ...style,
                    }}
                    src={avatar}
                    alt="用户头像"
                />
            );
        }

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

        return (
            <span
                {...others}
                style={{
                    backgroundColor,
                    display: 'inline-block',
                    width: '35px',
                    height: '35px',
                    lineHeight: '35px',
                    textAlign: 'center',
                    borderRadius: '50%',
                    ...style,
                }}
            >{name[0]}</span>
        );
    }
}
