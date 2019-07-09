import React from 'react'
import DndExample from './dnd';
import {DndProvider} from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import config from '@/commons/config-hoc';

@config({path: '/dnd'})
export default class DnD extends React.Component {

    render() {
        return (
            <div style={{width: '100%'}}>
                <DndProvider backend={HTML5Backend}>
                    <DndExample/>
                </DndProvider>
            </div>
        );
    }
}
