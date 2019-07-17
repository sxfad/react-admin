import * as native from './native';
import * as antd from './antd';
import * as customer from './customer';

/**
 * 系统可用组件配置文件
 * 结构为对象，key对应组件type
 * tagName: 标签名，一般用于生成源码，获取方式为：tagName component === 'string' key
 * component：组件，用于渲染，一般与key同名
 * dependence：组件涉及到的依赖，可以生成import代码：import {${tagName}} from '${dependence}';
 * container：是否是容器组件，容器组件内部可以添加其他组件
 * direction: vertical / horizontal 默认 vertical 子组件排列方式，默认垂直（vertical）排列
 * import：文件头部引入，用于生成源码，
 * display: 用于拖拽包裹显示方式
 * visible: 是否在组件列表中显示
 * defaultProps: 默认属性，用于投放到页面时的默认样式
 * props：组件的属性列表，用于右侧的属性编辑
 * render: 渲染组件
 * targetTypes: string 或 [string, string] 用于指定当前组件可以投放到那些组件当中，比如Col要指定 targetTypes: 'Row'等
 * acceptTypes: string 或 [string, string] 指定当前组件可以接受投放的类型，比如Row要指定 targetTypes: 'Col'等，与targetTypes成对出现
 * */

export const categories = [customer, antd, native];

export default {
    ...native.default,
    ...antd.default,
    ...customer.default,
};
