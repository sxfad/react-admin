# 分页组件

## API

参数|说明|类型|默认值
---|---|---|---
showSizeChanger | 是否显示，每页显示条数 下拉框 | bool | true
showQuickJumper | 是否显示，跳转到 输入框 | bool | true
showMessage | 是否显示统计信息 | bool | true
pageSize | 每页显示记录数 | number | 10
pageNum | 当前页码 | number | 1
total | 数据总数 | number | 0
onPageNumChange | 页码改变触发 | function(pageNum) {} | -
onPageSizeChange | 每页显示条数 改变触发 | function(pageSize) {} | -