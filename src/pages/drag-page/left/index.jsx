import React, {useRef} from 'react';
import {Tooltip} from 'antd';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    AppstoreOutlined,
    SettingOutlined,
    ApartmentOutlined,
    BarsOutlined,
} from '@ant-design/icons';
import FontIcon from 'src/pages/drag-page/font-icon';
import {useHeight} from '@ra-lib/admin';
import config from 'src/commons/config-hoc';
import ComponentTree from '../component-tree';
import ComponentStore from '../component-store';
import SchemaEditor from '../schema-editor';
import CanvasSetting from '../canvas-setting';
import PageMenu from '../page-menu';
import {OTHER_HEIGHT} from 'src/pages/drag-page/util';
import DragBar from 'src/pages/drag-page/drag-bar';
import styles from './style.less';

export default config({
    connect: state => {
        return {
            showSide: state.dragPage.showSide,
            sideWidth: state.dragPage.sideWidth,
            activeSideKey: state.dragPage.activeSideKey,
        };
    },
})(function Left(props) {
    const {
        showSide,
        sideWidth,
        activeSideKey,
        action: {dragPage: dragPageAction},
    } = props;
    const rightRef = useRef(null);
    const [height] = useHeight(rightRef, OTHER_HEIGHT);

    function handleToolClick(key) {
        if (key === activeSideKey) {
            dragPageAction.showSide(!showSide);
            return;
        }
        dragPageAction.setActiveSideKey(key);
        dragPageAction.showSide(true);
    }

    function handleToggle() {
        const nextShowSide = !showSide;

        if (nextShowSide && !activeSideKey) {
            dragPageAction.setActiveSideKey('componentStore');
        }

        dragPageAction.showSide(nextShowSide);
    }

    function handleDragging(info) {
        const {clientX} = info;

        const {x} = rightRef.current.getBoundingClientRect();
        dragPageAction.setSideWidth(clientX - x - 4);
    }

    const tools = [
        {
            title: '页面菜单',
            key: 'menu',
            icon: <BarsOutlined style={{fontSize: 20}}/>,
            component: <PageMenu/>,
        },
        {
            title: '组件树',
            key: 'componentTree',
            icon: <ApartmentOutlined/>,
            component: <ComponentTree/>,
        },
        {
            title: '组件库',
            key: 'componentStore',
            icon: <AppstoreOutlined/>,
            component: <ComponentStore/>,
        },
        {
            title: 'Schema 源码开发',
            key: 'schemaEditor',
            icon: <FontIcon type="icon-code"/>,
            component: <SchemaEditor/>,
            bottom: true,
        },
        {
            title: '画布设置',
            key: 'canvasSetting',
            icon: <SettingOutlined/>,
            component: <CanvasSetting/>,
            bottom: true,
        },
    ];

    function renderTools(tools, bottom) {
        return tools.filter(item => item.bottom === bottom).map(item => {
            const {title, key, icon} = item;
            const active = showSide && key === activeSideKey;

            return (
                <Tooltip key={key} placement="right" title={title}>
                    <div
                        className={[
                            styles.toolItem,
                            {[styles.active]: active},
                        ]}
                        onClick={() => handleToolClick(key)}
                    >
                        {icon}
                    </div>
                </Tooltip>
            );
        });
    }

    const rightWidth = showSide ? sideWidth : 0;
    return (
        <div
            className={styles.root}
        >
            {showSide ? <DragBar onDragging={handleDragging}/> : null}
            <div className={styles.left}>
                <div className={styles.leftTop}>
                    <Tooltip placement="right" title={showSide ? '收起' : '展开'}>
                        <div className={[styles.toggle, styles.toolItem]} onClick={() => handleToggle()}>
                            {showSide ? <MenuFoldOutlined/> : <MenuUnfoldOutlined/>}
                        </div>
                    </Tooltip>
                    {renderTools(tools)}
                </div>
                <div className={styles.leftBottom}>
                    {renderTools(tools, true)}
                </div>
            </div>
            <div className={styles.right} ref={rightRef} style={{height, width: rightWidth}}>
                {tools.map(item => {
                    const {key, component} = item;
                    return (
                        <div
                            key={key}
                            id={key}
                            style={{
                                display: showSide && key === activeSideKey ? 'flex' : 'none',
                                height: '100%',
                                width: '100%',
                            }}
                        >
                            {component}
                        </div>
                    );
                })}
            </div>
        </div>
    );
});
