import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Input, Row, Col} from 'antd';
import {FontIconModal} from 'sx-antd';

export default class FontIconInput extends Component {
    static propTypes = {
        onChange: PropTypes.func,
        value: PropTypes.string,
    };
    state = {};

    componentWillMount() {

    }

    componentDidMount() {

    }

    handleInputChange = (e) => {
        const {onChange} = this.props;
        const {value} = e.target;

        if (onChange) onChange(value);
    };

    handleSelect = (value) => {
        const {onChange} = this.props;

        if (onChange) onChange(value);
    };

    render() {
        const {value} = this.props;

        return (
            <Row>
                <Col span={10}>
                    <Input value={value} onChange={this.handleInputChange}/>
                </Col>
                <Col span={14}>
                    <FontIconModal style={{display: 'block'}} size="default" value={value} onSelect={this.handleSelect}/>
                </Col>
            </Row>
        );
    }
}
