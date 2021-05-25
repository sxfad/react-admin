import {Result} from 'antd';
import {PageContent} from '@ra-lib/components';
import styles from './style.less';

export default function IFrame(props) {
    let {src} = props?.match?.params || {};

    src = window.decodeURIComponent(src);

    return (
        <PageContent fitHeight className={styles.root}>
            {src && src !== 'undefined' ? (
                <iframe
                    key={src}
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
};
