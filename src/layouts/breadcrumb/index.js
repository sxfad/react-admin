import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Breadcrumb, Icon} from 'antd';
import Link from '../page-link';
import './style.less';

const Item = Breadcrumb.Item;

export default class BreadcrumbComponent extends Component {
    static propTypes = {
        dataSource: PropTypes.array, // 数据源
    };

    static defaultProps = {
        dataSource: [],
    };

    renderItems() {
        const {dataSource} = this.props;
        const iconStyle = {marginRight: 4};
        if (dataSource && dataSource.length) {
            return dataSource.map(({key, icon, text, path}) => {
                if (path) {
                    return (
                        <Item key={key}>
                            <Link to={path}>
                                {icon ? <Icon type={icon} style={iconStyle}/> : null}
                                {text}
                            </Link>
                        </Item>
                    );
                }
                return (
                    <Item key={key}>
                        {icon ? <Icon type={icon} style={iconStyle}/> : null}
                        {text}
                    </Item>
                );
            })
        }
        return null;
    }

    render() {
        const {theme} = this.props;
        return (
            <div styleName="breadcrumb" className={`system-breadcrumb-${theme}`}>
                <Breadcrumb>
                    {this.renderItems()}
                </Breadcrumb>
            </div>
        );
    }
}
