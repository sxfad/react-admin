import React, {Component} from 'react';
import config from 'src/commons/config-hoc';
import PageContent from 'src/layouts/page-content';
import './style.less';

@config({
    path: '/',
    title: {text: '首页', icon: 'home'},
    breadcrumbs: [{key: 'home', text: '首页', icon: 'home'}],
})
export default class Home extends Component {

    render() {
        return (
            <PageContent styleName="root">
                <h1>首页</h1>
                <p>减少项目初始化时，携带不必要的依赖，首页不再提供图表示例！</p>
                <p>如果需要更改首页地址，去掉此页面的path配置，将其他页面的path改为'/'即可，</p>
            </PageContent>
        );
    }
}
