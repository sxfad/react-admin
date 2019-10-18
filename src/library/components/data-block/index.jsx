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
            iconBgColor,
            color,
            color2,
            icon,
            count,
            tip,
        } = this.props;

        // const blockStyle = {
        //     border: `1px solid ${color}`,
        // };

        const blockStyle = {
            background: `linear-gradient(to left,${color},${color2})`,
        };

        const iconStyle = {
            background: iconBgColor,
        };

        return (
            <div className="data-block-root" style={blockStyle}>
                <div className="bgimg">
                    <div className="icon" style={iconStyle}>
                        <Icon type={icon}/>
                    </div>
                    <div className="message">
                        <div className="count">
                            <CountUp end={count}/>
                        </div>
                        <div className="tip">{tip}</div>
                    </div>
                </div>
            </div>
        );
    }
}
