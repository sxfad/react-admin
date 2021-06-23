document.querySelectorAll('.ant-menu-item-group')
    .forEach(group => {
        const category = group.querySelector('.ant-menu-item-group-title').innerText;
        const children = group.querySelectorAll('.ant-menu-item');
        const components = [];
        children.forEach(item => {
            const componentName = item.querySelector('a>span').innerText;
            const title = item.querySelector('a>span.chinese').innerText;
            const subTitle = `${title} ${componentName}`;
            components.push({
                title,
                subTitle,
                children: [
                    {
                        title,
                        renderPreview: true,
                        config: {
                            componentName,
                        },
                    },
                ],
            });
        });
        let str = JSON.stringify(components, null, 4);

        if (category === '数据录入') {
            let keys = [];
            const loop = nodes => {
                nodes.forEach(node => {
                    Object.entries(node).forEach(([key, value]) => {
                        keys.push(key);
                        if (typeof value === 'object') {
                            if (Array.isArray(value)) {
                                loop(value);
                            } else {
                                loop([value]);
                            }
                        }
                    });
                });
            };
            loop(components);

            keys = Array.from(new Set(keys));

            keys.forEach(key => {
                const re = new RegExp(`"${key}":`, 'g');
                str = str.replace(re, `${key}:`);
            });

            console.log(str);
        }
    });

// 抓取属性
let result = [];
document.getElementById('Form.Item').nextElementSibling.querySelectorAll('tr')
    .forEach(tr => {
        const tds = Array.from(tr.querySelectorAll('td'));
        const field = ['field', 'desc', 'type', 'defaultValue', 'version'];
        if (tds?.length !== field.length) return;

        const obj = {label: ''};
        field.forEach((key, index) => {
            obj[key] = tds[index].innerText;
        });
        if ((obj.type === 'boolean' && obj.defaultValue === 'false') || obj.defaultValue === 'true') {
            obj.defaultValue = JSON.parse(obj.defaultValue);
        }
        if (obj.defaultValue === '-') {
            Reflect.deleteProperty(obj, 'defaultValue');
        }
        if (obj.type.includes(' | ')) {
            obj.options = obj.type.split(' | ').map(value => ({value, label: value}));
            obj.type = 'radio-group';
        }

        // 调整一下顺序
        const desc = obj.desc;
        Reflect.deleteProperty(obj, 'desc');
        obj.desc = desc;
        obj.label = desc;

        result.push(obj);
    });
console.log(result);
let keys = [
    'field',
    'desc',
    'type',
    'defaultValue',
    'version',
    'options',
    'value',
    'label',
];
let propsStrArr = result.map(item => {
    let str = JSON.stringify(item);

    keys.forEach(key => {
        const re = new RegExp(`"${key}":`, 'g');
        str = str.replace(re, `${key}:`);
    });
    return str;
});

let propsStr = JSON.stringify(propsStrArr, null, 4);

propsStr = propsStr.replace(/"\{label/g, '{label');
propsStr = propsStr.replace(/"}"/g, '"}');
propsStr = propsStr.replace(/\\"/g, '\'');

propsStr = `${propsStr}`;

console.log(propsStr);
