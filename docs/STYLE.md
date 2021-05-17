# 样式
系统使用[less](http://lesscss.org/)进行样式的编写。

## css 模块化
为了避免多人合作样式冲突，系统对src下的less文件启用了Css Module，css文件没有使用Css Module。

style.less
```less
.root{
    width: 100%;
    height: 100%;
}
```
Some.jsx
```jsx
import styles from '/path/to/style.less';

export default class Some extends React.Component {
    render() {
        return (
            <div className={styles.root}></div>            
        );
    }
}
```

## 主题
使用less，通过样式覆盖来实现。

### 编写主题
- less文件中使用主题相关变量；
- 编写`/src/theme.less`通过[less-loader](https://github.com/webpack-contrib/less-loader)的`modifyVars`覆盖less中的变量；

### 参考
- Ant Design 主题 参考：https://ant-design.gitee.io/docs/react/customize-theme-cn
