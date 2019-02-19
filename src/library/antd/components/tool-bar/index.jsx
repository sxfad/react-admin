import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Button, Icon} from 'antd';
import './index.less';

export function ToolItem(props) {
    const {items} = props;

    return items.map((item, index) => {
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
    };

    static defaultProps = {
        items: [],
    };

    render() {
        const {items, style} = this.props;
        return (
            <div className="tool-bar-root" style={style}>
                <ToolItem items={items}/>
            </div>
        );
    }
}
