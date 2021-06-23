import JSON5 from 'json5';
import {cloneDeep} from 'lodash';
import prettier from 'prettier/standalone';
import parserBabel from 'prettier/parser-babel';
import inflection from 'inflection';
import {getComponentConfig} from 'src/pages/drag-page/component-config';
import {isNode, loopNode} from '../node-util';
import {getComponent, isFunctionString, getFieldOption, getNextField} from '../util';

export default function schemaToCode(schema, options = {}) {
    const {classCode} = options;
    schema = cloneDeep(schema);

    // 导入
    const imports = new Map();
    const states = [];
    const variables = [];
    const functions = [];

    loopNode(schema, node => {
        const nodeConfig = getComponentConfig(node?.componentName);
        const beforeToCode = nodeConfig?.hooks?.beforeToCode;
        beforeToCode && beforeToCode({node, imports, options});

        generateImport(node?.componentName);
    });

    function generateJsx() {
        const loop = node => {
            let {componentName, props, wrapper, children} = node;

            if (componentName === 'DragHolder') return '';

            // 处理当前节点上的包装节点
            if (wrapper?.length) {
                wrapper = cloneDeep(wrapper);
                parseWrapper(wrapper, node, loop);
                if (wrapper?.length) {
                    wrapper[0].children = [{...node, wrapper: null}];

                    const nextNode = wrapper.reduce((prev, wrapperNode) => {
                        wrapperNode.children = [prev];

                        return wrapperNode;
                    });

                    return loop(nextNode);
                }
            }

            if (componentName === 'Table.Column') return '';

            if (componentName === 'Text') {
                const {text, isDraggable, ...others} = props;

                if (!Object.keys(others).length) return text;

                componentName = 'span';
                children = text;
                props = others;
            }

            const names = componentName.split('.');

            let name = names.length === 1 ? names[0] : names[1];

            // 子节点
            let childrenJsx;
            if (typeof children === 'string') {
                childrenJsx = children;
            } else {
                childrenJsx = children?.length ? children.map(item => {
                    return loop(item);
                }).filter(item => !!item).join('\n') : undefined;
            }

            const propsStr = parseProps(props, node, loop).join(' ');

            if (componentName === 'DynamicFormItem') {
                const {appendField, appendFieldValue} = props;
                const isArrayValue = appendFieldValue && appendFieldValue.includes(',');
                let condition = `${appendField} === '${appendFieldValue}'`;
                if (isArrayValue) condition = `[${appendFieldValue.split(',').map(item => `'${item}'`).join(',')}].includes(${appendField})`;

                let childrenStr = childrenJsx;
                if (children?.length > 1) {
                    childrenStr = `<>${childrenJsx}</>`;
                }

                return `<Item shoudUpdate noStyle>
                            {({getFieldValue}) => {
                                const ${appendField} = getFieldValue('${appendField}');
                                if(${condition}) {
                                    return (${childrenStr})
                                }
                                return null;
                            }}
                        </Item>`;
            }

            if (childrenJsx) return `<${name} ${propsStr}>${childrenJsx}</${name}>`;

            return `<${name} ${propsStr}/>`;
        };

        return loop(schema);
    }

    function parseWrapper(wrapper, node, loop) {
        const deal = (name, method = 'success', wrapperIndex) => {
            const [messageNode] = wrapper.splice(wrapperIndex, 1);
            const messageProps = messageNode.props;
            let {type, ...others} = messageProps;

            if (!type) type = method;

            const propsArr = parseProps(others, messageNode, loop);

            const propsStr = propsArr.map(item => {
                const index = item.indexOf('=');
                const key = item.substring(0, index);
                let value = item.substring(index + 1);
                if (value.startsWith('{')) value = value.slice(1, -1);

                return `${key}: ${value}`;
            }).join(',');

            if (!node.props) node.props = {};

            const functionName = getNextField(functions.map(item => item.name), 'handleClick');
            functions.push({
                name: functionName,
                params: '',
                content: `${name}.${type}({${propsStr}})`,
            });

            node.props.onClick = `{${functionName}}`;

            const options = {name};
            const objSets = imports.get('antd');
            if (!objSets) {
                const set = new Set();
                set.add(options);
                imports.set('antd', set);
            } else {
                objSets.add(options);
            }
        };

        const componentMap = [
            {
                componentName: 'Notification',
                name: 'notification',
            },
            {
                componentName: 'Message',
                name: 'message',
            },
            {
                componentName: 'ModalConfirm',
                name: 'Modal',
                method: 'confirm',
            },
            {
                componentName: 'ModalSuccess',
                name: 'Modal',
                method: 'success',
            },
            {
                componentName: 'ModalError',
                name: 'Modal',
                method: 'error',
            },
            {
                componentName: 'ModalInfo',
                name: 'Modal',
                method: 'info',
            },
            {
                componentName: 'ModalWarning',
                name: 'Modal',
                method: 'warning',
            },
        ];
        componentMap.forEach(com => {
            const {componentName, name, method} = com;
            const wrapperIndex = wrapper.findIndex(item => item.componentName === componentName);
            if (wrapperIndex !== -1) {
                deal(name, method, wrapperIndex);
            }
        });
    }

    function parseProps(props, node, loopNode) {
        if (!props) return [];

        const componentProps = cloneDeep(props);
        const loop = (obj, cb) => {
            if (typeof obj !== 'object' || obj === null) return;

            if (Array.isArray(obj)) {
                obj.forEach(item => loop(item, cb));
            } else {
                Object.entries(obj)
                    .forEach(([key, value]) => {
                        if (typeof value === 'object' && !isNode(value)) {
                            if (key === 'style') {
                                const style = parseStyle(value);
                                if (style) {
                                    obj[key] = style;
                                } else {
                                    Reflect.deleteProperty(obj, key);
                                }

                            } else {
                                loop(value, cb);
                            }
                        } else {
                            cb(obj, key, value);
                        }
                    });
            }
        };

        loop(componentProps, (obj, key, value) => {
            const fieldOption = getFieldOption(node, key) || {};
            const {functionType, defaultValue} = fieldOption;

            if (key === 'key' || key.startsWith('_')) {
                Reflect.deleteProperty(obj, key);
                return;
            }

            // 删除默认值
            if (JSON.stringify(defaultValue) === JSON.stringify(value)) {
                Reflect.deleteProperty(obj, key);
                return;
            }

            const val = parsePropsValue(value, loopNode);

            if (functionType || key === 'render') {
                let v = val.slice(1, -1);
                obj[key] = `{() => ${v}}`;
                if (key === 'render' && !v.startsWith('<')) {
                    Reflect.deleteProperty(obj, key);
                }
            } else {
                obj[key] = val;
            }
        });

        return Object.entries(componentProps)
            .map(([key, value]) => {
                if (value === undefined) return '';

                if (typeof value === 'object') {
                    let val = `${key}={${JSON5.stringify(value)}}`;
                    val = val.replace(/'{/g, '');
                    val = val.replace(/}'/g, '');
                    val = val.replace(/"{/g, '');
                    val = val.replace(/}"/g, '');
                    val = val.replace(/\\'/g, '\'');
                    val = val.replace(/\\n/g, '');
                    return val;
                }

                if (typeof value === 'string' && !value.startsWith('{')) return `${key}="${value}"`;
                if (typeof value === 'string' && value.startsWith('{')) return `${key}=${value}`;

                if (value === true) return key;

                return `${key}={${value}}`;
            })
            .map(str => {
                const i = str.indexOf('=');
                const key = str.substring(0, i);
                let value = str.substring(i + 1, str.length);

                if (node?.variables?.length && node.variables.includes(key)) {
                    if (value.startsWith('{')) value = value.slice(1, -1);

                    const nextName = getNextField(variables.map(item => item.name), key);

                    variables.push({
                        name: nextName,
                        initialValue: value,
                    });

                    return `${key}={${nextName}}`;
                }

                return str;
            });
    }

    function parseStyle(styleObj) {
        if (!styleObj) return null;

        Object.entries(styleObj)
            .forEach(([key, value]) => {
                if (value === '' || value === undefined || value === null) {
                    Reflect.deleteProperty(styleObj, key);
                }
            });

        if (!Object.keys(styleObj)?.length) return null;

        return `{${JSON5.stringify(styleObj)}}`;
    }

    function parsePropsValue(value, loop) {
        // state 数据
        if (typeof value === 'string' && value.startsWith('state.')) {
            const [name, initialValue = ''] = value.replace('state.', '').split('<---->');
            states.push({
                name,
                initialValue,
            });
            return `{${name}}`;
        }

        // 节点
        if (isNode(value) || (Array.isArray(value) && value.every(item => isNode(item)))) {
            if (Array.isArray(value)) {
                return `{[
                ${value.map(item => {
                    return loop(item);
                }).join(',')}
                ]}`;
            } else {
                return `{${loop(value)}}`;
            }
        }

        if (isFunctionString(value)) {
            return `{${value.replace('state.', '')}}`;
        }

        if (typeof value === 'string') return value;

        return value;
    }

    /**
     * store the components to the 'imports' map which was used
     *
     * @param {*} componentName component name like 'Button'
     */
    function generateImport(componentName) {
        // ignore the empty string
        if (!componentName) return;

        if (componentName === 'Table.Column') return '';

        let options = getComponent({componentName});
        let {packageName} = options;

        if (packageName) {
            packageName = packageName.split('.')[0];
            const objSets = imports.get(packageName);

            if (!objSets) {
                const set = new Set();
                set.add(options);
                imports.set(packageName, set);
            } else {
                objSets.add(options);
            }
        }
    }

    /**
     * constrcut the import string
     */
    function importString() {
        const importStrings = [];
        const subImports = [];
        for (const [packageName, pkgSet] of imports) {
            const set1 = new Set();
            const set2 = new Set();

            for (const pkg of pkgSet) {
                // 导出名
                let exportName = pkg.exportName || pkg.name;

                // 子组件名
                let subName = pkg.subName;

                // 组件名
                let componentName = pkg.name;

                if (pkg.subName) {
                    subImports.push(`const ${componentName} = ${exportName}.${subName};`);
                }
                if (componentName !== exportName && !pkg.subName) {
                    exportName = `${exportName} as ${componentName}`;
                }

                // 非解构方式
                const destructuring = pkg?.dependence?.destructuring === undefined || pkg?.dependence?.destructuring;
                if (!destructuring) {
                    set1.add(exportName);
                } else {
                    // 解构方式
                    set2.add(exportName);
                }
            }
            const set1Str = [...set1].join(',');
            let set2Str = [...set2].join(',');
            const dot = set1Str && set2Str ? ',' : '';
            if (set2Str) {
                set2Str = `{${set2Str}}`;
            }
            importStrings.push(`import ${set1Str} ${dot} ${set2Str} from '${packageName}'`);
        }
        // 去重
        return Array.from(new Set(importStrings.concat('\n', subImports)));
    }

    const jsx = generateJsx();
    const params = {
        states,
        variables,
        imports: importString(),
        functions,
        jsx,
    };
    const code = classCode ? getClassCode(params) : getFunctionCode(params);

    return prettier.format(code, {
        singleQuote: true,
        // tabWidth: 4,
        parser: 'babel',
        plugins: [parserBabel],
    });
}

function getFunctionCode(options) {
    const {states, variables, imports, functions, jsx} = options;
    return `
        import React ${states.length ? ',{useState}' : ''} from 'react';
        import config from 'src/commons/config-hoc';
        ${imports.join('\n')}

        export default config({
            path: '/route'
        })(function Page(props) {
    ${states.map(({name, initialValue}) => `const [${name}, set${inflection.camelize(name)}] = useState(${initialValue});`).join('\n')}

    ${variables.map(({name, initialValue}) => `const ${name} = ${initialValue};`).join('\n')}

    ${functions.map(item => {
        const {name, params, content} = item;
        return `function ${name}(${params}) {
         ${content}
        }`;
    }).join('\n')}
            return (
            ${jsx}
            );
        })
    `;
}

function getClassCode(options) {
    const {states, variables, imports, functions, jsx} = options;

    return `
        import React, {Component} from 'react';
        import config from 'src/commons/config-hoc';
        ${imports.join('\n')}

        @config({
            path: '/route'
        })
        export default class Page extends Component {

        ${variables.map(({name, initialValue}) => `${name} = ${initialValue};`).join('\n')}

    ${functions.map(item => {
        const {name, params, content} = item;
        return `${name} = (${params}) => {
         ${content}
        }`;
    }).join('\n')}
        render() {
            ${states?.length ? `const {${states.map(item => item.name).join(',')}} = this.state` : ''}
            return (
                ${jsx}
                );
            }
        }
    `;
}
