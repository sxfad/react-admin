import React from 'react';
import {Tooltip, Button} from 'antd';
import PropTypes from 'prop-types';

const buttonWidth = 35;

const Placement = props => {
    const {value, onChange, allowClear = true} = props;

    function renderItems(options) {
        return options.map(item => {
            const {placement, text, title} = item;
            const type = value === placement ? 'primary' : 'default';

            return (
                <Tooltip key={title || text} placement={placement} title={`位置：${title}`} autoAdjustOverflow={false}>
                    <Button
                        style={{
                            width: buttonWidth,
                            paddingLeft: 0,
                            paddingRight: 0,
                            textAlign: 'center',
                        }}
                        type={type}
                        onClick={() => {
                            let nextValue = placement;

                            if (allowClear && value === nextValue) nextValue = undefined;

                            onChange(nextValue);
                        }}
                    >
                        {text}
                    </Button>
                </Tooltip>
            );
        });
    }

    return (
        <div style={{
            width: buttonWidth * 5,
            paddingBottom: 30,
        }}>
            <div style={{whiteSpace: 'nowrap'}}>
                {renderItems([
                    {placement: 'leftTop', text: 'LT', title: '左上'},
                    {placement: 'topLeft', text: 'TL', title: '上左'},
                    {placement: 'top', text: 'T', title: '上'},
                    {placement: 'topRight', text: 'TR', title: '上右'},
                    {placement: 'rightTop', text: 'RT', title: '右上'},
                ])}
            </div>
            <div style={{width: buttonWidth, float: 'left'}}>
                {renderItems([
                    {placement: 'left', text: 'L', title: '左'},
                ])}
            </div>
            <div style={{width: buttonWidth, marginLeft: buttonWidth * 4}}>
                {renderItems([
                    {placement: 'right', text: 'R', title: '右'},
                ])}
            </div>
            <div style={{clear: 'both', whiteSpace: 'nowrap'}}>
                {renderItems([
                    {placement: 'leftBottom', text: 'LB', title: '左下'},
                    {placement: 'bottomLeft', text: 'BL', title: '下左'},
                    {placement: 'bottom', text: 'B', title: '下'},
                    {placement: 'bottomRight', text: 'BR', title: '下右'},
                    {placement: 'rightBottom', text: 'RB', title: '右下'},
                ])}
            </div>
        </div>
    );
};

Placement.propTypes = {
    value: PropTypes.array,
    onChange: PropTypes.func,
    allowClear: PropTypes.bool,
};

export default Placement;
