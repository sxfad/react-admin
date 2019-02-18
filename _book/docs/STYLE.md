# 样式
系统使用[less](http://lesscss.org/)进行样式的编写。

## css 模块化
为了避免多人合作样式冲突，系统对src下的less文件启用了Css Module，css文件没有使用Css Module。

[Css Module](https://github.com/css-modules/css-modules)配合[react-css-modules](https://github.com/gajus/react-css-modules)使用：

style.less
```less
.root{
    width: 100%;
    height: 100%;
}
```
Some.jsx
```jsx
import '/path/to/style.less';

export default class Some extends React.Component {
    render() {
        return (
            <div styleName="root"></div>            
        );
    }
}
```

注：src/library中less没有启用Css Module，基础组件不使用Css Module，不利于样式覆盖；

## 主题
使用less，通过样式覆盖来实现。

### 编写主题
- less文件中使用主题相关变量；
- 编写`/src/theme.js`通过[less-loader](https://github.com/webpack-contrib/less-loader)的`modifyVars`覆盖less中的变量；
- 自定义的颜色元素，如果参与主题，不能使用Css Module（无法样式覆盖），同时需要修改`/public/color.less`；

注：目前每次修改了theme.js 需要重新yarn start 才能生效

### 参考
- Ant Design 主题 参考：https://ant-design.gitee.io/docs/react/customize-theme-cn
- `/public/color.less` 来自于 https://ant-design.gitee.io/color.less （经过整理）  
