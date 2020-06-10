import React, {Component} from 'react';
import {Tabs, Button} from 'antd';
import config from 'src/commons/config-hoc';
import {ModalContent} from 'src/library/components';
import SourceCode from './SourceCode';

const {TabPane} = Tabs;

@config({
    modal: {
        title: '代码预览',
        width: '70%',
    },
})
export default class index extends Component {
    state = {};

    componentDidMount() {

    }

    render() {
        const {previewCode, onCancel} = this.props;
        return (
            <ModalContent
                surplusSpace
                footer={<Button onClick={onCancel}>关闭</Button>}
                bodyStyle={{padding: '0 0 0 16px'}}
            >
                <Tabs>
                    {previewCode.map(item => {
                        const {config: {fileTypeName}, code} = item;
                        return (
                            <TabPane tab={fileTypeName} key={fileTypeName}>
                                <SourceCode
                                    language="jsx"
                                    plugins={['line-numbers']}
                                    code={code}
                                />
                            </TabPane>
                        );
                    })}
                </Tabs>
            </ModalContent>
        );
    }
}
