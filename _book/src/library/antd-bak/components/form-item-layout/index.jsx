import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Form from 'antd/lib/form';
import 'antd/lib/form/style/css';

/**
 * 基于antd FormItem进行布局，label固定宽度，表单元素自适应
 * 使用了antd的两个class，会依赖FormItem的结构
 *
 * */
const FormItem = Form.Item;

export default class FormItemLayout extends Component {
    static propTypes = {
        className: PropTypes.string,        // 添加在FormItem父级div上的class
        style: PropTypes.object,            // 添加在FormItem 父级div上的样式
        width: PropTypes.oneOfType([        // FormItem父级div的总宽度 label + element
            PropTypes.string,
            PropTypes.number,
        ]),
        float: PropTypes.bool,              // 是否是浮动，如果true，将左浮动
        label: PropTypes.any,               // 标签
        labelWidth: PropTypes.number,       // label宽度，如果设置此值，labelSpaceCount 和 labelFontSize将失效
        labelSpaceCount: PropTypes.number,  // label所占空间个数，用于与其他label对齐
        labelFontSize: PropTypes.number,    // label字体大小，最终labelWidth = labelSpaceCount * labelFontSize
        tip: PropTypes.oneOfType([          // 输入框后面的提示信息
            PropTypes.string,
            PropTypes.element,
        ]),
        tipWidth: PropTypes.number,         // tip信息的宽度
        tipColor: PropTypes.string,         // tip信息的颜色
    };

    static defaultProps = {
        labelSpaceCount: 5,
        labelFontSize: 12,
        tipColor: 'rgba(0,0,0,.43)',
    };

    state = {};

    componentDidMount() {
        const labelWidth = this.getLabelWidth();
        // FIXME 这里嵌套使用的时候会出问题， 外层 labelWidth 会影响到内层 labelWidth
        const antFormItemLabel = this.formItemDom.querySelector('.ant-form-item-label');
        const antFormItemControlWrapper = this.formItemDom.querySelector('.ant-form-item-control-wrapper');
        if (antFormItemLabel) {
            antFormItemLabel.style.width = `${labelWidth}px`;
            antFormItemLabel.style.float = 'left';
        }
        if (antFormItemControlWrapper) {
            antFormItemControlWrapper.style.paddingLeft = `${labelWidth}px`;
        }
    }

    /**
     * 获取 label宽度，labelWidth属性优先
     * 如果没有设置width，最终labelWidth = labelSpaceCount * labelFontSize
     * 默认width = 5 * 12 = 60
     *
     * @returns {Number}
     */
    getLabelWidth() {
        const {labelWidth, labelSpaceCount, labelFontSize} = this.props;
        if (labelWidth !== undefined) return labelWidth;
        return (labelSpaceCount + 2) * labelFontSize;
    }

    render() {
        const {
            id,
            className,
            style,
            width,
            float,
            children,
            tip,
            tipWidth,
            tipColor,
        } = this.props;

        const wrapperProps = {};
        if (id) wrapperProps.id = id;
        if (className) wrapperProps.className = className;
        if (style) wrapperProps.style = style;
        if (!wrapperProps.style) wrapperProps.style = {};
        if (width && !wrapperProps.style.width) wrapperProps.style.width = width;
        if (float && !wrapperProps.style.float) wrapperProps.style.float = 'left';

        const formItemProps = {...this.props};
        const ignoreProps = [
            'tip',
            'tipWidth',
            'tipColor',
            'className',
            'style',
            'width',
            'float',
            'labelWidth',
            'labelSpaceCount',
            'labelFontSize',
        ];
        ignoreProps.forEach(item => {
            Reflect.deleteProperty(formItemProps, item);
        });

        if (tip || tipWidth) {
            wrapperProps.style.display = 'table';
            wrapperProps.style.tableLayout = 'fixed';
            if (!wrapperProps.style.width) wrapperProps.style.width = '100%';
        }

        return (
            <div {...wrapperProps} ref={node => this.formItemDom = node}>
                <FormItem {...formItemProps}>
                    {children}
                </FormItem>
                {
                    (tip || tipWidth) ?
                        <div style={{
                            display: 'table-cell',
                            width: tipWidth,
                            paddingLeft: 8,
                            paddingTop: 8,
                            color: tipColor,
                        }}>
                            {tip}
                        </div>
                        : null
                }
            </div>
        );
    }
}
