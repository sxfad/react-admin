import React from 'react';
import * as allIcons from '@ant-design/icons/es/icons';
import AntdIcon, {createFromIconfontCN, getTwoToneColor, setTwoToneColor} from '@ant-design/icons';
import {withThemeSuffix, removeTypeTheme, getThemeFromTypeName, alias} from './utils';
import warning from './warning';

var iconsMap = allIcons;

var LegacyTypeIcon = function LegacyTypeIcon(props) {
    var type = props.type,
        theme = props.theme;

    if (theme) {
        var themeInName = getThemeFromTypeName(type);
        warning(!themeInName || theme === themeInName, 'Icon', 'The icon name \''.concat(type, '\' already specify a theme \'').concat(themeInName, '\',') + ' the \'theme\' prop \''.concat(theme, '\' will be ignored.'));
    }

    var computedType = withThemeSuffix(removeTypeTheme(alias(type)), theme || 'outlined');
    var targetIconComponent = iconsMap[computedType];
    warning(targetIconComponent, 'Icon', 'The icon name \''.concat(type, '\'').concat(theme ? 'with '.concat(theme) : '', ' doesn\'t exist, please check it at https://ant.design/components/icon'));
    return targetIconComponent ? React.createElement(targetIconComponent, props) : null;
};

var Icon = function Icon(props) {
    var type = props.type,
        component = props.component,
        children = props.children;
    warning(Boolean(type || component || children), 'Icon', 'Should have `type` prop or `component` prop or `children`.');

    if (component || children) {
        return React.createElement(AntdIcon, Object.assign({}, props));
    }

    if (typeof type === 'string') {
        return React.createElement(LegacyTypeIcon, Object.assign({}, props, {
            type: type,
        }));
    }

    return React.createElement(AntdIcon, null);
};

Icon.createFromIconfontCN = createFromIconfontCN;
Icon.getTwoToneColor = getTwoToneColor;
Icon.setTwoToneColor = setTwoToneColor;
export default Icon;
