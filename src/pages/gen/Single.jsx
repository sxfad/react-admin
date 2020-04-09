import React, {Component} from 'react';
import config from 'src/commons/config-hoc';
import PageContent from 'src/layouts/page-content';

@config({ajax: true})
export default class Single extends Component {
    state = {};

    componentDidMount() {

    }

    render() {
        return (
            <PageContent>
                单独生成
            </PageContent>
        );
    }
}
