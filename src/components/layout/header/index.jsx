import {Space, Dropdown, Menu, Avatar} from 'antd';
import {DownOutlined, UserOutlined, LogoutOutlined} from '@ant-design/icons';
import {FullScreen} from '@ra-lib/components';
import {getColor} from '@ra-lib/util';
import styles from './style.less';
import config from 'src/commons/config-hoc';
import {toLogin} from 'src/commons';
import LayoutSetting from 'src/components/layout/layout-setting';
import {IS_MOBILE} from 'src/config';

export default config({
    router: true,
})(function Header(props) {
    const {loginUser = {}} = props;

    function handleLogout() {
        // TODO 退出登录
        alert('TODO 退出登录');
        toLogin();
    }

    const menu = (
        <Menu>
            <Menu.Item icon={<UserOutlined/>} onClick={() => props.history.push(`/users/center/${loginUser.id}`)}>
                用户中心
            </Menu.Item>
            <Menu.Divider/>
            <Menu.Item danger icon={<LogoutOutlined/>} onClick={handleLogout}>
                退出登录
            </Menu.Item>
        </Menu>
    );

    const {avatar, name = ''} = loginUser;

    const width = IS_MOBILE ? 100 : 160;
    return (
        <Space
            className={styles.root}
            size={16}
            style={{
                // 两个宽度要同时设置，否则会被挤！！！
                flex: `0 0 ${width}px`,
                width,
            }}
        >
            {IS_MOBILE ? null : (
                <>
                    <div className={styles.action}>
                        <FullScreen/>
                    </div>

                    <div className={styles.action}>
                        <LayoutSetting/>
                    </div>
                </>
            )}

            <Dropdown overlay={menu}>
                <div className={styles.action}>
                    {avatar ? (
                        <Avatar size="small" className={styles.avatar} src={avatar}/>
                    ) : (
                        <Avatar
                            size="small"
                            className={styles.avatar}
                            style={{backgroundColor: getColor(name)}}
                        >
                            {(name[0] || '').toUpperCase()}
                        </Avatar>
                    )}
                    <span className={styles.userName}>{name}</span>
                    <DownOutlined/>
                </div>
            </Dropdown>
        </Space>
    );
});
