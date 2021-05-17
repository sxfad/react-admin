import config from 'src/commons/config-hoc';
import {Form} from 'antd';
import {PageContent, FormItem} from '@ra-lib/components';

export default config({
    path: '/users/:id',
    selectedMenuPath: '/users', // 指定选中菜单
    title: props => {
        const isAdd = props?.match?.params?.id === ':id';

        return isAdd ? '添加用户' : '编辑用户';
    },
})(function UserEdit(props) {
    const {id} = props.match.params;
    const isEdit = id !== ':id';

    console.log('userEdit render', JSON.stringify(props));

    return (
        <PageContent>
            {isEdit ? '编辑' : '添加'}用户页面-{id}
            <Form>
                <FormItem
                    label="时间区间"
                    type="time-range"
                    name="time-range"
                />
                <FormItem
                    label="周"
                    type="week"
                    name="week"
                />
                <FormItem
                    label="周区间"
                    type="week-range"
                    name="week-range"
                />
                <FormItem
                    label="月"
                    type="month"
                    name="month"
                />
                <FormItem
                    label="月区间"
                    type="month-range"
                    name="month-range"
                />
                <FormItem
                    label="季度"
                    type="quarter"
                    name="quarter"
                />
                <FormItem
                    label="季度区间"
                    type="quarter-range"
                    name="quarter-range"
                />
                <FormItem
                    label="年"
                    type="year"
                    name="year"
                />
                <FormItem
                    label="年区间"
                    type="year-range"
                    name="year-range"
                />
            </Form>
        </PageContent>
    );
});
