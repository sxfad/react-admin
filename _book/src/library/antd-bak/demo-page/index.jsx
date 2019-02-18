import React, {Component} from 'react';
import ReactMarkdown from 'react-markdown';
import PageContent from '@/layouts/page-content';
import PreviewCode from './PreviewCode';
import './style.less';


export default class DagePage extends Component {
    static defaultProps = {
        readme: '',
        api: '',
        demos: [],
    };

    state = {
        showCode: [],
    };

    componentDidMount() {
    }

    render() {
        const {demos, readme, api} = this.props;
        const {showCode} = this.state;

        return (
            <PageContent>
                <div className="sx-antd-demo-root">
                    <div className="left">
                        <div className="markdown">
                            <ReactMarkdown source={readme}/>
                            <ReactMarkdown source={'## 代码演示'}/>
                        </div>
                        {demos.map((item, index) => {
                            return (
                                <div id={index} className="box" key={index}>
                                    <div className="live-demo">
                                        <item.component/>
                                    </div>
                                    <div className="markdown">
                                        <div className="title">
                                            {item.title}
                                        </div>

                                        <div className="markdown description">
                                            <ReactMarkdown source={item.markdown}/>
                                        </div>
                                        <div className="code-icon" onClick={() => {
                                            const show = showCode[index];
                                            const sc = [...showCode];
                                            sc[index] = !show;
                                            this.setState({showCode: sc});
                                        }}>
                                            {showCode[index] ? (
                                                <img className="code-expand-icon-hide" alt="expand code" src="https://gw.alipayobjects.com/zos/rmsportal/OpROPHYqWmrMDBFMZtKF.svg"/>
                                            ) : (
                                                <img className="code-expand-icon-show" alt="expand code" src="https://gw.alipayobjects.com/zos/rmsportal/wSAkBuJFbdxsosKKpqyq.svg"/>
                                            )}
                                        </div>
                                    </div>
                                    <div className="code" style={{display: showCode[index] ? 'block' : 'none'}}>
                                        {process.env.NODE_ENV === 'development' ? <div style={{color: 'red'}}>开发模式下，为了提高编译效率，如下源码有时候不会被更新！！！</div> : null}
                                        <PreviewCode code={item.code}/>
                                    </div>
                                </div>
                            );
                        })}
                        <div className="markdown">
                            <ReactMarkdown source={api}/>
                        </div>
                    </div>
                    <ul className="right">
                        {demos.map((item, index) => {
                            return (
                                <li key={index}>
                                    <a href={`#${index}`}>{item.title}</a>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            </PageContent>
        );
    }
}
