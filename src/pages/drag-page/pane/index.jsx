import React from 'react';
import {PageContent} from 'ra-lib';
import './style.less';
import {OTHER_HEIGHT} from 'src/pages/drag-page/util';

export default function Pane(props) {
    const {header, fitHeight, children} = props;
    return (
        <PageContent
            fitHeight={fitHeight}
            otherHeight={OTHER_HEIGHT}
            styleName="root"
            style={{width: '100%'}}
        >
            <header>
                {header}
            </header>
            <main>
                {children}
            </main>
        </PageContent>
    );
};
