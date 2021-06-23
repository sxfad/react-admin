import React from 'react';
import Pane from '../../pane';
import CurrentSelectedNode from '../../current-selected-node';
import {getComponentConfig} from 'src/pages/drag-page/component-config';
import FontIcon from '../../font-icon';
import ObjectElement from '../object-element';
import styles from './style.less';

export default function PropsFormEditor(props) {
    const {
        node,
        onChange,

        onEdit,
        fitHeight,
        tip,
        tool,
    } = props;

    const {fields} = getComponentConfig(node?.componentName);
    const value = node?.props || {};

    return (
        <Pane
            fitHeight={fitHeight}
            header={(
                <div className={styles.header}>
                    <CurrentSelectedNode tip={tip} node={node}/>
                    <div>
                        {tool}
                        <FontIcon
                            type="icon-code"
                            disabled={!node}
                            className={styles.tool}
                            onClick={() => onEdit()}
                        />
                    </div>
                </div>
            )}
        >
            <div className={styles.root}>
                <ObjectElement
                    node={node}
                    fields={fields}
                    value={value}
                    onChange={onChange}
                />
            </div>
        </Pane>
    );
}
