import React, {Component} from 'react';
import AceEditor from 'react-ace';

import 'brace/mode/json';
import 'brace/mode/text';
import 'brace/theme/github';

export default class JsonEditor extends Component {

    render() {
        const {value, onChange, isJson = true, ...others} = this.props;

        return (
            <div style={{border: '1px solid #e8e8e8'}}>
                <AceEditor
                    value={value || ''}
                    onChange={value => onChange(value)}
                    mode={isJson ? 'json' : 'text'}
                    theme="github"
                    editorProps={{$blockScrolling: true}}
                    {...others}
                />
            </div>
        );
    }
}
