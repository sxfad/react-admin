import React, {Component} from 'react';
import config from 'src/commons/config-hoc';
import PageContent from 'src/layouts/page-content';


const MyTestFun = config({
    path: '/my-test',
})(() => {
    return (
        <PageContent>
            我的第一个页面
        </PageContent>
    );
});

@config({
    path: '/my-test',
})
export default class MyTest extends Component {
    state = {};

    componentDidMount() {

    }

    render() {
        return (
            <PageContent>
                我的第一个页面
            </PageContent>
        );
    }
}
