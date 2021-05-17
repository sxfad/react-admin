const path = require('path');
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');
const WebpackBar = require('webpackbar');
const CracoAntDesignPlugin = require('craco-antd');
const CracoLessPlugin = require('craco-less'); // include in craco-antd

// create-react-app 配置修改
// https://github.com/gsoft-inc/craco

const SRC_PATH = path.join(__dirname, 'src');
const NODE_MODULES_PATH = path.join(__dirname, 'node_modules');
const PAGES_PATH = path.join(SRC_PATH, 'pages');
const BUILD_PATH = path.join(__dirname, process.env.BUILD_PATH || 'build');

// https://github.com/gajus/babel-plugin-react-css-modules/issues/291
// const genericNames = require('generic-names'); // v3.0.0
const CSS_MODULE_LOCAL_IDENT_NAME = '[local]_[hash:base64:5]';

// Don't open the browser during development
// process.env.BROWSER = 'none';

module.exports = {
    plugins: [
        {
            plugin: CracoAntDesignPlugin,
            options: {
                customizeThemeLessPath: path.join(SRC_PATH, 'theme.less'),
                babelPluginImportOptions: {
                    libraryDirectory: 'es',
                },
                // 加这个 antd 样式就挂了
                // cssLoaderOptions: {
                //     modules: {localIdentName: CSS_MODULE_LOCAL_IDENT_NAME},
                // },
                modifyLessRule: function(lessRule, _context) {
                    // src 中less交给 CracoLessPlugin 处理
                    lessRule.exclude = SRC_PATH;
                    return lessRule;
                },
            },
        },
        {
            plugin: CracoLessPlugin,
            options: {
                modifyLessRule: function(lessRule, _context) {
                    lessRule.test = /\.(less)$/;
                    lessRule.use = [
                        {
                            loader: 'style-loader',
                        },
                        {
                            loader: 'css-loader',
                            options: {
                                modules: {localIdentName: CSS_MODULE_LOCAL_IDENT_NAME},
                            },
                        },
                        {
                            loader: 'less-loader',
                            options: {
                                lessOptions: {
                                    javascriptEnabled: true,
                                },
                            },
                        },
                    ];
                    lessRule.exclude = /node_modules/;

                    return lessRule;
                },
            },
        },
    ],
    webpack: {
        output: {
            path: BUILD_PATH,
        },
        alias: {
            // 使所有的react 都访问主应用安装的包
            react: path.join(NODE_MODULES_PATH, 'react'),
            antd: path.join(NODE_MODULES_PATH, 'antd'),
            'react-dom': path.join(NODE_MODULES_PATH, 'react-dom'),
            'react-redux': path.join(NODE_MODULES_PATH, 'react-redux'),
            'redux': path.join(NODE_MODULES_PATH, 'redux'),
            'react-router-dom': path.join(NODE_MODULES_PATH, 'react-router-dom'),
            'axios': path.join(NODE_MODULES_PATH, 'axios'),

            src: SRC_PATH,
        },
        plugins: [
            new WebpackBar({profile: true}),
            ...(process.env.ANALYZER === 'true' ?
                [
                    new BundleAnalyzerPlugin({openAnalyzer: false}),
                ]
                : []),
        ],
        configure: (webpackConfig, {env, paths}) => {
            paths.appBuild = webpackConfig.output.path = BUILD_PATH;

            webpackConfig.module.rules.push({
                test: path.join(PAGES_PATH, 'page-configs.js'),
                enforce: 'pre',
                use: {
                    loader: require.resolve('@ra-lib/config-loader'),
                    options: {
                        pagesPath: PAGES_PATH,
                    },
                },
                include: SRC_PATH,
            });

            if (process.env.ANALYZER_TIME === 'true') {
                const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');

                const smp = new SpeedMeasurePlugin();

                return smp.wrap(webpackConfig);

            }
            return webpackConfig;
        },

    },
    babel: {
        plugins: [
            '@babel/plugin-proposal-export-default-from',
            '@babel/plugin-proposal-optional-chaining',
            '@babel/plugin-proposal-nullish-coalescing-operator',
            [
                '@babel/plugin-proposal-decorators',
                {
                    'legacy': true,
                },
            ],
            // 不推荐使用
            // [
            //     'react-css-modules',
            //     {
            //         generateScopedName: genericNames(CSS_MODULE_LOCAL_IDENT_NAME),
            //         'webpackHotModuleReloading': true,
            //         'filetypes': {
            //             '.less': {
            //                 'syntax': 'postcss-less',
            //             },
            //         },
            //         'handleMissingStyleName': 'throw',
            //         'autoResolveMultipleImports': true,
            //     },
            // ],
        ],
    },
};
