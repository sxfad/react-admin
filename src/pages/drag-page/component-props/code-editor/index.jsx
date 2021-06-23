import React, {useEffect, useRef, useState} from 'react';
import {message} from 'antd';
import config from 'src/commons/config-hoc';
import CodeEditor from 'src/pages/drag-page/code-editor';
import JSON5 from 'json5';
import {cloneDeep} from 'lodash';
import {getComponentConfig} from 'src/pages/drag-page/component-config';
import styles from './style.less';

export default config({
    connect: state => {
        return {
            activeSideKey: state.dragPage.activeSideKey,
            rightSideWidth: state.dragPage.rightSideWidth,
        };
    },
})(function PropsCodeEditor(props) {
    const {
        visible,
        onChange,
        onCancel,
        rightSideWidth,
        selectedNode,
    } = props;

    const saveRef = useRef(false);
    const rootRef = useRef(null);

    const [code, setCode] = useState('');

    function codeToObject(code) {
        if (!code) return null;

        const val = code.replace('export', '').replace('default', '');
        try {
            const obj = JSON5.parse(val);

            if (typeof obj !== 'object' || Array.isArray(obj)) {
                return Error('语法错误，请修改后保存！');
            }

            return obj;
        } catch (e) {
            console.error(e);
            return Error('语法错误，请修改后保存！');
        }
    }

    function handleSave(value, errors) {
        if (errors?.length) return message.error('语法错误，请修改后保存！');

        const propsObj = codeToObject(value);

        if (propsObj instanceof Error) return message.error(propsObj.message);


        saveRef.current = true;

        onChange && onChange(propsObj);

        message.success('保存成功！');
    }

    useEffect(() => {
        // 由于保存触发的，不做任何处理
        if (saveRef.current) {
            saveRef.current = false;
            return;
        }

        if (!selectedNode) return setCode('');

        const editNode = cloneDeep(selectedNode);

        const nodeConfig = getComponentConfig(editNode.componentName);

        const beforeSchemaEdit = nodeConfig?.hooks?.beforeSchemaEdit;

        beforeSchemaEdit && beforeSchemaEdit({node: editNode});

        const nextCode = `export default ${JSON5.stringify(editNode.props, null, 2)}`;

        setCode(nextCode);
    }, [visible, selectedNode]);

    if (!visible) return null;

    return (
        <div className={styles.root} ref={rootRef}>
            <CodeEditor
                title="属性源码开发"
                editorWidth={rightSideWidth}
                value={code}
                onSave={handleSave}
                onClose={onCancel}
            />
        </div>
    );
});
