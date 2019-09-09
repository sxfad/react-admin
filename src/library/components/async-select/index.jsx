import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Select} from 'antd';

const {Option} = Select;

export default class AsyncSelect extends Component {
    static propTypes = {
        loadDataByUserInput: PropTypes.func.isRequired,
        loadDataByValue: PropTypes.func.isRequired,
        inputAsValue: PropTypes.bool,
    };

    static defaultProps = {
        inputAsValue: false,
    };

    state = {
        loading: false,
        data: [],
        inputValue: void 0,
    };

    searchByUserInput = true;

    handleSearchByUserInput = (inputValue) => {
        this.setState({inputValue});

        const {loadDataByUserInput, onSearch} = this.props;
        if (onSearch) onSearch(inputValue);
        if (!loadDataByUserInput) return;

        // 截流
        clearTimeout(this.st);
        this.st = setTimeout(() => {
            this.setState({loading: true});
            // 用户选择之后，或失去焦点之后，还会触发一次查询，这里给屏蔽掉
            if (!this.searchByUserInput) {
                this.searchByUserInput = true;
                return;
            }

            loadDataByUserInput(inputValue)
                .then(data => this.setState({data}))
                .finally(() => this.setState({loading: false}));
        }, 300);
    };

    handleSearchByValue = (value) => {
        const {loadDataByValue} = this.props;
        if (!loadDataByValue) return;

        setTimeout(() => {
            this.setState({loading: true});

            loadDataByValue(value)
                .then(data => this.setState({data}))
                .finally(() => this.setState({loading: false}));
        });
    };

    handleSelect = (value, option) => {
        const {onSelect} = this.props;
        if (onSelect) onSelect(value, option);

        this.searchByUserInput = false;
    };

    handleBlur = (...args) => {
        // 用户输入过程中，下拉选项已经改变，如果不基于value再次查询，将会出现无法显示label，显示是value的bug
        const {onBlur, value, onChange, inputAsValue} = this.props;
        const {data, inputValue} = this.state;

        if (inputValue && inputAsValue) {
            this.searchByUserInput = false;
            onChange && onChange(inputValue);
            this.setState({data: [{value: inputValue, label: inputValue}]});
            return;
        }

        if (onBlur) onBlur(...args);

        this.searchByUserInput = !value;

        if (value && !data.find(item => item.value === value)) {
            this.handleSearchByValue(value);
        }
    };

    render() {
        const options = this.state.data.map(item => (<Option value={item.value} key={item.value}>{item.label}</Option>));
        const dataMeta = this.props['data-__meta']; // antd form
        const initialValue = (dataMeta && dataMeta.initialValue) || this.props.defaultValue;

        if (initialValue && this.initialValue !== initialValue) {
            this.initialValue = initialValue;
            this.handleSearchByValue(initialValue);
        }

        return (
            <Select
                defaultActiveFirstOption={false}
                allowClear
                showSearch
                showArrow={false}
                optionFilterProp="children"
                {...this.props}
                onSearch={this.handleSearchByUserInput}
                onSelect={this.handleSelect}
                onBlur={this.handleBlur}
            >
                {options}
            </Select>
        );
    }
}
