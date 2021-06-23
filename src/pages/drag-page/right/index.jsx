import React, {useRef} from 'react';
import {Tabs, Tooltip, Empty} from 'antd';
import config from 'src/commons/config-hoc';
import ComponentStyle from '../component-style';
import ComponentProps from '../component-props';
import DragBar from '../drag-bar';
import FontIcon from '../font-icon';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';
import {isNode} from 'src/pages/drag-page/node-util';
import styles from  './style.less';

const {TabPane} = Tabs;

export default config({
    connect: state => {
        return {
            activeTabKey: state.dragPage.activeTabKey,
            selectedNode: state.dragPage.selectedNode,
            draggingNode: state.dragPage.draggingNode,
            rightSideWidth: state.dragPage.rightSideWidth,
            rightSideExpended: state.dragPage.rightSideExpended,
        };
    },
})(function Right(props) {
    const {
        activeTabKey,
        selectedNode,
        // draggingNode,
        rightSideWidth,
        rightSideExpended,
        action: {dragPage: dragPageAction},
    } = props;

    const rootRef = useRef(null);

    function handleChange(key) {
        dragPageAction.setActiveTabKey(key);
    }

    const windowWidth = document.documentElement.clientWidth;

    function handleDragging(info) {
        const {clientX} = info;

        const {x, width: rightWidth} = rootRef.current.getBoundingClientRect();

        const width = windowWidth - clientX - 4 - (windowWidth - x - rightWidth);

        dragPageAction.setRightSideWidth(width);
    }

    function handleToggleClick() {
        dragPageAction.setRightSideExpended(!rightSideExpended);
    }

    const panes = [
        {key: 'style', title: '样式', component: <ComponentStyle/>, icon: <FontIcon type="icon-style"/>},
        {key: 'props', title: '属性', component: <ComponentProps/>, icon: <FontIcon type="icon-props"/>},
        {key: 'action', title: '事件', component: '事件', icon: <FontIcon type="icon-click"/>},
        {key: 'dataSource', title: '数据', component: '数据', icon: <FontIcon type="icon-data"/>},
        {key: 'comment', title: '注释', component: '注释', icon: <FontIcon type="icon-comment"/>},
    ];

    return (
        <div
            ref={rootRef}
            className={{
                [styles.root]: true,
                [styles.expended] : rightSideExpended,
            }}
            style={{width: rightSideExpended ? rightSideWidth : 45}}
        >
            <div className={styles.toolBar}>
                <Tooltip
                    placement="right"
                    title={'展开'}
                    onClick={handleToggleClick}
                >
                    <div className={styles.tool}>
                        <MenuFoldOutlined/>
                    </div>
                </Tooltip>

                {panes.map(item => {
                    const {key, title, icon} = item;
                    const isActive = activeTabKey === key;

                    return (
                        <Tooltip
                            placement="right"
                            title={title}
                            onClick={() => {
                                handleChange(key);
                                handleToggleClick();
                            }}
                        >
                            <div
                                key={key}
                                className={{[styles.tool]: true, [styles.active]: isActive}}
                            >
                                {icon}
                            </div>
                        </Tooltip>
                    );
                })}
            </div>
            <div className={styles.toolTabs}>
                <DragBar left onDragging={handleDragging}/>
                <Tabs
                    tabBarExtraContent={{
                        left: (
                            <div className={styles.toggle} onClick={handleToggleClick}>
                                <MenuUnfoldOutlined/>
                            </div>
                        ),
                    }}
                    type="card"
                    tabBarStyle={{marginBottom: 0}}
                    activeKey={activeTabKey}
                    onChange={handleChange}
                >
                    {panes.map(item => {
                        const {key, title, component} = item;

                        return (
                            <TabPane tab={title} key={key}>
                                {selectedNode && isNode(selectedNode) ? component : <Empty style={{marginTop: 100}} description="未选中节点"/>}
                            </TabPane>
                        );
                    })}
                </Tabs>
            </div>
        </div>
    );
});
