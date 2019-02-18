import React, {Component} from 'react';
import {
    Form,
    Input,
    Row,
    Col,
    TreeSelect,
    Tooltip,
    Icon,
    Button,
} from 'antd';
import {FormItemLayout} from 'sx-antd';
import {connect} from '@/models';

@connect(state => ({
    baseInfo: state.baseInfo,
    listEditModel: state.listEditModel,
    srcDirectories: state.generator.srcDirectories,
}))
@Form.create({
    mapPropsToFields: (props) => {
        const fields = {};
        const listEditModel = props.listEditModel;

        [
            'outPutDir',
            'outPutFile',
            'template',
        ].forEach(key => {
            fields[key] = Form.createFormField({
                ...listEditModel[key],
                value: listEditModel[key].value,
            });
        });

        return fields;
    },
    onFieldsChange: (props, fields) => {
        props.action.listEditModel.setFields(fields);
    },
})
export default class EditPage extends Component {
    state = {};

    componentWillMount() {
        const {formRef, form, validate} = this.props;
        if (formRef) formRef(form);
        if (validate) validate(this.validate);

        this.props.action.generator.getSrcDirs({
            onResolve: (dirs) => {
                if (dirs && dirs.length) {
                    const dir = dirs.find(item => item.value.endsWith('/src/pages'));
                    if (dir) {
                        form.setFieldsValue({outPutDir: dir.value});
                    }
                }
            },
        });
    }

    componentWillReceiveProps(nextProps) {
        const {form: {setFieldsValue}} = this.props;
        const oldName = this.props.baseInfo.name.value;
        const name = nextProps.baseInfo.name.value;

        if (name !== oldName) {
            const outPutFile = `${name}/model.js`;

            setFieldsValue({
                outPutFile,
            });
        }
    }

    validate = () => {
        const {form} = this.props;

        const promises = [
            form,
        ].map(item => new Promise((resolve, reject) => {
            item.validateFieldsAndScroll((err, values) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(values)
                }
            });
        }));

        return Promise.all(promises).then(([listEditModel]) => listEditModel);
    };

    render() {
        const {
            form: {getFieldDecorator},
            srcDirectories,
            onPreviewCode,
        } = this.props;
        const labelSpaceCount = 12;
        const span = 8;
        const tipWidth = 30;

        return (
            <Form>
                {getFieldDecorator('template')(<Input type="hidden"/>)}
                <Row>
                    <Col span={span}>
                        <FormItemLayout
                            label="生成文件目录/文件名"
                            labelSpaceCount={labelSpaceCount}
                            tip={<div style={{float: 'left', margin: '0 8px'}}>/</div>}
                            tipWidth={tipWidth}
                        >
                            {getFieldDecorator('outPutDir', {
                                rules: [
                                    {required: true, message: '请选择生成文件的目录',},
                                ],
                            })(
                                <TreeSelect
                                    style={{width: '100%'}}
                                    showSearch
                                    dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                                    treeData={srcDirectories}
                                    placeholder="请选择生成文件的目录"
                                    treeDefaultExpandAll
                                    treeNodeLabelProp="shortValue"
                                />
                            )}
                        </FormItemLayout>
                    </Col>
                    <Col span={span}>
                        <FormItemLayout
                            labelWidth={0}
                            tip={(
                                <Tooltip
                                    placement="right"
                                    title="可以继续填写子目录，比如：user/UserList.jsx，将自动创建user目录"
                                >
                                    <Icon type="question-circle-o"/>
                                </Tooltip>
                            )}
                            tipWidth={tipWidth}
                        >
                            {getFieldDecorator('outPutFile', {
                                rules: [
                                    {required: true, message: '请输入生成的文件名',},
                                ],
                            })(
                                <Input placeholder="请输入生成的文件名"/>
                            )}
                        </FormItemLayout>
                    </Col>
                </Row>
                <div style={{marginTop: '16px'}}>
                    <Button type="primary" onClick={onPreviewCode}>代码预览</Button>
                </div>
            </Form>
        );
    }
}
