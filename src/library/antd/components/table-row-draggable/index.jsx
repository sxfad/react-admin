import React, {Component} from 'react';
import PropTypes from "prop-types";
import classnames from "classnames";
import {SortableContainer, SortableElement} from "react-sortable-hoc";
import './index.less';


let RowElement = SortableElement((props) => {
    return props.children;
});


let BodyContainer = SortableContainer(props => {
    const {
        children,
        ...others
    } = props;

    return (
        <tbody {...others}>{children.map((item, index) => {
            const {key} = item;

            return (
                <RowElement
                    key={key}
                    index={index}
                >
                    {item}
                </RowElement>
            );
        })}</tbody>
    );
});

function getCss(element, attr) {
    if (element.currentStyle) {
        return element.currentStyle[attr];
    } else {
        return window.getComputedStyle(element)[attr];
    }
}


export default function DragRow(OriTable) {

    class DragRowTable extends Component {
        constructor(props) {
            super(props);

            const {helperClass, onSortStart, onSortEnd} = this.props;

            const handleSortStart = (...args) => {
                onSortStart && onSortStart(...args);

                // 保持tr样式
                const helperTds = document.querySelectorAll('.helper-element > td');
                const tr = this.body.container.querySelector('tr');
                const tds = tr.querySelectorAll('td');

                tds.forEach((item, index) => {
                    const width = getCss(item, 'width');
                    helperTds[index].style.width = width;
                });
            };

            let BodyWrapper = (props) => {
                const injectProps = {
                    onSortEnd: onSortEnd,
                    onSortStart: handleSortStart,
                    helperClass: classnames(helperClass, 'helper-element'),
                };
                return <BodyContainer ref={node => this.body = node} {...injectProps} {...props}/>
            };

            this.components = {
                body: {
                    wrapper: BodyWrapper,
                },
            };
        }

        static propTypes = {
            onSortEnd: PropTypes.func.isRequired,
            helperClass: PropTypes.string,
        };

        render() {
            const {
                className,
                onSortStart,
                onSortEnd,
                helperClass,
                ...others
            } = this.props;
            const classNames = classnames(className, 'sx-table-row-draggable');

            return (
                <OriTable
                    {...others}
                    className={classNames}
                    components={this.components}
                />
            );
        }
    }

    return DragRowTable;
}

