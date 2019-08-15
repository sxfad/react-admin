import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Icon, Popconfirm, Dropdown, Menu, Tooltip} from 'antd';
import './index.less';

/**
 * 操作封装，一般用于表格最后的操作列中
 */
export default class Operator extends Component {
    static propTypes = {
        items: PropTypes.arrayOf(PropTypes.shape({
            label: PropTypes.isRequired,
            icon: PropTypes.string,
            visible: PropTypes.bool,
            disabled: PropTypes.bool,
            color: PropTypes.string,
            loading: PropTypes.bool,
            isMore: PropTypes.bool,

            onClick: PropTypes.func,
            confirm: PropTypes.object,
            statusSwitch: PropTypes.object,
        })),
        moreText: PropTypes.any,
        moreContentWidth: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
        moreTrigger: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.array,
        ]),
    };

    static defaultProps = {
        items: [],
        moreText: <span>更多<Icon type="down"/></span>,
        moreContentWidth: 'auto',
        moreTrigger: 'click',
    };

    loadingIcon = <Icon type="loading"/>;

    label = {};

    getLabel = (options, i) => {
        let {label, icon, loading, color, disabled} = options;

        if (loading) {
            const labelWidth = this.label[i] ? this.label[i].offsetWidth : 'auto';
            return <a className="operator-label" style={{display: 'inline-block', width: labelWidth, textAlign: 'center'}}>{this.loadingIcon}</a>;
        }

        const labelStyle = {};

        if (color) labelStyle.color = color;

        if (icon) {
            label = <Tooltip placement="bottom" title={label}><Icon style={{fontSize: 16}} type={icon}/></Tooltip>;
        }

        return <a className={`operator-label ${disabled ? 'operator-label-disabled' : ''}`} style={labelStyle} ref={v => this.label[i] = v}>{label}</a>;
    };

    /*
     * 如果含有confirm属性，即表明是Popconfirm，
     * confirm作为Popconfirm的props
     *
     * 其他元素同理
     * */
    getConfirm = (options, i) => {
        let label = this.getLabel(options, i);
        const {confirm, withKey = true} = options;

        // 配合 alt command ctrl 键使用，不弹出提示
        if (withKey) {
            label = (
                <span onClick={(e) => {
                    if (e.altKey || e.metaKey || e.ctrlKey) {
                        e.stopPropagation();
                        e.preventDefault();

                        if (confirm && confirm.onConfirm) {
                            confirm.onConfirm(e);
                        }
                    }
                }}>
                    {label}
                </span>
            );
        }
        return (
            <Popconfirm {...confirm}>
                {label}
            </Popconfirm>
        );
    };

    getText = (options, i) => {
        let label = this.getLabel(options, i);
        const {onClick} = options;

        if (options.label.type === 'a') return <span onClick={onClick}>{label}</span>;

        return <span onClick={onClick}>{label}</span>;
    };

    getStatusSwitch = (opt, i) => {
        const {statusSwitch, disabled = false} = opt;
        const {status} = statusSwitch;
        const props = {...statusSwitch};
        const icon = status ? 'check-circle' : 'minus-circle-o';
        const color = status ? 'green' : 'red';

        const defaultLabel = <Icon type={icon}/>;
        let label = this.getLabel({...opt, label: defaultLabel, color}, i);

        // 如果没有权限，不允许进行操作，只做展示
        if (disabled) return label;

        Reflect.deleteProperty(props, 'status');
        return (
            <Popconfirm {...props}>
                {label}
            </Popconfirm>
        );
    };

    getItem = (opt, i) => {
        const {
            confirm,
            statusSwitch,
            visible = true,
            disabled = false,
        } = opt;

        if (visible) {
            // 因为label特殊，getStatusSwitch 内部自己判断了是否可用
            if (disabled && statusSwitch) return this.getStatusSwitch(opt, i);

            if (disabled) {
                opt.color = '#ccc';
                return this.getLabel(opt, i);
            }

            if (confirm) return this.getConfirm(opt, i);

            if (statusSwitch) return this.getStatusSwitch(opt, i);

            return this.getText(opt, i);
        }
        return null;
    };

    render() {
        let {items, moreText, moreContentWidth, moreTrigger} = this.props;
        let operators = [];
        let more = [];

        if (typeof moreTrigger === 'string') {
            moreTrigger = [moreTrigger];
        }

        items.forEach((opt, i) => {
            const {isMore} = opt;
            const item = this.getItem(opt, i);

            if (item) {
                if (isMore) {
                    more.push(item);
                } else {
                    operators.push(item);
                }
            }
        });

        if (more && more.length) { // 更多
            const menu = (
                <Menu style={{width: moreContentWidth}}>
                    {
                        more.map((item, index) => <Menu.Item key={item.label || index}>{item}</Menu.Item>)
                    }
                </Menu>
            );
            operators.push(
                <Dropdown overlay={menu} trigger={moreTrigger}>
                    <a className="operator-label">
                        {moreText}
                    </a>
                </Dropdown>
            );
        }

        const operatorsLength = operators.length;

        if (!operatorsLength) {
            return null;
        }

        return (
            <span>
                {operators.map((v, i) => (
                    <span key={v.label || `operator-${i}`}>
                        {v}
                        {operatorsLength === i + 1 ? '' : <span className="operator-divider"/>}
                    </span>
                ))}
            </span>
        );
    }
}
