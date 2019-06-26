import React, {Component} from 'react';

export default class Child extends Component {
    state = {};

    componentDidMount() {
        console.log('child componentDidMount');
    }

    render() {
        return (
            <div>
                init Child
            </div>
        );
    }
}
