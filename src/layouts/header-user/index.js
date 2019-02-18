import React, {Component} from 'react';
import {Menu, Dropdown, Icon} from 'antd';
import {Link} from 'react-router-dom';
import {toLogin, getLoginUser} from '@/commons';
import {connect} from '@/models';
import {UserAvatar} from '@/library/antd';
import ModifyPassword from './ModifyPassword';
import './style.less';

const Item = Menu.Item;

@connect(state => ({local: state.system.i18n}))
export default class HeaderUser extends Component {
    static defaultProps = {
        theme: 'default',
    };

    state = {
        passwordVisible: false,
    };

    handleMenuClick = ({key}) => {
        if (key === 'logout') {
            // TODO 发送请求退出登录
            toLogin();
        }

        if (key === 'modifyPassword') {
            this.setState({passwordVisible: true});
        }
    };

    render() {
        const user = getLoginUser() || {};
        const name = user.name;
        const avatar = user.avatar;

        const {className, theme, local} = this.props;

        const menu = (
            <Menu styleName="menu" theme={theme} selectedKeys={[]} onClick={this.handleMenuClick}>
                <Item key="modifyPassword"><Icon type="edit"/>{local.menu.modifyPassword}</Item>
                <Item><Link to="/settings"><Icon type="setting"/>{local.menu.setting}</Link></Item>
                {process.env.NODE_ENV === 'development' ? (
                    <Item><Link to="/menu-permission"><Icon type="lock"/>{local.menu.menus}</Link></Item>
                ) : null}
                {process.env.NODE_ENV === 'development' ? (
                    <Item><Link to="/admin-crud"><Icon type="code"/>{local.menu.codeGenerator}</Link></Item>
                ) : null}
                <Menu.Divider/>
                <Item key="logout"><Icon type="logout"/>{local.menu.logout}</Item>
            </Menu>
        );
        return (
            <div styleName="user-menu" ref={node => this.userMenu = node}>
                <Dropdown overlay={menu} getPopupContainer={() => (this.userMenu || document.body)}>
                    <span styleName="account" className={className}>
                        {avatar ? (
                            <UserAvatar size="default" styleName="avatar" src={avatar}/>
                        ) : (
                            <UserAvatar size="default" styleName="avatar" name={name}/>
                        )}
                        {name}
                        <Icon type="caret-down"/>
                    </span>
                </Dropdown>

                <ModifyPassword
                    visible={this.state.passwordVisible}
                    onOk={() => this.setState({passwordVisible: false})}
                    onCancel={() => this.setState({passwordVisible: false})}
                />
            </div>
        );
    }
}
