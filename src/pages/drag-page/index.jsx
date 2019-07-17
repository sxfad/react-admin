import React, {Component} from 'react';
import {DndProvider} from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import config from '@/commons/config-hoc';
import PageContent from '@/layouts/page-content';
import ComponentContainer from './ComponentContainer';
import PageContainer from './PageContainer';
import ComponentSettings from './ComponentSettings';

@config({path: '/drag-page', event: true})
export default class index extends Component {
    state = {
        windowHeight: document.body.clientHeight,
    };

    componentDidMount() {
        this.props.addEventListener(window, 'resize', () => {
            const windowHeight = document.body.clientHeight;
            this.setState({windowHeight});
        })
    }

    render() {
        const {windowHeight} = this.state;
        const height = windowHeight - 32 - 50;

        return (
            <DndProvider backend={HTML5Backend}>
                <PageContent style={{display: 'flex'}}>
                    <div style={{
                        flex: '0 0 260px',
                        marginRight: 10,
                        padding: 10,
                        border: '1px solid #d9d9d9',
                        height,
                        overflow: 'auto',
                    }}>
                        <ComponentContainer/>
                    </div>
                    <div style={{
                        flex: 1,
                        padding: 10,
                        border: '1px solid #d9d9d9',
                        height,
                        overflow: 'auto',
                    }}>
                        <PageContainer/>
                    </div>
                    <div style={{
                        flex: '0 0 300px',
                        marginLeft: 10,
                        border: '1px solid #d9d9d9',
                        height,
                        overflow: 'auto',
                    }}>
                        <ComponentSettings/>
                    </div>
                </PageContent>
            </DndProvider>
        );
    }
}
