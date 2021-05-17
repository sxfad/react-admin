import {useState, useEffect, useRef} from 'react';
import {Button, Space} from 'antd';
import config from 'src/commons/config-hoc';
import {PageContent} from '@ra-lib/components';

export default config({
    path: '/demo/page-content',
})(function TestAjax(props) {
    const [loading, setLoading] = useState(false);
    const rootRef = useRef();
    useEffect(() => {
        console.log(rootRef);
    }, []);

    function handleLoading() {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 3000)
    }

    return (
        <PageContent
            fitHeight
            loading={loading}
            ref={rootRef}
        >
            <Space>
                <Button onClick={handleLoading}>loading</Button>
            </Space>
            <PageContent loading={loading} style={{background: 'yellow'}}>
                子 PageContent
            </PageContent>
            <div style={{width: 200, height: 200, background: 'red'}}/>
            <PageContent loading={loading}>
                <div style={{width: 100, height: 2000, background: 'green'}}/>
            </PageContent>
            <Button onClick={handleLoading}>loading</Button>
        </PageContent>
    );
})
