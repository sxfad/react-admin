import React, {useEffect} from 'react';
import {
    PlusCircleOutlined,
    MinusCircleOutlined,
    RetweetOutlined,
} from '@ant-design/icons';
import UnitInput from 'src/pages/drag-page/component-style/unit-input';
import styles from './style.less';

const INIT = 100;
const STEP = 10;
const MIN = 30;
const MAX = 200;

export default function Index(props) {
    const {element, value, onChange} = props;

    function handlePlus() {
        if (value >= MAX) return;
        onChange(value + STEP);
    }

    function handleMinus() {
        if (value <= MIN) return;

        onChange(value - STEP);
    }

    function handleReset() {
        onChange(INIT);
    }

    useEffect(() => {
        if (!element) return;
        element.style.transformOrigin = 'left top';
        element.style.transform = `scale(${value / 100})`;
        // element.style.zoom = value / 100;
        onChange(value);
    }, [element, value]);

    return (
        <div className={styles.root}>
            <PlusCircleOutlined disabled={value >= MAX} onClick={handlePlus}/>
            <MinusCircleOutlined disabled={value <= MIN} onClick={handleMinus}/>
            <RetweetOutlined onClick={handleReset}/>
            <span className={styles.inputWrapper}>
                <UnitInput
                    allowClear={false}
                    value={value}
                    onChange={e => onChange(e.target.value)}
                />
                %
            </span>
        </div>
    );

}
