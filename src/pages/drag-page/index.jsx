import React, {Component} from 'react';
import {DndProvider} from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import config from '@/commons/config-hoc';
import PageContent from '@/layouts/page-content';
import ComponentContainer from './ComponentContainer';
import PageContainer from './PageContainer';
import ComponentSettings from './ComponentSettings';
import {getElementTop} from '@/library/utils';
import './index-style.less';

@config({path: '/drag-page', event: true, noFrame: true})
export default class index extends Component {
    state = {
        windowHeight: document.body.clientHeight,
    };

    componentDidMount() {
        this.setHeight();
        this.props.addEventListener(window, 'resize', () => {
            this.setHeight();
        });
    }

    setHeight = () => {
        const windowHeight = document.body.clientHeight;
        const top = getElementTop(this.container);

        this.setState({height: windowHeight - 10 - top});
    };

    render() {
        const {height} = this.state;

        return (
            <DndProvider backend={HTML5Backend}>
                <PageContent styleName="root">
                    <div ref={node => this.container = node} styleName="component-container" style={{height,}}>
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
