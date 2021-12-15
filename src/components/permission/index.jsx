import React from 'react';
import PropTypes from 'prop-types';
import { hasPermission } from '@ra-lib/admin';

/**
 * 根据hasPermission 和code 来判断children是否显示
 * 一般用于前端权限控制是否显示某个按钮等，一般的项目权限控制到菜单级别即可，很少会控制到功能级别
 */

Permission.propTypes = {
    code: PropTypes.string.isRequired,
    useDisabled: PropTypes.bool,
};

Permission.defaultProps = {
    useDisabled: false,
};

export default function Permission(props) {
    let { code, useDisabled, children } = props;

    if (!useDisabled) {
        return hasPermission(code) ? children : null;
    }

    children = Array.isArray(children) ? children : [children];

    return children.map((item) => {
        const { key, ref } = item;
        return React.cloneElement(item, {
            disabled: !this.hasPermission(code),
            key,
            ref,
        });
    });
}
