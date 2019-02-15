import React, {Component} from 'react';
import config from '@/commons/config-hoc';

/**
 * 通过div的显示隐藏，来保存tab页面状态
 */
@config({
    connect: state => ({
        tabs: state.system.tabs,
    }),
})
export default class KeepPage extends Component {
    scrollTop = 0;

    componentDidUpdate() {
        // 完成更新，内容加载完成之后，恢复当前tab页滚动条
        document.body.scrollTop = document.documentElement.scrollTop = this.scrollTop;
    }

    render() {
        const {tabs} = this.props;

        // 始终保持内容的顺序不变，避免React的diff算法，在元素移动时，先删除后创建，导致iframe重新加载的问题
        const sortTabs = [...tabs].sort((a, b) => (a.path > b.path ? 1 : -1));

        // 已解决：每次tab切换，都会导致所有的tab页面组件render一次，由于history作为props，history改变导致的？（好像并不是）浏览器前进后退，并不是router使用的history，并不引起更新
        // 已解决：所有tab都render，tab页开多了，性能极差
        // layouts/frame 的 this.props.history.listen 中使用setTimeout，就不会render了！原因未知
        return sortTabs.map(item => {
            const {path: tabPath, component, active, scrollTop = 0} = item;

            // 记录当前页面的滚动条位置，等待页面加载完成，componentDidUpdate会进行恢复
            if (active) this.scrollTop = scrollTop;

            if (!component) return null;

            return (
                <div key={tabPath} id={tabPath} style={{display: active ? 'flex' : 'none', flex: 1}}>
                    {component}
                </div>
            );
        });
    }
}
