import React, {useRef, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {Button} from 'antd';
import MonacoEditor from 'react-monaco-editor';
import './style.less';
import {
    DesktopOutlined,
    FullscreenExitOutlined,
    FullscreenOutlined,
} from '@ant-design/icons';
import Pane from 'src/pages/drag-page/pane';
import {useHeight} from 'ra-lib';
import prettier from 'prettier/standalone';
import parserPostCss from 'prettier/parser-postcss';
import {isMac, OTHER_HEIGHT} from '../util';

// vs code 的快捷键配置
import keyboardShortcuts from './keyboard-shortcuts.json';

function bindKeyWithAction(editor, monaco) {
    const keyMap = {
        cmd: monaco.KeyMod.CtrlCmd,
        alt: monaco.KeyMod.Alt,
        shift: monaco.KeyMod.Shift,
        ctrl: monaco.KeyMod.WinCtrl,
        backspace: monaco.KeyCode.Backspace,
        down: monaco.KeyCode.DownArrow,
        '/': monaco.KeyCode.US_SLASH,
        '\\': monaco.KeyCode.US_BACKSLASH,
        '[': monaco.KeyCode.US_OPEN_SQUARE_BRACKET,
        ']': monaco.KeyCode.US_CLOSE_SQUARE_BRACKET,
        '.': monaco.KeyCode.US_DOT,
        ',': monaco.KeyCode.US_COMMA,
        '+': monaco.KeyCode.US_EQUAL,
        '-': monaco.KeyCode.US_MINUS,
        '`': monaco.KeyCode.US_BACKTICK,
        '\'': monaco.KeyCode.US_QUOTE,
        ';': monaco.KeyCode.US_SEMICOLON,
    };

    keyboardShortcuts.filter(item => !item.command.startsWith('-'))
        .forEach(item => {
            const {key, command: actionID} = item;
            // 空 隔开多个快捷键，取第一个
            const keyCodes = key.split(' ')[0].split('+').map(k => {
                let kk = keyMap[k];
                if (kk) return kk;

                if (k.length === 1 && /[0-9a-zA-Z]/.test(k)) {
                    k = 'KEY_' + k.toUpperCase();
                } else {
                    k = k.replace(/\b(\w)(\w*)/g, ($0, $1, $2) => $1.toUpperCase() + $2);
                }

                return monaco.KeyCode[k];
            });

            const keyResult = keyCodes.reduce((prev, curr) => {
                return prev | curr;
            });

            editor.addCommand(keyResult, function() {
                editor.trigger('', actionID);
            });
        });
}

function CodeEditor(props) {
    const {
        title,
        value,
        language,
        editorWidth,
        otherHeight = 0,
        onChange = () => undefined,
        onSave,
        onClose = () => undefined,
        readOnly,
    } = props;

    const mainRef = useRef(null);
    const monacoRef = useRef(null);
    const editorRef = useRef(null);
    const [errors, setErrors] = useState([]);
    const [code, setCode] = useState('');
    const [fullScreen, setFullScreen] = useState(false);

    const [height] = useHeight(mainRef, 45 + OTHER_HEIGHT + (fullScreen ? 0 : otherHeight), [fullScreen]);

    function handleSave(code) {

        onSave && onSave(code, errors);
    }

    useEffect(() => {
        if (value instanceof Promise) {
            value.then(code => {
                if (language === 'css') {
                    const formattedCss = prettier.format(code, {parser: 'css', plugins: [parserPostCss]});
                    setCode(formattedCss);
                    return;
                }
                setCode(code);
            });
        } else {
            setCode(value);
        }
    }, [value]);

    useEffect(() => {
        const monaco = monacoRef.current;
        editorRef.current.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S, function() {
            handleSave(code);
        });
        editorRef.current.addCommand(monaco.KeyCode.Escape, function() {
            handleClose();
        });

        // console.log(monaco.KeyCode);
        // console.log(editorRef.current.getSupportedActions());

    }, [code, errors, monacoRef.current, fullScreen]);

    function handleFormat() {
        if (language === 'css') {
            const formattedCss = prettier.format(code, {parser: 'css', plugins: [parserPostCss]});
            setCode(formattedCss);
            return;
        }
        editorRef.current.getAction(['editor.action.formatDocument'])._run();
    }

    function handleClose() {
        if (fullScreen) return handleFullScreen();

        onClose();
    }

    function handleChange(code) {
        setCode(code);
        onChange(code, errors);
    }


    // 检测错误
    useEffect(() => {
        const si = setInterval(() => {
            // 获取当前窗口错误标记
            let errors = monacoRef.current.editor.getModelMarkers({
                resource: editorRef.current.getModel().uri,
            });
            // 严重程度
            /*
            Hint = 1,
            Info = 2,
            Warning = 4,
            Error = 8
            * */
            errors = errors.filter(item => item.severity > 4);

            setErrors(errors);
        }, 300);
        const st = setTimeout(() => {
            clearInterval(si);
        }, 3000);

        return () => {
            clearInterval(si);
            clearTimeout(st);
        };
    }, [code]);

    function editorDidMount(editor, monaco) {
        monacoRef.current = monaco;
        editorRef.current = editor;
        editor.focus();

        // 取消选中，打开Editor 时，内容会被全部选中
        setTimeout(() => {
            editor.setSelection(new monaco.Selection(0, 0, 0, 0));
        });

        // 绑定快捷键
        bindKeyWithAction(editor, monaco);
    }

    function handleFullScreen() {
        const nextFullScreen = !fullScreen;

        setFullScreen(nextFullScreen);
    }

    // https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.ieditorconstructionoptions.html
    const options = {
        selectOnLineNumbers: true,
        tabSize: 2,
        readOnly,
        minimap: {
            enabled: fullScreen,
        },
    };

    const width = fullScreen ? '100%' : editorWidth;

    return (
        <div styleName={fullScreen ? 'fullScreen' : ''}>
            <Pane
                header={
                    <div styleName="header">
                        <div styleName="title">
                            <DesktopOutlined style={{marginRight: 4}}/> {title}
                        </div>
                        <div styleName="tool">
                            <span onClick={handleFullScreen}>
                                {fullScreen ? <FullscreenExitOutlined/> : <FullscreenOutlined/>}
                            </span>
                        </div>
                    </div>
                }
            >
                <div styleName="root" ref={mainRef}>
                    <main>
                        <MonacoEditor
                            width={width}
                            height={height}
                            language={language}
                            theme="vs-dark"
                            value={code}
                            options={options}
                            onChange={handleChange}
                            editorDidMount={editorDidMount}
                        />
                    </main>
                    <footer>
                        <Button
                            style={{marginRight: 8}}
                            onClick={handleFormat}
                        >
                            格式化
                        </Button>
                        {onSave ? (
                            errors?.length ? (
                                <Button
                                    style={{marginRight: 8}}
                                    type="danger"
                                >
                                    有语法错误
                                </Button>
                            ) : (
                                <Button
                                    style={{marginRight: 8}}
                                    className="codeEditorSave"
                                    type="primary"
                                    onClick={() => handleSave(code)}
                                >
                                    保存({isMac ? '⌘' : 'ctrl'}+s)
                                </Button>
                            )
                        ) : null}
                        <Button
                            className="codeEditorClose"
                            onClick={handleClose}
                        >
                            {fullScreen ? '退出全屏' : '关闭'} (Esc)
                        </Button>
                    </footer>
                </div>
            </Pane>
        </div>
    );
}

CodeEditor.propTypes = {
    language: PropTypes.string,
    title: PropTypes.any,
    value: PropTypes.string,
    onChange: PropTypes.func,
    onSave: PropTypes.func,
    onClose: PropTypes.func,
    editorWidth: PropTypes.number,
    readOnly: PropTypes.bool,
};

CodeEditor.defaultProps = {
    language: 'javascript',
    editorWidth: '100%',
};

export default CodeEditor;
