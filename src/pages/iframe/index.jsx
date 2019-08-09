import React, {Component} from 'react';
import config from '@/commons/config-hoc';
import PageContent from '@/layouts/page-content';
import './style.less';

@config({
    path: '/iframe_page_/:src',
    keepAlive: true,
})
export default class IFrame extends Component {
    render() {
        let {src} = this.props.match.params;
        src = window.decodeURIComponent(src);
        return (
            <div styleName="iframe">
                <iframe
                    title={src}
                    src={src}
                />
            </div>
        );
    }
}
