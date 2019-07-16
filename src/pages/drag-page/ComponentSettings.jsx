import React, {Component} from 'react';
import config from '@/commons/config-hoc';

@config({
    connect: state => {
        return {
            pageConfig: state.dragPage.pageConfig,
            currentId: state.dragPage.currentId,
            showGuideLine: state.dragPage.showGuideLine,
        }
    },
})
export default class ComponentSettings extends Component {
    state = {};

    componentDidMount() {

    }

    render() {
        return (
            <div>
                {this.props.currentId}
            </div>
        );
    }
}
