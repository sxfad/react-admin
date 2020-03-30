import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './index.less';

export default class ToolBar extends Component {
    static propTypes = {
        right: PropTypes.bool,
    };

    static defaultProps = {
        right: false,
    };

    render() {
        const {style = {}, right, children, ...others} = this.props;

        if (right && !style.justifyContent) {
            style.justifyContent = 'flex-end';
        }

        return (
            <div className="tool-bar-root" style={style} {...others}>
                {children}
            </div>
        );
    }
}
