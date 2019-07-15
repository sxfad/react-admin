import React, {Component} from 'react';
import {DndProvider} from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import config from '@/commons/config-hoc';
import PageContent from '@/layouts/page-content';
import ComponentContainer from './ComponentContainer';
import PageContainer from './PageContainer';

@config({path: '/drag-page'})
export default class index extends Component {
    render() {
        return (
            <DndProvider backend={HTML5Backend}>
                <PageContent style={{display: 'flex'}}>
                    <div style={{flex: '0 0 300px', borderRight: '1px solid #ccc'}}>
                        <ComponentContainer/>
                    </div>
                    <div style={{flex: 1}}>
                        <PageContainer/>
                    </div>
                </PageContent>
            </DndProvider>
        );
    }
}
