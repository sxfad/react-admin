import React from 'react';
import PropTypes from 'prop-types';
import config from 'src/commons/config-hoc';

/**
 * 根据hasPermission 和code 来判断children是否显示
 * 一般用于前端权限控制是否显示某个按钮等，一般的项目权限控制到菜单级别即可，很少会控制到功能级别
 */
@config({
    connect: state => ({permissions: state.system.permissions || []}),
})
export default class Permission extends React.Component {
    static propTypes = {
        code: PropTypes.string.isRequired,
        useDisabled: PropTypes.bool,
    };

    static defaultProps = {
        useDisabled: false,
    };

    hasPermission = () => {
        const {code, permissions} = this.props;
        return permissions.includes(code);
    };

    render() {
        let {code, useDisabled, children} = this.props;

        if (!useDisabled) {
            return this.hasPermission(code) ? children : null;
        }

        children = Array.isArray(children) ? children : [children];

        return children.map((item) => {
            const {key, ref} = item;
            return React.cloneElement(
                item,
                {
                    disabled: !this.hasPermission(code),
                    key,
                    ref,
                },
            );
        });
    }
}
