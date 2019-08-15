import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Button, Icon} from 'antd';
import './index.less';

export function ToolItem(props) {
    const {items} = props;

    return items.map((item, index) => {
        if (!item) return null;

        const {
            key,
            type = 'primary',
            icon,
            text,
            visible = true,
            disabled,
            onClick = () => void 0,
            component,
            ...others
        } = item;
        const itemKey = key || index;

        if (!visible) return null;

        if (typeof component === 'function') return <div key={itemKey}>{component()}</div>;

        if (component) return <div key={itemKey}>{component}</div>;

        return (
            <Button
                key={itemKey}
                type={type}
                disabled={disabled}
                onClick={onClick}
                {...others}
            >
                {icon ? (
                    <Icon type={icon}/>
                ) : null}
                {text}
            </Button>
        );
    })
}

export default class ToolBar extends Component {
    static propTypes = {
        items: PropTypes.array,
        right: PropTypes.bool,
    };

    static defaultProps = {
        items: [],
        right: false,
    };

    render() {
        const {items, style = {}, right, children, ...others} = this.props;

        if (right && !style.justifyContent) {
            style.justifyContent = 'flex-end';
        }

        return (
            <div className="tool-bar-root" style={style} {...others}>
                {children ? children : <ToolItem items={items}/>}
            </div>
        );
    }
}
