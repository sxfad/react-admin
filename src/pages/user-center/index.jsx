import config from 'src/commons/config-hoc';
import {PageContent} from '@ra-lib/components';

export default config({
    path: '/users/center/:id',
    selectedMenuPath: '/users', // 指定选中菜单
    title: '用户中心',
})(function UserEdit(props) {
    const {id} = props.match.params;

    return (
        <PageContent>
            用户中心-{id}
        </PageContent>
    );
});
