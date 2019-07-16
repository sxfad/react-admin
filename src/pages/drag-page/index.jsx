import React, {Component} from 'react';
import {DndProvider} from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import config from '@/commons/config-hoc';
import PageContent from '@/layouts/page-content';
import ComponentContainer from './ComponentContainer';
import PageContainer from './PageContainer';
import ComponentSettings from './ComponentSettings';

@config({path: '/drag-page'})
export default class index extends Component {
    render() {
        return (
            <DndProvider backend={HTML5Backend}>
                <PageContent style={{display: 'flex'}}>
                    <div style={{
                        flex: '0 0 300px',
                        marginRight: 10,
                        border: '1px solid #d9d9d9',
                    }}>
                        <ComponentContainer/>
                    </div>
                    <div style={{
                        flex: 1,
                        padding: 10,
                        border: '1px solid #d9d9d9',
                    }}>
                        <PageContainer/>
                    </div>
                    <div style={{
                        flex: '0 0 300px',
                        marginLeft: 10,
                        border: '1px solid #d9d9d9',
                    }}>
                        <ComponentSettings/>
                    </div>
                </PageContent>
            </DndProvider>
        );
    }
}
