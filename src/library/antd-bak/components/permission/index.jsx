import React from 'react';
import PropTypes from 'prop-types';

/**
 * 根据hasPermission 和code 来判断children是否显示
 * 一般用于前端权限控制是否显示某个按钮等
 */
export default class Permission extends React.Component {
    static propTypes = {
        code: PropTypes.string.isRequired,
        hasPermission: PropTypes.func.isRequired,
        useDisabled: PropTypes.bool,
    };

    static defaultProps = {
        useDisabled: false,
    };

    render() {
        let {code, hasPermission, useDisabled, children} = this.props;

        if (!useDisabled) {
            return hasPermission(code) ? children : null;
        }

        children = Array.isArray(children) ? children : [children];

        return children.map((item) => {
            const {key, ref} = item;
            return React.cloneElement(
                item,
                {
                    disabled: !hasPermission(code),
                    key,
                    ref,
                }
            );
        });
    }
}
