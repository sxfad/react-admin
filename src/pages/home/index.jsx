import config from 'src/commons/config-hoc';
import {PageContent} from '@ra-lib/components';
import styles from './style.less';

export default config({
    path: '/',
    title: '首页',
})(function Home(props) {

    return (
        <PageContent className={styles.root}>
            <h1>首页</h1>
        </PageContent>
    );
});
