import {useState} from 'react';
import {Space, Dropdown, Menu, Avatar} from 'antd';
import {DownOutlined, LockOutlined, LogoutOutlined, ApiOutlined} from '@ant-design/icons';
import {getColor, FullScreen} from '@ra-lib/admin';
import {IS_MOBILE} from 'src/config';
import config from 'src/commons/config-hoc';
import {toLogin} from 'src/commons';
import PasswordModal from './PasswordModal';
import styles from './style.less';
import theme from 'src/theme.less';
import proxyConfig from 'src/setupProxyConfig.json';

export default config({
    router: true,
})(function Header(props) {
    const {loginUser = {}} = props;
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [selectedKeys, setSelectedKeys] = useState([window.localStorage.getItem('AJAX_PREFIX') || '/api']);

    async function handleLogout() {
        // await props.ajax.post('/logout');
        alert('TODO 退出登录接口！');
        toLogin();
    }

    const menu = (
        <Menu selectedKeys={selectedKeys}>
            <Menu.Item key="modify-password" icon={<LockOutlined/>} onClick={() => setPasswordVisible(true)}>
                修改密码
            </Menu.Item>
            <Menu.Divider/>
            <Menu.Item key="logout" danger icon={<LogoutOutlined/>} onClick={handleLogout}>
                退出登录
            </Menu.Item>
        </Menu>
    );

    const serverMenu = (
        <Menu selectedKeys={selectedKeys}>
            {proxyConfig.filter(item => !item.disabled).map(item => {
                const {baseUrl, name} = item;
                return (
                    <Menu.Item
                        key={baseUrl}
                        icon={<ApiOutlined/>}
                        onClick={() => {
                            setSelectedKeys([baseUrl]);
                            window.localStorage.setItem('AJAX_PREFIX', baseUrl);
                            window.location.reload();
                        }}
                    >
                        {name}
                    </Menu.Item>
                );
            })}
        </Menu>
    );

    const {avatar, name = ''} = loginUser;

    const width = IS_MOBILE ? 'auto' : '400px';
    return (
        <Space
            className={styles.root}
            size={16}
            style={{
                // 两个宽度要同时设置，否则会被挤！！！
                flex: `0 0 ${width}`,
                width,
                paddingRight: IS_MOBILE ? 0 : 12,
            }}
        >
            <Dropdown overlay={serverMenu}>
                <div className={styles.action}>
                    <div style={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        border: '1px solid ' + theme.primaryColor,
                        color: theme.primaryColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <ApiOutlined/>
                    </div>

                    <span style={{marginLeft: 4, marginRight: 4}}>
            后端服务：
            <span style={{color: theme.primaryColor}}>
                {proxyConfig.find(item => selectedKeys?.includes(item.baseUrl))?.name}
            </span>
        </span>
                    <DownOutlined/>
                </div>
            </Dropdown>

            {IS_MOBILE ? null : (
                <>
                    <div className={styles.action}>
                        <FullScreen/>
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
                    {IS_MOBILE ? null : (
                        <>
                            <span className={styles.userName}>{name}</span>
                            <DownOutlined/>
                        </>
                    )}
                </div>
            </Dropdown>
            <PasswordModal
                visible={passwordVisible}
                onCancel={() => setPasswordVisible(false)}
                onOk={() => setPasswordVisible(false)}
            />
        </Space>
    );
});
