import {useState, useEffect} from 'react';
import {Result} from 'antd';
import {PageContent} from '@ra-lib/components';
import {getAppByName} from 'src/qiankun';
import styles from './style.less';

export default function SubError(props) {
    const {name} = props;
    const [app, setApp] = useState(null);
    useEffect(() => {
        (async () => {
            const app = await getAppByName(name);
            setApp(app);
        })();
    }, [name]);

    return (
        <PageContent className={styles.root}>
            <Result
                status="500"
                title="500"
                subTitle={`应用 「${app?.title || app?.name}」 加载失败`}
            />
        </PageContent>
    );
}
