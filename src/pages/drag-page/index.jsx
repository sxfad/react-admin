import React, {useEffect, useState} from 'react';
import {Empty, Button} from 'antd';
import config from 'src/commons/config-hoc';
import {PageContent} from 'ra-lib';
import Top from './top';
import Left from './left';
import Right from './right';
import IframeRender from './iframe-render';
import ArrowLines from './arrow-lines';
import KeyMap from './KeyMap';
import './style.less';

export default config({
    path: '/drag-page',
    side: false,
    noFrame: true,
})(function DragPage(props) {
    const {
        action: {dragPage: dragPageAction},
    } = props;

    const {teamId, projectId} = props.match.params;
    const [showEmpty, setShowEmpty] = useState(true);

    const [loading, fetchProject] = props.ajax.useGet(`/teams/${teamId}/project/${projectId}`);

    useEffect(() => {
        (async () => {

            const res = await fetchProject();
            // if (!res) {
            //     setShowEmpty(true);
            //     return;
            // }

            setShowEmpty(false);
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
    }, []);

    return (
        <PageContent fitHeight styleName="root" loading={loading}>
            {showEmpty && !loading ? (
                <div styleName="emptyBox">
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
                    <div styleName="top">
                        <Top/>
                    </div>
                    <div styleName="main">
                        <div styleName="left">
                            <Left/>
                        </div>
                        <div styleName="center">
                            <IframeRender/>
                        </div>
                        <div styleName="right">
                            <Right/>
                        </div>
                    </div>
                    <ArrowLines/>
                </>
            )}
        </PageContent>
    );
});
