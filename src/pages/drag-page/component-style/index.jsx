import React, {useState, useEffect, useRef} from 'react';
import {Collapse, ConfigProvider} from 'antd';
import FontIcon from '../font-icon';
import config from 'src/commons/config-hoc';
import Pane from '../pane';
import Layout from './layout';
import Font from './font';
import Position from './position';
import Background from './background';
import Border from './border';
import StyleEditor from './style-editor';
import StyleNavigator from './style-navigator';
import {v4 as uuid} from 'uuid';
import {useHeight} from 'ra-lib';
import CurrentSelectedNode from '../current-selected-node';
import './style.less';
import {OTHER_HEIGHT} from 'src/pages/drag-page/util';
import {debounce} from 'lodash';

const {Panel} = Collapse;

export default config({
    connect: state => {
        return {
            refreshProps: state.dragPage.refreshProps,
            selectedNode: state.dragPage.selectedNode,
            iframeDocument: state.dragPage.iframeDocument,
            rightSideWidth: state.dragPage.rightSideWidth,
        };
    },
})(function ComponentStyle(props) {
    let {
        rightSideWidth,
        selectedNode,
        iframeDocument,
        action: {dragPage: dragPageAction},
    } = props;

    const style = selectedNode?.props?.style || {};
    const componentId = selectedNode?.id;

    const options = [
        {key: 'layout', title: '布局', icon: <FontIcon type="icon-layout"/>, Component: Layout},
        {key: 'font', title: '文字', icon: <FontIcon type="icon-font"/>, Component: Font},
        {key: 'position', title: '定位', icon: <FontIcon type="icon-position"/>, Component: Position},
        {key: 'background', title: '背景', icon: <FontIcon type="icon-background"/>, Component: Background},
        {key: 'border', title: '边框', icon: <FontIcon type="icon-border"/>, Component: Border},
    ];

    const [styleEditorVisible, setStyleEditorVisible] = useState(false);
    const [, setRender] = useState('');
    const [activeKey, setActiveKey] = useState(options.map(item => item.key));
    const boxRef = useRef(null);

    const [height] = useHeight(boxRef, OTHER_HEIGHT);

    const handleChange = debounce((values, replace) => {
        if (!selectedNode?.componentName) return;

        if (!selectedNode?.props) selectedNode.props = {};

        if (!selectedNode.props.style) selectedNode.props.style = {};

        const style = selectedNode.props.style;

        if (replace) {
            // 直接替换，一般来自源码编辑器
            selectedNode.props.style = values;
            // 触发当前组件重新渲染 让编辑器拿到最新的style
            setRender(uuid());
        } else {
            // 合并
            selectedNode.props.style = {
                ...style,
                ...values,
            };
        }

        // 设置 key 每次保证渲染，都重新创建节点，否则属性无法被清空，样式为空，或者不合法，将不能覆盖已有样式 其他属性没有这样的问题
        // prefStyle: {backgroundColor: 'red'} nextStyle: {backgroundColor: 'red111'}, 样式依旧为红色
        selectedNode.props.key = uuid();

        console.log('selectedNode style', JSON.stringify(selectedNode.props.style, null, 4));

        dragPageAction.render();

    }, 300);

    useEffect(() => {
        if (styleEditorVisible && rightSideWidth < 440) {
            dragPageAction.setRightSideWidth(440);
        }
    }, [styleEditorVisible, rightSideWidth]);


    return (
        <ConfigProvider getPopupContainer={() => boxRef.current}>
            <Pane
                fitHeight
                header={(
                    <div styleName="header">
                        <CurrentSelectedNode/>
                        <FontIcon
                            type="icon-code"
                            styleName="tool"
                            onClick={() => setStyleEditorVisible(!styleEditorVisible)}
                        />
                    </div>
                )}
            >
                <StyleEditor
                    value={style}
                    onChange={values => handleChange(values, true)}
                    visible={styleEditorVisible}
                    onCancel={() => setStyleEditorVisible(false)}
                />
                <div styleName="root">
                    <StyleNavigator
                        containerRef={boxRef}
                        dataSource={options}
                        onClick={key => {
                            const nextActiveKey = Array.from(new Set([key, ...activeKey]));
                            setActiveKey(nextActiveKey);
                        }}
                    />
                    <div
                        ref={boxRef}
                        styleName="collapseBox"
                        id="styleCollapseBox"
                        style={{height}}
                    >
                        <Collapse
                            style={{border: 'none'}}
                            activeKey={activeKey}
                            onChange={activeKey => setActiveKey(activeKey)}
                        >
                            {options.map(item => {
                                const {key, title, Component} = item;
                                return (
                                    <Panel key={key} header={<div id={`style-${key}`}>{title}</div>}>
                                        <Component
                                            iframeDocument={iframeDocument}
                                            componentId={componentId}
                                            containerRef={boxRef}
                                            value={style}
                                            onChange={handleChange}
                                        />
                                    </Panel>
                                );
                            })}
                        </Collapse>
                        <div style={{height: height - 220}}/>
                    </div>
                </div>
            </Pane>
        </ConfigProvider>
    );
});
