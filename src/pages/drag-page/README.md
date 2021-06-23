1. [ ] 组件入库， 提供组件管理页面，用于编辑，入库组件
1. [ ] 组件、页面、模块编辑器 源码编辑 + iframe render 预览 + 保存自动截图iframe 错误提示
1. [ ] 编辑器，自定义提示，比如 componentName 等
1. [ ] 双击快捷编辑
1. [ ] onDragHover 优化 enter leave 添加延迟
1. [ ] icon 优化，选择更加适合的图标
1. [ ] ctrl + c ctrl + v 复制赞贴组件
1. [x] 部分组件无法拖拽，可以添加 withDragProps: false, hooks.afterRender修复
1. [ ] dragPage.activeView 标记当前视图，用于快捷键判断
1. [ ] component store 中深层组件不要写__config，源码编辑之后，会被干掉，可以编写特殊组件，放入drag-page/components中 或者通过props控制行为
1. [ ] 组件库中配置的组件，尽量只是用原生html 和 antd 组件库，不要引入ra-lib
1. [ ] schema 转 源码的时候，可以考虑使用 html + antd + 其他组件库方式
1. [ ] 拖拽用户自定义模块时，替换componentId，但是要注意 modal类型id的同步问题
1. [ ] 支持用户上传 vs code 的快捷键配置
1. [x] 元素拖拽过程中，点击 command 或 ctrl 可以在 wrapper 非 wrapper 模式下切换
1. [ ] 左侧组件列表比较多，使用虚拟列表或者虚拟Table优化
1. [ ] Table.Column children 作为 column.render 的返回值，一般操作列用到


1. number | object | array
1. number | object
1. function
1. ReactNode

