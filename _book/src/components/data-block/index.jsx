import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Icon} from 'antd';
import CountUp from 'react-countup';
import './style.less';

export default class DataBlock extends Component {
    static propTypes = {
        color: PropTypes.string,
        icon: PropTypes.string,
        count: PropTypes.number,
        tip: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    };


    render() {
        const {
            color,
            icon,
            count,
            tip,
        } = this.props;

        const blockStyle = {
            border: `1px solid ${color}`,
        };

        const iconStyle = {
            background: color,
        };

        return (
            <div styleName="data-block" style={blockStyle}>
                <div styleName="icon" style={iconStyle}>
                    <Icon type={icon}/>
                </div>
                <div styleName="message">
                    <div styleName="count">
                        <CountUp end={count}/>
                    </div>
                    <div styleName="tip">{tip}</div>
                </div>
            </div>
        );
    }
}
