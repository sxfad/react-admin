import React from 'react';
import config from '@/commons/config-hoc';
import { Layout, FullScreen, HeaderSetting, isMobile } from 'ra-lib';
import './style.less';
import HeaderUser from './header-user';
import logo from './logo.png';


// 单独包装 传递整体layoutState
// layoutState 会频繁改变，放到 AppRouter，会导致 AppRouter 也频繁render
export default config({
    connect: state => ({ layoutState: state.layout }),
})(function LayoutFrame(props) {
    const { action, layoutState } = props;

    return (
        <Layout
            {...props}
            logo={logo}
            headerRight={
                <>
                    {isMobile ? null : (
                        <>
                            <div styleName="fullScreen">
                                <FullScreen/>
                            </div>
                            <HeaderSetting
                                layoutState={layoutState}
                                action={action}
                            />
                        </>
                    )}
                    <HeaderUser/>
                </>
            }
        />
    );
});
