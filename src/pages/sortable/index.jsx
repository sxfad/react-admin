import React from 'react'
import Example from './example'
import {DndProvider} from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import config from '@/commons/config-hoc';

@config({path: '/sortable'})
export default class Sortable extends React.Component {

    render() {

        return (
            <div>
                <DndProvider backend={HTML5Backend}>
                    <div style={{display: 'flex'}}>
                        <Example/>
                    </div>
                </DndProvider>
            </div>
        );
    }
}

