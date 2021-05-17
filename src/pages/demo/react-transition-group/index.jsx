import {useState} from 'react';
import {Button, Space} from 'antd';
import config from 'src/commons/config-hoc';
import {PageContent} from '@ra-lib/components';
import {
    CSSTransition,
    Transition,
    TransitionGroup,
} from 'react-transition-group';
import {v4 as uuid} from 'uuid';

import './style.css';

const duration = 300;

const defaultStyle = {
    transition: `opacity ${duration}ms ease-in-out`,
    opacity: 0,
};

const transitionStyles = {
    entering: {opacity: 1},
    entered: {opacity: 1},
    exiting: {opacity: 0},
    exited: {opacity: 0},
};

export default config({
    path: '/demo/react-transition-group',
})(function TestAjax(props) {
    const [visible, setVisible] = useState(true);
    const [id, setId] = useState(uuid());
    const [visibleCSS, setVisibleCSS] = useState(true);
    const [items, setItems] = useState([
        {id: uuid(), text: 'Buy eggs22'},
        {id: uuid(), text: 'Pay bills'},
        {id: uuid(), text: 'Invite friends over'},
        {id: uuid(), text: 'Fix the TV'},
    ]);

    // console.log('demo/layout', layoutState);

    return (
        <PageContent>
            <div style={{marginBottom: '1rem'}}>
                <TransitionGroup className="todo-list">
                    {visible ? (
                        <Transition
                            key={id}
                            appear
                            timeout={500}
                        >
                            {state => {
                                console.log(state);
                                return (
                                    <div
                                        style={{
                                            ...defaultStyle,
                                            ...transitionStyles[state],
                                        }}
                                    >
                                        I'm a fade Transition!
                                    </div>
                                );
                            }}
                        </Transition>
                    ) : null}
                    {visibleCSS ? (
                        <CSSTransition
                            timeout={500}
                            classNames="item"
                        >
                            <div>
                                显示隐藏啊啊啊啊
                            </div>
                        </CSSTransition>
                    ) : null}
                    {items.map(({id, text}) => (
                        <CSSTransition
                            key={id}
                            timeout={500}
                            classNames="item"
                        >
                            <div>
                                <Button
                                    className="remove-btn"
                                    variant="danger"
                                    size="sm"
                                    onClick={() =>
                                        setItems(items =>
                                            items.filter(item => item.id !== id),
                                        )
                                    }
                                >
                                    &times;
                                </Button>
                                {text}
                            </div>
                        </CSSTransition>
                    ))}
                </TransitionGroup>
            </div>
            <Space>
                <Button
                    onClick={() => {
                        const text = prompt('Enter some text');
                        if (text) {
                            setItems(items => [
                                ...items,
                                {id: uuid(), text},
                            ]);
                        }
                    }}
                >
                    Add Item
                </Button>
                <Button onClick={() => setVisible(!visible) || setId(uuid())}>Toggle Transition</Button>
                <Button onClick={() => setVisibleCSS(!visibleCSS)}>Toggle CSSTransition</Button>
            </Space>
        </PageContent>
    );
});
