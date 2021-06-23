import React from 'react';
import {message} from 'antd';
import config from 'src/commons/config-hoc';
import CodeEditor from 'src/pages/drag-page/code-editor';
import {objectToCss, cssToObject} from '../../util';
import styles from './style.less';

export default config({
    connect: state => {
        return {
            activeSideKey: state.dragPage.activeSideKey,
            rightSideWidth: state.dragPage.rightSideWidth,
        };
    },
})(function StyleEditor(props) {
    const {
        visible,
        value,
        onChange,
        onCancel,
        rightSideWidth,
    } = props;

    function handleSave(value, errors) {
        if (errors?.length) return message.error('有语法错误，请修改后保存！');

        if (!value) return;

        let val = value.replace('*', '').trim();

        val = val.substring(1, val.length - 1);
        console.log('style editor save', val);
        const style = cssToObject(val);
        console.log('style editor save', style);

        onChange && onChange(style);
        message.success('保存成功！');
    }

    if (!visible) return null;


    const obj = Object.entries(value || {}).reduce((prev, curr) => {
        const [key, value] = curr;
        if (key.startsWith('__')) return prev;

        prev[key] = value;

        return prev;
    }, {});

    // const code = `export default ${JSON5.stringify(obj, null, 4)}`;
    const code = objectToCss(obj).then(code => `* {${code}}`);

    return (
        <div className={styles.root}>
            <CodeEditor
                editorWidth={rightSideWidth}
                language="css"
                title="样式源码开发"
                value={code}
                onClose={onCancel}
                onSave={handleSave}
            />
        </div>
    );
});
