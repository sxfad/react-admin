import * as native from './native';
import * as antd from './antd';
import * as customer from './customer';
import * as form from './form';

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
 * props：组件的属性列表，用于右侧的属性编辑，属性说明：
 *      name: 属性名称
 *      attribute: 属性字段名
 *      valueType: 属性值的类型
 *      defaultValue: 属性的默认值，用于判断是对应节点否保留属性
 *      formType: 表单类型
 *      labelBlock: true/false label是否独占一行
 *      half: true/false 是否只占半行，用于两个属性一行显示
 *      allowEmpty: true/false 是否允许空值（'' null void 0），如果允许，对应节点将保留对应属性，否则删除
 *      visible: true/false/function(values) 是否显示，用于联动控制
 *      ignoreAttribute: true/false 是否是自定义属性，如果是，生成源码时，将忽略此属性
 *      其他属性作为FormElement属性
 *
 * render: 渲染组件
 * targetTypes: string 或 [string, string] 用于指定当前组件可以投放到那些组件当中，比如Col要指定 targetTypes: 'Row'等
 * acceptTypes: string 或 [string, string] 指定当前组件可以接受投放的类型，比如Row要指定 targetTypes: 'Col'等，与targetTypes成对出现
 * */

export const categories = [customer, form, antd, native];

export default {
    ...form.default,
    ...native.default,
    ...antd.default,
    ...customer.default,
};
