import config from 'src/commons/config-hoc';
import {PageContent} from '@ra-lib/components';

export default config({
    path: '/demo/config/hoc/:id',
    header: false,
    side: false,
})(function TestAjax(props) {
    console.log(99, props);
    // 调用方法 会触发当前组件更新
    return (
        <PageContent>
            config 高阶组件
        </PageContent>
    );
});

