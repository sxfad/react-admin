import React from 'react';
import {PageContent} from '@ra-lib/admin';
import {OTHER_HEIGHT} from 'src/pages/drag-page/util';
import styles from './style.less';

export default function Pane(props) {
    const {header, fitHeight, children} = props;
    return (
        <PageContent
            fitHeight={fitHeight}
            otherHeight={OTHER_HEIGHT}
            className={styles.root}
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
