import React, {Component} from 'react';
import {Alert, Form} from 'antd';
import config from '@/commons/config-hoc';
import components from './components';
import {FormElement} from '@/library/antd';
import {debounce} from 'lodash';

@config({
    event: true,
    connect: state => {
        return {
            currentNode: state.dragPage.currentNode,
        }
    },
})
@Form.create()
export default class ComponentSettings extends Component {
    handlePropsChange = debounce(() => {
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (err) return;
            const {currentNode} = this.props;
            const propsConfigs = components[currentNode.__type].props || [];

            this.props.action.dragPage.setProps({
                targetId: currentNode.__id,
                newProps: values,
                propsConfigs,
            });
        })
    }, 500);

    FormElement = (props) => <FormElement form={this.props.form} labelWidth={60} disabled={this.props.isDetail} {...props}/>;

    render() {
        let {
            currentNode,
        } = this.props;

        const currentComponent = components[(currentNode || {}).__type] || {};
        const props = currentComponent.props || [];

        const FormElement = this.FormElement;
        return (
            <Form>
                {currentNode ? (
                    <div>
                        <h3 style={{textAlign: 'center'}}>{currentComponent.title}</h3>
                        {props.map(item => {
                            const {
                                name,
                                attribute,
                                valueType,
                                defaultValue,
                                formType = 'input',
                                ...others
                            } = item;
                            return (
                                <FormElement
                                    key={attribute}
                                    type={formType}
                                    label={name}
                                    field={attribute}
                                    initialValue={currentNode[attribute] || defaultValue}
                                    onChange={this.handlePropsChange}
                                    {...others}
                                />
                            );
                        })}
                        <FormElement
                            type="textarea"
                            label="备注"
                            field="__TODO"
                            initialValue={currentNode['__TODO']}
                            placeholder="特殊说明，用于给开发人员提示"
                            rows={3}
                            onChange={this.handlePropsChange}
                        />
                    </div>
                ) : (
                    <Alert type="error" message="点击组件进行属性编辑"/>
                )}
            </Form>
        );
    }
}
