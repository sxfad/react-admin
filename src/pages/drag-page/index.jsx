import React, {useEffect, useState} from 'react';
import {Empty, Button} from 'antd';
import config from 'src/commons/config-hoc';
import {PageContent} from '@ra-lib/admin';
import Top from './top';
import Left from './left';
import Right from './right';
import IframeRender from './iframe-render';
import ArrowLines from './arrow-lines';
import KeyMap from './KeyMap';
import styles from './style.less';

export default config({
    path: '/drag-page',
})(function DragPage(props) {
    const {
        action: {dragPage: dragPageAction},
    } = props;

    const {teamId, projectId} = props.match.params;
    const [showEmpty, setShowEmpty] = useState(true);

    const {loading, run: fetchProject} = props.ajax.useGet(`/teams/${teamId}/project/${projectId}`);

    useEffect(() => {
        (async () => {

            // const res = await fetchProject();
            // if (!res) {
            //     setShowEmpty(true);
            //     return;
            // }

            const res = null;

            setShowEmpty(false);

            // TODO 测试数据
            if (fetchProject) return;

            const {projectSetting, menus} = res;
            const options = {
                menus: menus || [],
            };

            if (projectSetting) {
                const otherKeys = [
                    'projectId',
                    'id',
                    'updatedAt',
                    'createdAt',
                ];

                Object.entries(projectSetting)
                    .forEach(([key, value]) => {
                        if (!otherKeys.includes(key)) options[key] = value;
                    });
            }

            dragPageAction.initDesignPage(options);
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <PageContent fitHeight className={styles.root} loading={loading}>
            {showEmpty && !loading ? (
                <div className={styles.emptyBox}>
                    <Empty description={
                        <div>
                            <div>项目已经不存在！</div>
                            <Button
                                style={{marginTop: 8}}
                                type="primary"
                                onClick={() => props.history.replace(`/teams/${teamId}`)}
                            >
                                返回项目列表
                            </Button>
                        </div>
                    }/>
                </div>
            ) : (
                <>
                    <KeyMap/>
                    <div className={styles.top}>
                        <Top/>
                    </div>
                    <div className={styles.main}>
                        <div className={styles.left}>
                            <Left/>
                        </div>
                        <div className={styles.center}>
                            <IframeRender/>
                        </div>
                        <div className={styles.right}>
                            <Right/>
                        </div>
                    </div>
                    <ArrowLines/>
                </>
            )}
        </PageContent>
    );
});
