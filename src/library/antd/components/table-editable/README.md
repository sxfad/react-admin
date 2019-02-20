# 可编辑表格
其他属性为Ant Design的Table属性

## API
参数|说明|类型|默认值
---|---|---|---
formRef | 用于获取内部from对象，使用from.validateFieldsAndScroll方法对表格进行校验 | function(form) {} | -
onChange | 表格中任意表单元素改变会触发此函数，参数是编辑完成的 dataSource | function (dataSource) | -
showAdd | 是否显示表格底部的添加按钮 | bool | true
addText | 添加按钮文案 | ReactNode 或 string | '添加'
dataSource | 表格的dataSource，表格所需要渲染的数据 | array | -
columns | 表格列配置 | array | -
rowKey | 必须是字符串 | string | -

### columns 项中的 props
props用于配置表单元素FormElement信息，如果props缺省，此列将不可编辑；

column其他配置同 Ant Design Table

常用属性如下

参数|说明|类型|默认值
---|---|---|---
dataIndex | 从每行record获取数据的key，默认为column中配置的dataIndex，如果column中的dataIndex并不是要编辑的（比如select，显示与编辑并不是一个dataIndex），可以使用此属性 | string | `columns[x].dataIndex`
type | 元素类型，比如：'input' | string | 'input'
decorator | form.getFieldDecorator 函数的第二个参数，通常写些校验规则等 | object | -
getValue | 获取表单元素的方式 | function | (e) => e.target ? e.target.value : e

### dataSource属性说明

dataSource中每一项（record），除了正常的业务数据外，额外有以下属性

参数|说明|类型|默认值
---|---|---|---
editable | 用于标记这一条数据中，那些是可编辑的，editable: true 所有都可编辑，editable: false 所有都不可编辑，editable: `[key1, key2]`只用key1，key2对应的数据可编辑| bool 或 array | true
showEdit | 是否显示编辑，与editable配合切换单元格的编辑、非编辑形式| bool | true

dataSource中每一项（record），额外被添加了如下属性：

参数|说明|类型|默认值
---|---|---|---
__formFields| 表单字段 | array | -
__changed | 标记此记录被编辑过的字段 | array | -
__add | 标记此记录为新增记录 | bool | true
__validate | 单独校验一行 | function | -
__save | 单独保存校验并一行 | function(callback)，callback接收两个参数，nextDataSource,nextRecord，处理过的dataSource, 当前行最新数据 | true
__cancel | 当前行取消操作 | function(callback)，callback接收一个参数，nextDataSource，处理过的dataSource | true

### 校验

#### 单独行保存、取消
dataSource每一项（record），额外添加了`save`方法，用于保存当前行数据，会触发onChange 方法

```jsx
    columns = [
        ...
        {
            title: '操作',
            render: (text, record) => {
                return (
                    [
                        <a
                            key="save"
                            onClick={() => {
                                record.__save((nextDataSource, nextRecord) => {
                                    this.setState(dataSource: nextDataSource);
                                });
                            }}
                        >保存</a>，
                        <a
                            key="cancel"
                            onClick={() => {
                                record.__cancel((nextDataSource) => {
                                    this.setState(dataSource: nextDataSource);
                                });
                            }}
                        >保存</a>
                    ]
                );
            },
        }
    ];
```

#### 整体校验

通过submitRef 拿到 TableEditable内部handleSubmit，进行校验，代码片段如下：

```jsx
    <TableEditable
        submitRef={(submit) => this.tableSubmit = submit}
        ....
    />
    ...
    handleSubmit = () => {
        this.tableSubmit((err, values) => {
            if (err) return;
        });
    };
```






 
