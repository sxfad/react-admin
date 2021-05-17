import {Button, Space} from 'antd';
import {AlertFilled} from '@ant-design/icons';
import {PageContent} from '@ra-lib/components';
import config from 'src/commons/config-hoc';
import styles from './style.less';

export default config({
    path: '/demo/model',
    connect: state => {
        console.log(222, state);
        const demoState = state.demo.present;
        return {
            name: demoState.name,
            options: demoState.options,
            user: demoState.user,
            getUserLoading: demoState.getUserLoading,
            getUserError: demoState.getUserError,
            asyncResult: demoState.asyncResult,
        };
    },
})(function TestModel(props) {
    const {
        name,
        user,
        getUserLoading,
        getUserError,
        action: {demo: demoAction},
        asyncResult,
        options,
    } = props;
    console.log(getUserError, user);
    return (
        <PageContent className={styles.root}>
            <div className={styles.title}>姓名：{name}</div>
            <Space>
                <Button
                    type="primary"
                    icon={<AlertFilled/>}
                    onClick={() => demoAction.setName(Date.now())}
                >setName</Button>
                <Button onClick={() => demoAction.demoUndo()}>demoUndo</Button>
                <Button onClick={() => demoAction.demoRedo()}>demoRedo</Button>
                <Button onClick={() => demoAction.demoClearHistory()}>demoClearHsitory</Button>
            </Space>
            <div className="options">options: {options}</div>
            <Space>
                <Button onClick={() => demoAction.setOptions(Date.now())}>setOptions</Button>
            </Space>

            <div>{getUserLoading ? '获取中...' : '获取完成!'}</div>
            <Button onClick={() => demoAction.getUser()}>getUser</Button>

            <div>
                结果：{asyncResult}
            </div>
            <Space>
                <Button onClick={() => demoAction.testAsync(2000)}>2秒完成</Button>
                <Button onClick={() => demoAction.testAsync(1000)}>1秒完成</Button>
            </Space>
        </PageContent>
    );
});
