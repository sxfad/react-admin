# 表格行可拖拽
装饰器方式调用，包装原 Ant Design Table即可

## API

参数|说明|类型|默认值
---|---|---|---
onSortStart | 开始拖拽 | function | -
onSortEnd | 结束拖拽 | function | - 

## 调用方式
其他属性同 Ant Design Table
```js
import {rowDraggable} from 'path/to/table-row-draggable';

const TableRowDraggable = rowDraggable(Table);

...
<TableRowDraggable
    onSortEnd={this.handleSortEnd}
    columns={this.columns}
    dataSource={dataSource}
    rowKey="id"
/>
...
```
