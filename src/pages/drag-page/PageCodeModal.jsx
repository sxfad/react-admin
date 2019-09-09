import React, {Component, Fragment} from 'react';
import config from '@/commons/config-hoc';
import {Button} from "antd";
import {ModalContent} from "@/library/components";
import SourceCode from "@/pages/drag-page/SourceCode";
import {getPageSourceCode} from "@/pages/drag-page/render-utils";


@config({
    modal: {
        title: '页面源码',
        style: {top: 50},
    },
    connect: state => ({pageConfig: state.dragPage.pageConfig})
})
export default class PageCodeModal extends Component {
    state = {};

    componentDidMount() {

    }

    render() {
        const {onCancel, pageConfig} = this.props;
        return (
            <ModalContent
                footer={
                    <Fragment>
                        <Button onClick={onCancel} type="primary">关闭</Button>
                    </Fragment>
                }
            >
                <SourceCode
                    code={getPageSourceCode({virtualDom: pageConfig})}
                    language="jsx"
                    plugins={["line-numbers"]}
                    width="auto"
                />
            </ModalContent>
        );
    }
}
