import React, {Component} from 'react';
import {NoData} from '../../../index';

export default class Base extends Component {
    state = {};

    render() {
        return (
            <NoData/>
        );
    }
}


export const title = '基础用法';

export const markdown = `
no-data
`;

