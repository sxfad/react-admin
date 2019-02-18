import React, {Component} from 'react';
import {Button} from 'antd';
import {Permission} from '../../../index';


function hasPermission(code) {
    if (code === 'ADD_USER') return true;
}

export default class Base extends Component {
    render() {
        return (
            <div>
                <Permission
                    code="ADD_USER"
                    hasPermission={hasPermission}
                >
                    <Button>添加用户</Button>
                </Permission>
                <Permission
                    code="EXPORT_USER"
                    hasPermission={hasPermission}
                >
                    <Button style={{marginLeft: 8}}>导出用户</Button>
                </Permission>

                <Permission
                    useDisabled
                    code="EXPORT_ALL_USER"
                    hasPermission={hasPermission}
                >
                    <Button style={{marginLeft: 8}}>全部导出</Button>
                </Permission>
            </div>
        );
    }
}

export const title = '基础用法';

export const markdown = `
添加用户 有权限，会显示；导出用户 没有权限，不会显示；全部导出 使用了 \`useDisabled\`属性，没有权限，将被添加disabled属性

`;
