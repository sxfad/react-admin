import React, {Component} from 'react';
import {DndProvider} from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import config from '@/commons/config-hoc';
import PageContent from '@/layouts/page-content';
import ComponentContainer from './ComponentContainer';
import PageContainer from './PageContainer';
import ComponentSettings from './ComponentSettings';
import './index-style.less';

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
        const height = windowHeight - 20 - 50;

        return (
            <DndProvider backend={HTML5Backend}>
                <PageContent styleName="root">
                    <div styleName="component-container" style={{height,}}>
                        <ComponentContainer/>
                    </div>
                    <div styleName="page-container" style={{height,}}>
                        <PageContainer/>
                    </div>
                    <div styleName="component-settings" style={{height,}}>
                        <ComponentSettings/>
                    </div>
                </PageContent>
            </DndProvider>
        );
    }
}
