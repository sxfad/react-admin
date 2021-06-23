/* eslint-disable */

/**
 * transform the componentsMap to real Map from compsMap.list as array
 * @param {*} compsMap
 */
const transComponentsMap = (compsMap = {}) => {
    if (!compsMap || !Array.isArray(compsMap.list)) {
        return [];
    }
    const list = compsMap.list;
    return list.reduce((obj, comp) => {
        const componentName = comp.name;
        if (!obj[componentName]) {
            if (comp.dependence) {
                try {
                    let dependence = typeof comp.dependence === 'string' ? JSON.parse(comp.dependence) : comp.dependence;
                    if (dependence) {
                        comp.packageName = dependence.package;
                        comp.dependence = dependence;
                    }
                    if (!comp.dependenceVersion) {
                        comp.dependenceVersion = '*';
                    }
                    comp.exportName = dependence.export_name;
                    comp.subName = dependence.sub_name;
                    if (/^\d/.test(comp.dependenceVersion)) {
                        comp.dependenceVersion = '^' + comp.dependenceVersion;
                    }
                } catch (e) {
                    console.log(e);
                }
            }
            obj[componentName] = comp;
        }
        return obj;
    }, {});
};

module.exports = function(schema, option) {
    const {_, prettier} = option;
    const componentsMap = transComponentsMap(option.componentsMap);
    // imports, the key is the package name, the value is a set includes the component objects
    const imports = new Map();
    const importsExt = [];

    // inline style
    const style = {};

    // Global Public Functions
    const utils = [];

    // Classes
    const classes = [];

    // 1vw = width / 100
    const _w = (option.responsive.width / 100) || 750;

    let pageLock = false;

    const isExpression = (value) => {
        return /^\{\{.*\}\}$/.test(value);
    };

    const toString = (value) => {
        if ({}.toString.call(value) === '[object Function]') {
            return value.toString();
        }
        if (typeof value === 'string') {
            return value;
        }
        if (typeof value === 'object') {
            return JSON.stringify(value, (key, value) => {
                if (typeof value === 'function') {
                    return value.toString();
                } else {
                    return value;
                }
            });
        }

        return String(value);
    };

    // flexDirection -> flex-direction
    const parseCamelToLine = (string) => {
        return string.split(/(?=[A-Z])/).join('-').toLowerCase();
    };

    /**
     * constrcut the import string
     */
    const importString = () => {
        const importStrings = [];
        const subImports = [];
        for (const [packageName, pkgSet] of imports) {
            const set1 = new Set(), set2 = new Set();
            for (const pkg of pkgSet) {
                let exportName = pkg.exportName;
                let subName = pkg.subName;
                let componentName = pkg.name;

                if (pkg.subName) {
                    subImports.push(`const ${componentName} = ${exportName}.${subName};`);
                }
                if (componentName !== exportName && !pkg.subName) {
                    exportName = `${exportName} as ${componentName}`;
                }
                if (!pkg.dependence.destructuring) {
                    set1.add(exportName);
                } else {
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
        return importStrings.concat(subImports);
    };

    /**
     * store the components to the 'imports' map which was used
     *
     * @param {*} componentName component name like 'Button'
     */
    const generateImport = (componentName) => {
        // ignore the empty string
        if (!componentName) {
            return;
        }
        const component = componentsMap[componentName];
        if (component) {
            const objSets = imports.get(component.packageName);
            if (!objSets) {
                const set = new Set();
                set.add(component);
                imports.set(component.packageName, set);
            } else {
                objSets.add(component);
            }
            return;
        }
    };

    // className structure support
    const generateLess = (schema, style) => {
        let less = '';

        function walk(json) {
            if (json.props && json.props.className) {
                let className = json.props.className;
                less += `.${className} {`;

                for (let key in style[className]) {
                    less += `${parseCamelToLine(key)}: ${style[className][key]};\n`;
                }
            }
            if (json.children && json.children.length > 0 && Array.isArray(json.children)) {
                json.children.forEach(child => walk(child));
            }

            if (json.props && json.props.className) {
                less += '}';
            }
        }

        walk(schema);

        return less;
    };

    const generateCss = (style, toVW) => {
        let css = '';
        Object.keys(style).map((key) => {
            css += `.${key}{${formatStyle(style[key], toVW)}}`;
        });
        return css;
    };

    // box relative style
    const boxStyleList = ['fontSize', 'marginTop', 'marginBottom', 'paddingTop', 'paddingBottom', 'height', 'top', 'bottom', 'width', 'maxWidth', 'left', 'right', 'paddingRight', 'paddingLeft', 'marginLeft', 'marginRight', 'lineHeight', 'borderBottomRightRadius', 'borderBottomLeftRadius', 'borderTopRightRadius', 'borderTopLeftRadius', 'borderRadius'];
    // no unit style
    const noUnitStyles = ['opacity', 'fontWeight'];

    const formatStyle = (style, toVW) => {
        const styleData = [];
        for (let key in style) {
            let value = style[key];
            if (boxStyleList.indexOf(key) != -1) {
                if (toVW) {
                    value = (parseInt(value) / _w).toFixed(2);
                    value = value == 0 ? value : value + 'vw';
                } else {
                    value = (parseInt(value)).toFixed(2);
                    value = value == 0 ? value : value + 'px';
                }
                styleData.push(`${_.kebabCase(key)}: ${value}`);
            } else if (noUnitStyles.indexOf(key) != -1) {
                styleData.push(`${_.kebabCase(key)}: ${parseFloat(value)}`);
            } else {
                styleData.push(`${_.kebabCase(key)}: ${value}`);
            }
        }
        return styleData.join(';');
    };


    // convert to responsive unit, such as vw
    const parseStyle = (styles) => {
        for (let style in styles) {
            for (let key in styles[style]) {
                if (boxStyleList.indexOf(key) > 0) {
                    styles[style][key] = (parseInt(styles[style][key]) / _w).toFixed(2) + 'vw';
                }
            }
        }

        return styles;
    };

    // parse function, return params and content
    const parseFunction = (func) => {
        const funcString = func.toString();
        const params = funcString.match(/\([^\(\)]*\)/)[0].slice(1, -1);
        const content = funcString.slice(funcString.indexOf('{') + 1, funcString.lastIndexOf('}'));
        return {
            params,
            content,
        };
    };

    // parse layer props(static values or expression)
    const parseProps = (value, isReactNode) => {
        if (typeof value === 'string') {
            if (isExpression(value)) {
                if (isReactNode) {
                    return value.slice(1, -1);
                } else {
                    return value.slice(2, -2);
                }
            }

            if (isReactNode) {
                return value;
            } else {
                return `'${value}'`;
            }
        } else if (typeof value === 'function') {
            const {params, content} = parseFunction(value);
            return `(${params}) => {${content}}`;
        } else {
            return JSON.stringify(value);
        }
    };

    // parse async dataSource
    const parseDataSource = (data) => {
        const name = data.id;
        const {uri, method, params} = data.options;
        const action = data.type;
        let payload = {};

        switch (action) {
            case 'fetch':
                if (importsExt.indexOf(`import {fetch} from whatwg-fetch`) === -1) {
                    importsExt.push(`import {fetch} from 'whatwg-fetch'`);
                }
                payload = {
                    method: method,
                };

                break;
            case 'jsonp':
                if (importsExt.indexOf(`import {fetchJsonp} from fetch-jsonp`) === -1) {
                    importsExt.push(`import jsonp from 'fetch-jsonp'`);
                }
                break;
        }

        Object.keys(data.options).forEach((key) => {
            if (['uri', 'method', 'params'].indexOf(key) === -1) {
                payload[key] = toString(data.options[key]);
            }
        });

        // params parse should in string template
        if (params) {
            payload = `${toString(payload).slice(0, -1)} ,body: ${isExpression(params) ? parseProps(params) : toString(params)}}`;
        } else {
            payload = toString(payload);
        }

        let result = `{
      ${action}(${parseProps(uri)}, ${toString(payload)})
        .then((response) => response.json())
    `;

        if (data.dataHandler) {
            const {params, content} = parseFunction(data.dataHandler);
            result += `.then((${params}) => {${content}})
        .catch((e) => {
          console.log('error', e);
        })
      `;
        }

        result += '}';

        return `${name}() ${result}`;
    };

    // parse condition: whether render the layer
    const parseCondition = (condition, render) => {
        if (typeof condition === 'boolean') {
            return `${condition} && ${render}`;
        } else if (typeof condition === 'string') {
            return `${condition.slice(2, -2)} && ${render}`;
        }
    };

    // parse loop render
    const parseLoop = (loop, loopArg, render) => {
        let data;
        let loopArgItem = (loopArg && loopArg[0]) || 'item';
        let loopArgIndex = (loopArg && loopArg[1]) || 'index';

        if (Array.isArray(loop)) {
            data = toString(loop);
        } else if (isExpression(loop)) {
            data = loop.slice(2, -2);
        }

        // add loop key
        const tagEnd = render.match(/^<.+?\s/)[0].length;
        render = `${render.slice(0, tagEnd)} key={${loopArgIndex}}${render.slice(tagEnd)}`;

        // remove `this`
        const re = new RegExp(`this.${loopArgItem}`, 'g');
        render = render.replace(re, loopArgItem);

        return `${data}.map((${loopArgItem}, ${loopArgIndex}) => {
      return (${render});
    })`;
    };

    // generate render xml
    const generateRender = (schema) => {
        const type = schema.componentName.toLowerCase();
        const className = schema.props && schema.props.className || '';
        const classString = className ? ` className="${className}"` : '';
        if (className) {
            style[className] = schema.props.style;
        }

        let xml;
        let props = '';

        Object.keys(schema.props).forEach((key) => {
            if (['className', 'style', 'text', 'src', 'lines'].indexOf(key) === -1) {
                props += ` ${key}={${parseProps(schema.props[key])}}`;
            }
        });
        switch (type) {
            case 'text':
                const innerText = parseProps(schema.props.text, true);
                xml = `<span${classString}${props}>${innerText}</span>`;
                break;
            case 'image':
                const source = parseProps(schema.props.src);
                xml = `<img${classString}${props} src={${source}} />`;
                break;
            case 'div':
            case 'page':
            case 'block':
            case 'component':
                if (schema.children && schema.children.length) {
                    xml = `<div${classString}${props}>${transform(schema.children)}</div>`;
                } else {
                    xml = `<div${classString}${props} />`;
                }
                break;
            default:
                if (schema.children && schema.children.length) {
                    xml = `<${schema.componentName}${classString}${props}>${transform(schema.children)}</${schema.componentName}>`;
                } else {
                    xml = `<${schema.componentName}${classString}${props} />`;
                }

                const importString = generateImport(schema.componentName);

                if (importString) {
                    imports.push(importString);
                }
                break;
        }

        if (schema.loop) {
            xml = parseLoop(schema.loop, schema.loopArgs, xml);
        }
        if (schema.condition) {
            xml = parseCondition(schema.condition, xml);
        }
        if ((schema.loop || schema.condition) && !schema.isRoot) {
            xml = `{${xml}}`;
        }

        return xml;
    };

    // parse schema
    const transform = (schema) => {
        let result = '';
        if (Array.isArray(schema)) {
            schema.forEach((layer) => {
                result += transform(layer);
            });
        } else if (typeof schema === 'string') {
            result += schema;
        } else if (typeof schema === 'object' && typeof schema.componentName === 'string') {
            // fix the problem of multiple page tags
            let type = schema.componentName.toLowerCase();
            let cycleMark = ['block', 'component'].indexOf(type) !== -1;
            if (pageLock && cycleMark) {
                type = 'div';
                cycleMark = false;
            }
            if (type === 'page') {
                if (!pageLock) {
                    pageLock = true;
                    cycleMark = true;
                } else {
                    type = 'div';
                }
            }
            if (cycleMark) {
                // 容器组件处理: state/method/dataSource/lifeCycle/render
                const states = [];
                const lifeCycles = [];
                const methods = [];
                const init = [];
                const render = [`render(){ return (`];
                let classData = [`class ${schema.componentName}_${classes.length} extends Component {`];

                if (schema.state) {
                    states.push(`state = ${toString(schema.state)}`);
                }

                if (schema.methods) {
                    Object.keys(schema.methods).forEach((name) => {
                        const {params, content} = parseFunction(schema.methods[name]);
                        methods.push(`${name}(${params}) {${content}}`);
                    });
                }

                if (schema.dataSource && Array.isArray(schema.dataSource.list)) {
                    schema.dataSource.list.forEach((item) => {
                        if (typeof item.isInit === 'boolean' && item.isInit) {
                            init.push(`this.${item.id}();`);
                        } else if (typeof item.isInit === 'string') {
                            init.push(`if (${parseProps(item.isInit)}) { this.${item.id}(); }`);
                        }
                        methods.push(parseDataSource(item));
                    });

                    if (schema.dataSource.dataHandler) {
                        const {params, content} = parseFunction(schema.dataSource.dataHandler);
                        methods.push(`dataHandler(${params}) {${content}}`);
                        init.push(`this.dataHandler()`);
                    }
                }

                if (schema.lifeCycles) {
                    if (!schema.lifeCycles['_constructor']) {
                        lifeCycles.push(`constructor(props, context) { super(); ${init.join('\n')}}`);
                    }

                    Object.keys(schema.lifeCycles).forEach((name) => {
                        const {params, content} = parseFunction(schema.lifeCycles[name]);

                        if (name === '_constructor') {
                            lifeCycles.push(`constructor(${params}) { super(); ${content} ${init.join('\n')}}`);
                        } else {
                            lifeCycles.push(`${name}(${params}) {${content}}`);
                        }
                    });
                }

                render.push(generateRender(schema));
                render.push(`);}`);

                classData = classData.concat(states).concat(lifeCycles).concat(methods).concat(render);
                classData.push('}');

                classes.push(classData.join('\n'));
            } else {
                result += generateRender(schema);
            }
        }

        return result;
    };

    if (option.utils) {
        Object.keys(option.utils).forEach((name) => {
            utils.push(`const ${name} = ${option.utils[name]}`);
        });
    }

    schema.isRoot = true;

    // start parse schema
    transform(schema);

    const prettierOpt = {
        parser: 'babel',
        printWidth: 120,
        singleQuote: true,
    };
    let importStrings = importString();
    importStrings = importStrings.concat(importsExt);
    return {
        panelDisplay: [
            {
                panelName: `index.jsx`,
                panelValue: prettier.format(`
          'use strict';

          import React, { Component } from 'react';
          ${importStrings.join('\n')}
          import './style.css';

          ${utils.join('\n')}
          ${classes.join('\n')}
          export default ${schema.componentName}_0;
        `, prettierOpt),
                panelType: 'js',
            },
            {
                panelName: `style.css`,
                panelValue: prettier.format(generateCss(style), {parser: 'css'}),
                panelType: 'css',
            },
            {
                panelName: `style.responsive.css`,
                panelValue: prettier.format(`${generateCss(style, true)}`, {parser: 'css'}),
                panelType: 'css',
            },
        ],
        noTemplate: true,
    };
};
