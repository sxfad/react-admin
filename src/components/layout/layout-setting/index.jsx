import { Tooltip } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import config from 'src/commons/config-hoc';

export default config({
    router: true,
})(function LayoutSetting(props) {
    return (
        <Tooltip title="布局设置">
            <SettingOutlined
                style={{ cursor: 'pointer' }}
                onClick={() => props.history.push('/layout/setting?title=布局设置')}
            />
        </Tooltip>
    );
});
