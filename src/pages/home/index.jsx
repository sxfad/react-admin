// import {Redirect} from 'react-router-dom';
import config from 'src/commons/config-hoc';
import {PageContent} from '@ra-lib/components';
import styles from './style.less';

const a = 123;
const b = 456;

export default config({
    path: '/',
    title: '首页',
})(function Home(props) {

    // 如果其他页面作为首页，直接重定向，config中不要设置title，否则tab页中会多个首页
    // return <Redirect to="/users"/>;

    return (
        <PageContent className={styles.root}>
            <h1>首页</h1>
        </PageContent>
    );
});
