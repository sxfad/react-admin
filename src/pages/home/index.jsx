import {Redirect} from 'react-router-dom';
import config from 'src/commons/config-hoc';

export default config({
    path: '/',
})(function Home() {
    // 如果其他页面作为首页，直接重定向，config中不要设置title，否则tab页中会多个首页
    return <Redirect to="/drag-page"/>;
});
