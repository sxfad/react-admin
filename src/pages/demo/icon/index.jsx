import {Space} from 'antd';
import config from 'src/commons/config-hoc';
import {PageContent} from '@ra-lib/components';
import {Icon} from 'src/components';

export default config({
    path: '/demo/icon',
})(function Index(props) {

    return (
        <PageContent>
            <Space>
                <Icon type="icon-kafka"/>
            </Space>
        </PageContent>
    );
})
