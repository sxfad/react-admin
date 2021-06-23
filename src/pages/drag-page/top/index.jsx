import React from 'react';
import {
    EyeOutlined,
    FormOutlined,
    SaveOutlined,
    DeleteOutlined,
    CloudServerOutlined,
} from '@ant-design/icons';
import {Tooltip, Button} from 'antd';
import FontIcon from 'src/pages/drag-page/font-icon';
import config from 'src/commons/config-hoc';
import {isMac} from '../util';
import Undo from '../undo';
import SourceCode from '../source-code';
import './style.less';

export default config({
    router: true,
    connect: state => {

        return {
            activeToolKey: state.dragPage.activeToolKey,
            selectedNodeId: state.dragPage.selectedNodeId,
        };
    },
})(function Top(props) {
    const {
        activeToolKey,
        selectedNodeId,
        action: {dragPage: dragPageAction},
    } = props;
    const showLabel = true;
    const tools = [
        {
            key: 'layout',
            icon: <FormOutlined/>,
            label: '布局模式',
            onClick: () => dragPageAction.setActiveTookKey('layout'),
        },
        {
            key: 'preview',
            icon: <EyeOutlined/>,
            label: '预览模式',
            onClick: () => dragPageAction.setActiveTookKey('preview'),
        },
        'divider',
        {
            key: 'undo',
        },
        'divider',
        {
            key: 'code',
            icon: <FontIcon type="icon-code"/>,
            label: '代码',
            onClick: () => dragPageAction.showCode(true),
        },
        {
            key: 'save',
            icon: <SaveOutlined/>,
            label: `保存(${isMac ? '⌘' : 'ctrl'}+s)`,
            onClick: () => dragPageAction.save(),
        },
        {
            key: 'delete',
            icon: <DeleteOutlined/>,
            label: `删除(${isMac ? '⌘' : 'ctrl'}+d)`,
            disabled: !selectedNodeId,
            onClick: () => dragPageAction.deleteNodeById(selectedNodeId),
        },
        {
            key: 'saveAs',
            icon: <CloudServerOutlined/>,
            label: '另存为',
            disabled: !selectedNodeId,
            onClick: () => {
                // TODO
            },
        },
    ];
    return (
        <div styleName="root">
            <div styleName="left">
                <Button onClick={() => props.history.goBack()}>返回</Button>
            </div>
            <div styleName="center">
                {tools.map(item => {
                    if (item === 'divider') {
                        return <div styleName="divider"/>;
                    }

                    let {key, icon, label, onClick, disabled} = item;
                    if (key === 'undo') return <Undo showLabel={showLabel}/>;

                    const isActive = key === activeToolKey;

                    if (disabled) onClick = undefined;

                    const styleNames = ['toolItem'];
                    if (isActive) styleNames.push('active');
                    if (disabled) styleNames.push('disabled');
                    if (showLabel) styleNames.push('showLabel');

                    const itemComponent = (
                        <div key={key} styleName={styleNames.join(' ')} onClick={onClick}>
                            <span styleName="icon">{icon}</span>
                            {showLabel ? <span styleName="label">{label}</span> : null}
                        </div>
                    );

                    if (showLabel) return itemComponent;
                    return (
                        <Tooltip title={label}>
                            {itemComponent}
                        </Tooltip>
                    );
                })}
                <SourceCode/>
            </div>
            <div styleName="right"/>
        </div>
    );
});
