import config from 'src/commons/config-hoc';
import {Result} from 'antd';
import {PageContent} from '@ra-lib/components';
import styles from './style.less';

export default config({
    path: '/iframe_page_/:src',
})(function IFrame(props) {
    let {src} = props?.match?.params || {};

    src = window.decodeURIComponent(src);

    return (
        <PageContent fitHeight className={styles.root}>
            {src && src !== 'undefined' ? (
                <iframe
                    allowFullScreen
                    title={src}
                    src={src}
                />
            ) : (
                <div
                    style={{
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Result
                        status="error"
                        title="页面加载失败"
                        subTitle={`传递正确的 src，当前获取到「${src}」`}
                    />
                </div>
            )}
        </PageContent>
    );
});
