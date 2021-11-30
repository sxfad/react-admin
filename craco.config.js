// create-react-app 配置修改
// https://github.com/gsoft-inc/craco
const path = require('path');

const ROOT_PATH = process.cwd();
const req = name => require(path.join(ROOT_PATH, 'node_modules', name));

const {BundleAnalyzerPlugin} = req('webpack-bundle-analyzer');
const WebpackBar = req('webpackbar');
const CracoAntDesignPlugin = req('craco-antd');
const CracoLessPlugin = req('craco-less'); // include in craco-antd
const MiniCssExtractPlugin = req('mini-css-extract-plugin');
const generator = req('@ra-lib/generator');

const packageName = require(path.join(ROOT_PATH, 'package.json')).name;

const SRC_PATH = path.join(ROOT_PATH, 'src');
const NODE_MODULES_PATH = path.join(ROOT_PATH, 'node_modules');
const PAGES_PATH = path.join(SRC_PATH, 'pages');
const BUILD_PATH = path.join(ROOT_PATH, process.env.BUILD_PATH || 'build');
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
                lessLoaderOptions: {
                    lessOptions: {
                        modifyVars: {
                            packageName,
                        },
                    },
                },
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
                                    modifyVars: {
                                        packageName,
                                    },
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
    devServer: (devServerConfig, {env, paths, proxy, allowedHost}) => {
        if (!devServerConfig.headers) devServerConfig.headers = {};
        devServerConfig.headers['Access-Control-Allow-Origin'] = '*';

        // 不能使用before,会使proxy失效
        devServerConfig.setup = function(app) {
            generator(app);
        };
        return devServerConfig;
    },
    webpack: {
        alias: {
            // 使所有的react 都访问主应用安装的包
            react: path.join(NODE_MODULES_PATH, 'react'),
            antd: path.join(NODE_MODULES_PATH, 'antd'),
            moment: path.join(NODE_MODULES_PATH, 'moment'),
            'react-dom': path.join(NODE_MODULES_PATH, 'react-dom'),
            'react-redux': path.join(NODE_MODULES_PATH, 'react-redux'),
            'redux': path.join(NODE_MODULES_PATH, 'redux'),
            'react-router-dom': path.join(NODE_MODULES_PATH, 'react-router-dom'),
            'axios': path.join(NODE_MODULES_PATH, 'axios'),

            root: ROOT_PATH,
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

            webpackConfig.output.library = packageName;
            webpackConfig.output.libraryTarget = 'umd';
            webpackConfig.output.jsonpFunction = `webpackJsonp_${packageName}`;

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

            // mini-css-extract-plugin 对css引入的顺序会有提示，如果我们并不依赖于css文件顺序，这个可以关闭
            // https://github.com/webpack-contrib/mini-css-extract-plugin/issues/250#issuecomment-415345126
            const instanceOfMiniCssExtractPlugin = webpackConfig.plugins.find((plugin) => plugin instanceof MiniCssExtractPlugin);
            if (instanceOfMiniCssExtractPlugin) instanceOfMiniCssExtractPlugin.options.ignoreOrder = true;

            return webpackConfig;
        },

    },
    babel: {
        plugins: [
            ['@ra-lib/babel-plugin-attribute-wrapper',
                { // className={xxx} 转 className={_method(xxx)}
                    packageName: 'classnames',
                    attributeName: 'className',
                },
                'className',
            ],
            ['@ra-lib/babel-plugin-attribute-wrapper',
                { // 三元运算_method(xxx) ? <div> : null
                    importName: 'hasPermission', // import {hasPermission} from packageName
                    packageName: '@ra-lib/admin',
                    attributeName: 'r-code',
                    conditional: true,
                },
                'permission-remove',
            ],
            ['@ra-lib/babel-plugin-attribute-wrapper',
                { // 添加disabled={!_method(xxx)}属性
                    importName: 'hasPermission',
                    packageName: '@ra-lib/admin',
                    attributeName: 'd-code',
                    replaceAttributeName: 'disabled',
                    negation: true,
                },
                'permission-disabled',
            ],
            // ['@ra-lib/babel-plugin-attribute-wrapper',
            //     { // r-report="用户保存" onClick={this.handleClick} => onClick={_method("用户保存", this.handleClick)}
            //         importName: 'report',
            //         packageName: 'src/commons',
            //         attributeName: 'r-report',
            //         wrapperAttributedName: 'onClick',
            //     },
            //     'wrapper',
            // ],
            '@babel/plugin-proposal-export-default-from',
            '@babel/plugin-proposal-optional-chaining',
            '@babel/plugin-proposal-nullish-coalescing-operator',
            [
                '@babel/plugin-proposal-decorators',
                {
                    'legacy': true,
                },
            ],
            '@babel/plugin-syntax-jsx',
        ],
    },
};
