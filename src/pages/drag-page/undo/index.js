import React, {useRef, useEffect} from 'react';
import {Tooltip} from 'antd';
import {SwapLeftOutlined, SwapRightOutlined} from '@ant-design/icons';
import config from 'src/commons/config-hoc';
import styles from '../top/style.less';

// 触发记录的频率
const FREQUENCY = 1000;

export default config({
    router: true,
    connect: state => {
        return {
            pageConfig: state.dragPage.pageConfig,
            pageConfigHistory: state.dragPage.pageConfigHistory,
            historyCursor: state.dragPage.historyCursor,
            refreshProps: state.dragPage.refreshProps,
            currentMenuKey: state.dragPage.currentMenuKey,
        };
    },
})(function Undo(props) {
    const {
        pageConfigHistory,
        historyCursor,
        pageConfig,
        refreshProps,
        action: {dragPage: dragPageAction},
        showLabel,
        currentMenuKey,
    } = props;
    const {projectId} = props.match.params;

    const fromUndoRef = useRef(true);
    const timeRef = useRef(0);

    const {run: updatePage} = props.ajax.usePut(`/project/${projectId}/menus/${currentMenuKey}/page`);

    function handlePrev() {
        fromUndoRef.current = true;
        dragPageAction.prevStep();
    }

    function handleNext() {
        fromUndoRef.current = true;
        dragPageAction.nextStep();
    }

    useEffect(() => {
        if (fromUndoRef.current) {
            fromUndoRef.current = false;
            return;
        }

        if (timeRef.current) {
            clearTimeout(timeRef.current);
        }

        timeRef.current = setTimeout(() => {
            dragPageAction.addPageConfigHistory(pageConfig);
            (async () => {
                if (!currentMenuKey) return;
                await updatePage({config: JSON.stringify(pageConfig)});
            })();
        }, FREQUENCY);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(pageConfig), refreshProps, currentMenuKey]);

    const disabledPrev = !pageConfigHistory?.length || historyCursor <= 0;
    const disabledNext = !pageConfigHistory?.length || historyCursor >= pageConfigHistory?.length - 1;

    const tools = [
        {
            key: 'prev',
            label: '上一步',
            icon: <SwapLeftOutlined/>,
            disabled: disabledPrev,
            onClick: handlePrev,
        },
        {
            key: 'next',
            label: '下一步',
            icon: <SwapRightOutlined/>,
            disabled: disabledNext,
            onClick: handleNext,
        },
    ];

    return tools.map(item => {
        const {key, label, icon, disabled, onClick} = item;
        const itemComponent = (
            <div
                key={key}
                className={[
                    styles.toolItem,
                    {
                        [styles.showLabel]: showLabel,
                        [styles.disabled]: disabled,
                    },
                ]}
                onClick={disabled ? undefined : onClick}
            >
                <span className={styles.icon}>{icon}</span>
                {showLabel ? <span className={styles.label}>{label}</span> : null}
            </div>
        );
        if (showLabel) return itemComponent;
        return (
            <Tooltip title={label}>
                {itemComponent}
            </Tooltip>
        );
    });
});
