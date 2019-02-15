import React, {Component} from 'react';
import PropTypes from 'prop-types';

export default class DragBar extends Component {
    constructor(props) {
        super(props);
        window.addEventListener('mouseup', this.handleDragEnd);
        window.addEventListener('touchend', this.handleDragEnd);
        window.addEventListener('mousemove', this.handleDragging);
        window.addEventListener('touchmove', this.handleDragging);
    }

    static propTypes = {
        onDragStart: PropTypes.func,
        onDragging: PropTypes.func,
        onDragEnd: PropTypes.func,
    };
    state = {
        isDragging: false,
        original: {
            x: 0,
            y: 0,
        },
        moved: {
            x: 0,
            y: 0,
        },
    };

    componentWillUnmount() {
        window.removeEventListener('mouseup', this.handleDragEnd);
        window.removeEventListener('touchend', this.handleDragEnd);
        window.removeEventListener('mousemove', this.handleDragging);
        window.removeEventListener('touchmove', this.handleDragging);
    }

    handleDragStart = (event) => {
        let clientX = 0;
        let clientY = 0;
        if (event.nativeEvent instanceof MouseEvent) {
            clientX = event.nativeEvent.clientX;
            clientY = event.nativeEvent.clientY;

            // When user click with right button the resize is stuck in resizing mode
            // until users clicks again, dont continue if right click is used.
            if (event.nativeEvent.which === 3) {
                return;
            }
        } else if (event.nativeEvent instanceof TouchEvent) {
            clientX = event.nativeEvent.touches[0].clientX;
            clientY = event.nativeEvent.touches[0].clientY;
        }

        const original = {x: clientX, y: clientY};

        this.setState({isDragging: true, original});

        if (this.props.onDragStart) {
            this.props.onDragStart();
        }
    };

    handleDragging = (event) => {
        const {isDragging, original} = this.state;
        if (isDragging) {
            event.preventDefault();
            const clientX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
            const clientY = event instanceof MouseEvent ? event.clientY : event.touches[0].clientY;
            const {x: originalX, y: originalY} = original;
            const moved = {
                x: clientX - originalX,
                y: clientY - originalY,
            };

            this.setState({moved});

            if (this.props.onDragging) {
                this.props.onDragging({...moved, clientX, clientY});
            }
        }
        return false;
    };

    handleDragEnd = () => {
        const {isDragging, moved} = this.state;
        if (isDragging) {
            this.setState({isDragging: false});
            if (this.props.onDragEnd) {
                this.props.onDragEnd(moved);
            }
        }
    };

    render() {
        const {onDragStart, onDragging, onDragEnd, ...others} = this.props;
        return (
            <div
                {...others}
                onMouseDown={this.handleDragStart}
                onTouchStart={this.handleDragStart}
            />
        );
    }
}
