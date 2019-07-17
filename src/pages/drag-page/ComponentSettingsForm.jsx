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

            const {
                currentNode,
            } = this.props;

            const finaleProps = {};
            const props = components[currentNode.__type].props || [];

            Object.keys(values).forEach(key => {
                const value = values[key];
                const propsConfig = props.find(item => item.attribute === key);
                if (propsConfig) {
                    const {defaultValue} = propsConfig;
                    if (value !== void 0 && value !== defaultValue) {
                        finaleProps[key] = value;
                    }
                }
            });

            const {__TODO} = values;

            this.props.action.dragPage.setProps({targetId: currentNode.__id, props: {__TODO, ...finaleProps}});
        })
    }, 500);

    FormElement = (props) => <FormElement form={this.props.form} labelWidth={50} disabled={this.props.isDetail} {...props}/>;

    render() {
        let {
            currentNode,
        } = this.props;

        if (!currentNode) currentNode = {};
        let currentComponent = components[currentNode.__type] || {};
        let props = currentComponent.props || [];

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
                            label="说明"
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
