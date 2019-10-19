import React, {Component} from 'react';
import Example from './Example';
import config from "@/commons/config-hoc";

@config({
    path: '/',
    title: {text: '首页', icon: 'home'},
    breadcrumbs: [{key: 'home', text: '首页', icon: 'home'}],
    keepAlive: false,
})
export default class Home extends Component {

    render() {
        return <Example/>
    }
}
