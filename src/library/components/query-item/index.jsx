import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Form, Button} from 'antd';
import FormElement from '../form-element';
import {isFunction} from 'lodash/lang';
import './index.less';

/**
 * 查询条件封装，通过传入items即可生成查询条件
 * item属性：
 * collapsedShow： 收起时，是否显示，用来区分展开/收起时所显示哪些项
 * 其他参见 FormElement 属性
 */
@Form.create()
export default class QueryItem extends Component {
    static propTypes = {
        showSubmit: PropTypes.bool,
        submitText: PropTypes.any,
        showReset: PropTypes.bool,
        buttonContainerStyle: PropTypes.string,
        resetText: PropTypes.any,
        collapsed: PropTypes.bool,
        items: PropTypes.array,
        itemWidth: PropTypes.number,
        itemLabelWidth: PropTypes.number,
        onSubmit: PropTypes.func,
        formRef: PropTypes.func,
        extra: PropTypes.any,
        loadOptions: PropTypes.func,
        buttonAlone: PropTypes.bool,
    };

    static defaultProps = {
        showSubmit: true,
        submitText: '查询',
        showReset: true,
        resetText: '重置',
        buttonAlone: false,
        collapsed: false,
        items: [],
        onSubmit: () => true,
        extra: null,
    };

    state = {
        options: {}, // 所有元素的options
        visible: {}, // 说有元素是否显示
    };

    componentDidMount() {
        const {formRef, form, loadOptions} = this.props;

        // 处理form引用
        if (formRef) formRef(form);

        // 统一获取options
        if (loadOptions) {
            const result = loadOptions(form);

            if (result instanceof Promise) {
                result.then((data) => this.setState({options: data})).then(() => {
                    this.getSingleOptions().then(data => {
                        const options = {...this.state.options, ...data};

                        this.setState({options});
                    });
                });
            } else {
                this.setState({options: result});

                this.getSingleOptions().then(data => {
                    const options = {...result, ...data};
                    this.setState({options})
                });
            }
        } else {
            this.getSingleOptions().then(data => {
                this.setState({options: data});
            });
        }

        const visible = this.getSingleVisible();
        this.setState({visible});
    }

    // 获取字段改变需要触发的函数
    getChangeTriggers = () => {
        const {items} = this.props;
        const triggers = {};
        if (items && items.length) {
            items.forEach(data => {
                if (!Array.isArray(data)) {
                    data = [data];
                }

                data.forEach(item => {
                    let {field, parentField, options, visible} = item;

                    if (parentField) {
                        const item = {field};

                        // 如果options是函数，父级改变需要触发
                        if (isFunction(options)) item.options = options;

                        // 如果visible是函数，父级改变需要触发
                        if (isFunction(visible)) item.visible = visible;

                        if (!triggers[parentField]) triggers[parentField] = [item];

                        if (!triggers[parentField].find(it => it.field === item.field)) {
                            triggers[parentField].push(item);
                        }

                    }

                });
            })
        }
        return triggers;
    };

    getSingleVisible = () => {
        const {form, items} = this.props;

        const result = {};

        if (items && items.length) {
            items.forEach(data => {
                if (!Array.isArray(data)) {
                    data = [data];
                }

                data.forEach(item => {
                    let {field, parentField, visible} = item;
                    if (isFunction(visible)) {
                        const {form: {getFieldsValue, getFieldValue}} = this.props;
                        const values = parentField ? getFieldValue(parentField) : getFieldsValue();
                        result[field] = visible(values, form);
                    } else if (visible !== void 0) {
                        result[field] = visible;
                    }

                });
            });

            return result;
        }
    };

    // 单独获取options
    getSingleOptions = () => {
        return new Promise((resolve, reject) => {
            const {form, items} = this.props;
            const allPromise = {};

            if (items && items.length) {
                items.forEach(data => {
                    if (!Array.isArray(data)) {
                        data = [data];
                    }

                    data.forEach(item => {
                        let {field, parentField, options} = item;
                        if (isFunction(options)) {

                            const {form: {getFieldsValue, getFieldValue}} = this.props;
                            const values = parentField ? getFieldValue(parentField) : getFieldsValue();

                            const parentOptions = this.state.options[parentField] || [];
                            const parentValue = parentField ? getFieldValue(parentField) : void 0;
                            const parentItem = parentOptions.find(it => it.value === parentValue);
                            const parentOpt = data.find(it => it.field === parentField);

                            const result = options(values, {form, parentItem, parentChange: false, options: item, parentOptions: parentOpt});

                            if (result instanceof Promise) {
                                allPromise[field] = result;
                            } else {
                                allPromise[field] = Promise.resolve(result);
                            }
                        }
                    });
                });

                const allP = [];
                const allK = [];
                Object.keys(allPromise).forEach(key => {
                    const p = allPromise[key];
                    allK.push(key);
                    allP.push(p);
                });

                return Promise.all(allP)
                    .then(data => {
                        const result = {};
                        data.forEach((item, index) => result[allK[index]] = item);

                        resolve(result);
                    })
                    .catch(reject);
            }
        });
    };


    handleSubmit = (e) => {
        e.preventDefault();
        const {onSubmit, form} = this.props;
        form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                onSubmit(values);
            }
        });
    };

    render() {
        const {
            items,
            itemWidth,
            itemLabelWidth,
            showSubmit,
            submitText,
            showReset,
            resetText,
            collapsed,
            form,
            extra,
            buttonContainerStyle,
            buttonAlone,
        } = this.props;

        return (
            <Form onSubmit={this.handleSubmit}>
                {
                    /*
                     * items 中元素为数组，则数组中所有表单元素占一行
                     *       如果不是数组，则独自占一行
                     * 查询按钮，拼接到最后一行
                     * */
                    items.map((data, index) => {
                        if (!Array.isArray(data)) {
                            data = [data];
                        }
                        return (
                            <div key={index} className="query-item-element-container">
                                {data.map(item => {
                                    let {itemStyle = {}, width = itemWidth, labelWidth = itemLabelWidth, field, collapsedShow, ...others} = item;

                                    const visible = this.state.visible[field] === void 0 ? true : this.state.visible[field];

                                    if (visible === false) return null;


                                    const style = {display: 'block'};

                                    if (width) {
                                        itemStyle = {flex: `0 0 ${width}px`, ...itemStyle};
                                    }

                                    const options = this.state.options[field] || [];
                                    if (options && (!others.options || isFunction(others.options))) others.options = options;

                                    if (collapsed && !collapsedShow) {
                                        style.display = 'none'
                                    }

                                    // 字段改变，触发关联字段相关options函数
                                    const optionsTriggers = this.getChangeTriggers();
                                    const currentTrigger = optionsTriggers[field];

                                    if (currentTrigger) {
                                        const oriOnChange = others.decorator ? others.decorator.onChange : () => void 0;
                                        const newOnChange = (...args) => {
                                            // setTimeout 是 为了获取最新的value
                                            setTimeout(() => {
                                                const value = form.getFieldValue(field);
                                                const parentItem = this.state.options[field] && this.state.options[field].find(it => it.value === value);
                                                const parentOptions = data.find(i => i.field === item.parentField);

                                                currentTrigger.forEach(it => {
                                                    const {
                                                        field: triggerField,
                                                        options: triggerOptions,
                                                        visible: triggerVisible,
                                                    } = it;

                                                    if (triggerOptions) {
                                                        const opts = triggerOptions(value, {form, parentItem, options: item, parentOptions, parentChange: true});

                                                        if (opts instanceof Promise) {
                                                            opts.then(data => {
                                                                this.setState({options: {...this.state.options, [triggerField]: data}});
                                                            });
                                                        } else {
                                                            this.setState({options: {...this.state.options, [triggerField]: opts}});
                                                        }
                                                    }

                                                    if (triggerVisible) {
                                                        const vis = triggerVisible(value, {form, parentItem, options: item, parentOptions, parentChange: true});

                                                        if (vis instanceof Promise) {
                                                            vis.then(data => {
                                                                this.setState({visible: {...this.state.visible, [triggerField]: data}});
                                                            });
                                                        } else {
                                                            this.setState({visible: {...this.state.visible, [triggerField]: vis}});
                                                        }
                                                    }
                                                });

                                                if (oriOnChange) oriOnChange(...args);
                                            });
                                        };

                                        item._onChange = newOnChange;
                                        others.decorator = {
                                            ...others.decorator,

                                            onChange: newOnChange,
                                        };
                                    }

                                    return (
                                        <div
                                            key={field}
                                            style={{...itemStyle, ...style}}
                                        >
                                            <FormElement
                                                form={form}
                                                field={field}
                                                labelWidth={labelWidth}
                                                {...others}
                                            />
                                        </div>
                                    );
                                })}
                                {!buttonAlone && index === items.length - 1 && (showSubmit || showReset || extra) ? (
                                    <div className="query-item-button-container" style={{...buttonContainerStyle, paddingTop: '7px'}}>
                                        {showSubmit ? (
                                            <Button
                                                type="primary"
                                                htmlType="submit"
                                                icon="search"
                                            >
                                                {submitText}
                                            </Button>
                                        ) : null}
                                        {showReset ? (
                                            <Button
                                                type="ghost"
                                                icon="rollback"
                                                onClick={() => form.resetFields()}
                                            >
                                                {resetText}
                                            </Button>
                                        ) : null}
                                        {extra}
                                    </div>
                                ) : null}
                            </div>
                        );
                    })
                }
                {buttonAlone ? (
                    <div className="query-item-button-container" style={{...buttonContainerStyle, paddingTop: '4px'}}>
                        {showSubmit ? (
                            <Button
                                type="primary"
                                htmlType="submit"
                                icon="search"
                            >
                                {submitText}
                            </Button>
                        ) : null}
                        {showReset ? (
                            <Button
                                type="ghost"
                                icon="rollback"
                                onClick={() => form.resetFields()}
                            >
                                {resetText}
                            </Button>
                        ) : null}
                        {extra}
                    </div>
                ) : null}
            </Form>
        );
    }
}
