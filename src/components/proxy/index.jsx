import theme from 'src/theme.less';
import { ApiOutlined, DownOutlined } from '@ant-design/icons';
import proxyConfig from 'src/setupProxyConfig.json';
import { Dropdown, Menu } from 'antd';
import { useState } from 'react';
import { SHOW_PROXY } from 'src/config';

export default function Proxy(props) {
    const { className } = props;
    const [selectedKeys, setSelectedKeys] = useState([window.localStorage.getItem('AJAX_PREFIX') || '/api']);

    // 非开发 测试环境 不显示
    if (!SHOW_PROXY) return null;

    const serverMenu = (
        <Menu selectedKeys={selectedKeys}>
            {proxyConfig
                .filter((item) => !item.disabled)
                .map((item) => {
                    const { baseUrl, name } = item;
                    return (
                        <Menu.Item
                            key={baseUrl}
                            icon={<ApiOutlined />}
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

    return (
        <Dropdown overlay={serverMenu}>
            <div className={className} style={{ width: 130 }}>
                <div
                    style={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        border: '1px solid ' + theme.primaryColor,
                        color: theme.primaryColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <ApiOutlined />
                </div>

                <span style={{ marginLeft: 4, marginRight: 4 }}>
                    <span style={{ color: theme.primaryColor }}>
                        {proxyConfig.find((item) => selectedKeys?.includes(item.baseUrl))?.name}
                    </span>
                </span>

                <DownOutlined />
            </div>
        </Dropdown>
    );
}
