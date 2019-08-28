import React from "react"
import Prism from "prismjs"

export default class SourceCode extends React.Component {
    constructor(props) {
        super(props)
        this.ref = React.createRef()
    }

    state = {
        containerHeight: 'auto',
    };

    componentDidMount() {
        this.highlight()

        this.setHeight();
        window.addEventListener('resize', this.setHeight);
    }

    componentDidUpdate() {
        this.highlight()
    }

    setHeight = () => {
        this.setState({containerHeight: this.container.parentNode.clientHeight});
    };

    componentWillUnmount() {
        window.removeEventListener('resize', this.setHeight);
    }

    highlight = () => {
        if (this.ref && this.ref.current) {
            Prism.highlightElement(this.ref.current)
        }
    };

    render() {
        const {code, plugins, language} = this.props;
        const {containerHeight} = this.state;
        return (
            <div ref={node => this.container = node}>
                <pre
                    style={{
                        margin: 0,
                        height: containerHeight,
                        borderRadius: 0,
                    }}
                    className={!plugins ? "" : plugins.join(" ")}
                >
                    <code ref={this.ref} className={`language-${language}`}>
                      {code.trim()}
                    </code>
                </pre>
            </div>
        )
    }
}
