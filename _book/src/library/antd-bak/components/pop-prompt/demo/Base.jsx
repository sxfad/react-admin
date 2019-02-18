import React, {Component} from 'react';
import {PopPrompt} from '../../../index';

export default class Base extends Component {
    state = {};

    render() {
        return (
            <div style={{paddingLeft: 300}}>
                <PopPrompt
                    onConfirm={(values) => console.log(values)}
                >
                    <a>demo</a>
                </PopPrompt>
            </div>
        );
    }
}

export const title = '基础用法';

export const markdown = `
基础用法
`;
