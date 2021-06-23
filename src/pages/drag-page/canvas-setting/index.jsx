import React, {useEffect} from 'react';
import {Form, Switch} from 'antd';
import {AppstoreOutlined} from '@ant-design/icons';
import config from 'src/commons/config-hoc';
import Pane from '../pane';
import UnitInput from 'src/pages/drag-page/component-style/unit-input';
import RadioGroup from 'src/pages/drag-page/component-style/radio-group';
import {isMac} from 'src/pages/drag-page/util';

import styles from  './style.less';

const layout = {
    labelCol: {flex: '60px'},
    wrapperCol: {flex: '1 1 0%'},
};

export default config({
    router: true,
    connect: state => {
        return {
            canvasWidth: state.dragPage.canvasWidth,
            contentEditable: state.dragPage.contentEditable,
            canvasHeight: state.dragPage.canvasHeight,
            nodeSelectType: state.dragPage.nodeSelectType,
        };
    },
})(function ComponentTree(props) {
    const {teamId, projectId} = props.match.params;

    const {
        canvasWidth,
        canvasHeight,
        nodeSelectType,
        contentEditable,
        action: {dragPage: dragPageAction},
    } = props;
    const [form] = Form.useForm();
    const {run: save} = props.ajax.usePost(`/teams/${teamId}/project/${projectId}/setting`);

    async function handleChange(changedValues, allValues) {
        const {
            canvasWidth,
            canvasHeight,
            nodeSelectType,
            contentEditable,
        } = allValues;
        dragPageAction.setCanvasWidth(canvasWidth);
        dragPageAction.setCanvasHeight(canvasHeight);
        dragPageAction.setNodeSelectType(nodeSelectType);
        dragPageAction.setContentEditable(contentEditable);

        await save({
            canvasWidth,
            canvasHeight,
            nodeSelectType,
            contentEditable,
        });
    }

    const fieldsValue = {
        canvasWidth,
        canvasHeight,
        nodeSelectType,
        contentEditable,
    };
    useEffect(() => {
        form.setFieldsValue(fieldsValue);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [Object.values(fieldsValue)]);

    // TODO 提供 iphoneX PC 等预设

    return (
        <Pane
            header={
                <div>
                    <AppstoreOutlined style={{marginRight: 4}}/>
                    画布设置
                </div>
            }
        >
            <div className={styles.root}>
                <Form
                    form={form}
                    onValuesChange={handleChange}
                    name="canvasSetting"
                >
                    <Form.Item
                        {...layout}
                        label="宽度"
                        name="canvasWidth"
                        colon={false}
                    >
                        <UnitInput/>
                    </Form.Item>
                    <Form.Item
                        {...layout}
                        label="高度"
                        name="canvasHeight"
                        colon={false}
                    >
                        <UnitInput/>
                    </Form.Item>
                    <Form.Item
                        {...layout}
                        label="选中元素"
                        name="nodeSelectType"
                        colon={false}
                    >
                        <RadioGroup
                            showTooltip={false}
                            allowClear={false}
                            style={{width: '100%'}}
                            options={[
                                {value: 'click', label: '左键'},
                                {value: 'meta', label: `${isMac ? '⌘' : 'ctrl'}+左键`},
                            ]}
                        />
                    </Form.Item>
                    <Form.Item
                        {...layout}
                        label="可编辑"
                        name="contentEditable"
                        colon={false}
                        valuePropName="checked"
                    >
                        <Switch/>
                    </Form.Item>
                </Form>
            </div>
        </Pane>
    );
});
