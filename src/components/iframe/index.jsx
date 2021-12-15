import { Result } from 'antd';
import { getToken, queryStringify, PageContent } from '@ra-lib/admin';

export default function IFrame(props) {
    let { src } = props?.match?.params || {};

    src = window.decodeURIComponent(src);

    // 通过src 传递token
    if (src && src !== 'undefined') {
        const queryStr = queryStringify({
            token: getToken(),
        });

        src = `${src}${src.includes('?') ? '&' : '?'}${queryStr}`;
    }

    return (
        <PageContent
            fitHeight
            style={{
                padding: 0,
                display: 'flex',
            }}
        >
            {src && src !== 'undefined' ? (
                <iframe
                    key={src}
                    allowFullScreen
                    title={src}
                    src={src}
                    style={{
                        border: 0,
                        width: '100%',
                        height: '100%',
                        boxSizing: 'border-box',
                    }}
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
                    <Result status="error" title="页面加载失败" subTitle={`传递正确的 src，当前获取到「${src}」`} />
                </div>
            )}
        </PageContent>
    );
}
