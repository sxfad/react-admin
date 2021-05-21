import {useState} from 'react';
import {Button, Space} from 'antd';
import {useGet} from 'src/commons/ajax';
import config from 'src/commons/config-hoc';
import {PageContent} from '@ra-lib/components';

export default config({
    path: '/demo/ajax',
})(function TestAjax(props) {
    const [loading, setLoading] = useState();
    const [pageNum, setPageNum] = useState(1);
    const [time, setTime] = useState();
    const {
        run: fetchUser,
        data = {name: 'init'},
        error,
    } = useGet('/get', {pageNum, time}, {successTip: '请求成功', setLoading});

    // 初始化时、pageNum改变时 发起请求
    // 这种方式估计会用的多
    const {data: users} = useGet('/get', {pageNum, time}, [pageNum], {
        setLoading, // 多个请求公用一个loading情况
        formatResult: res => {
            if (!res) return {};

            return res.data;
        },
    });

    // 初始化时、pageNum改变时 发起请求
    const {data: users2} = useGet('/get', {pageNum, time}, [pageNum], res => {
        console.log('initOptions 直接作为 formatResult');
        if (!res) return {};

        return res.data;
    });

    async function handleGet() {
        await fetchUser({name: '123'});
    }

    async function handleDownload() {
        props.ajax.download('/download');
        // window.open('/api/download'); // 1. 瞬间打开新窗口，然后又关闭；2. 只支持get；3. 需要自己拼接 api前缀
    }

    console.log('TestAjax render');
    console.log('users', users);
    console.log('users2', users2);
    return (
        <PageContent>
            <h2>Ajax 测试</h2>
            当前时间：{time}
            <br/>
            <Space>
                <Button onClick={handleGet}>get</Button>
                <Button onClick={() => setPageNum(pageNum + 1)}>下一页</Button>
                <Button onClick={() => setTime(Date.now())}>设置时间</Button>
                <Button onClick={handleDownload}>下载文件</Button>
            </Space>
            <div>loading: {loading ? '请求中。。。' : ''}</div>
            <div>成功结果:
                <code>
                    <pre>
                    {JSON.stringify(data, null, 4)}
                    </pre>
                </code>
            </div>
            <div>失败结果:
                <code>
                    <pre>
                    {JSON.stringify(error, null, 4)}
                    </pre>
                </code>
            </div>
        </PageContent>
    );
});
