import React, {Component} from 'react';
import {Menu, Dropdown, Icon} from 'antd';
import i18n from '../../i18n';
import {connect} from '../../models';
import './style.less';

const Item = Menu.Item;

@connect(state => ({
    local: state.system.local,
}))
export default class HeaderUser extends Component {
    static defaultProps = {
        theme: 'default',
    };

    handleMenuClick = ({key}) => {
        this.props.action.system.setLocal(key);
    };

    render() {
        const {className, theme, local, style} = this.props;
        const menu = (
            <Menu
                styleName="menu"
                theme={theme}
                onClick={this.handleMenuClick}
            >
                {i18n.map(item => (<Item key={item.local}>{item.label}</Item>))}
            </Menu>
        );
        const localI1n8 = i18n.find(item => item.local === local) || {};
        return (
            <div
                styleName="i18n-select"
                ref={node => this.root = node}
                style={style}
            >
                <Dropdown
                    overlay={menu}
                    getPopupContainer={() => (this.root || document.body)}
                >
                    <span styleName="i18n-label" className={className}>
                        <span>{localI1n8.name}</span>
                        <Icon type="caret-down"/>
                    </span>
                </Dropdown>
            </div>
        );
    }
}
