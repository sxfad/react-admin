import React from 'react';

export default function (props) {
    const {style = {}, ...others} = props;

    return (<div style={{display: 'flex', flexWrap: 'wrap', ...style}} {...others}/>);
}
