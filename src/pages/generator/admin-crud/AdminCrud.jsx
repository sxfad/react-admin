import React, {Component} from 'react'
import {Card, Button, Collapse, Checkbox, Modal} from 'antd';
import PageContent from '@/layouts/page-content';
import FixBottom from '@/layouts/fix-bottom';
import BaseInfo from '../BaseInfo';
import DatabaseConfig from '../DatabaseConfig';
import ListPage from '../ListPage';
import EditPage from '../EditPage';
import PreviewCodeModal from '../PreviewCodeModal';
import config from '@/commons/config-hoc';
import './style.less'

export const PAGE_ROUTE = '/admin-crud';

const Panel = Collapse.Panel;

@config({
    path: '/admin-crud',
    title: {local: 'codeGenerator', text: '代码生成', icon: 'code'},
    connect: state => ({
        srcDirectories: state.generator.srcDirectories,
        showDatabaseConfig: state.database.showConfig,
    }),
})
export default class AdminCrud extends Component {
    state = {
        activePanelKeys: ['database', 'listPage', 'editPage', 'listEditModel'],
        checkedPanels: {
            listPage: true,
            editPage: true,
            listEditModel: false,
        },
        codeForPreview: '',
        previewCodeModalVisible: false,
    };

    componentWillMount() {
        this.props.action.generator.getSrcDirs();
    }

    handleSubmit = () => {
        const {checkedPanels} = this.state;
        const allPromise = [this.validateBaseInfo()];

        if (checkedPanels.listPage) {
            allPromise.push(this.validateListPage());
        }

        if (checkedPanels.editPage) {
            allPromise.push(this.validateEditPage());
        }

        if (checkedPanels.listEditModel) {
            allPromise.push(this.validateListEditModel());
        }

        window.Promise.all(allPromise)
            .then(values => {
                const baseInfo = values.shift();
                const params = {};

                if (checkedPanels.listPage) {
                    params.listPage = values.shift();
                }

                if (checkedPanels.editPage) {
                    params.editPage = values.shift();
                }

                if (checkedPanels.listEditModel) {
                    params.listEditModel = values.shift();
                }

                this.doSubmit(params, baseInfo);

            }).catch(console.error);
    };

    doSubmit = (params, baseInfo) => {
        const fileKeys = Object.keys(params);
        const files = [];

        fileKeys.forEach(key => {
            const config = params[key];
            const {outPutDir, outPutFile} = config;
            files.push({
                fileDir: outPutDir,
                fileName: outPutFile,
            });

        });

        // 校验文件是否存在
        this.props.action.generator.checkFileExist({
            params: {files},
            onResolve: (result) => {
                const existFiles = [];
                if (result && result.length) {
                    result.forEach(({fileName, exist}) => {
                        if (exist) {
                            existFiles.push(fileName);
                        }
                    })
                }
                if (existFiles.length) {
                    return Modal.confirm({
                        title: '需要确认',
                        content: (
                            <span>
                                <div>如下文件已存在，是否覆盖？</div>
                                {existFiles.map(item => <div key={item} style={{color: 'red'}}>{item}</div>)}
                             </span>
                        ),
                        okText: '确认',
                        cancelText: '取消',
                        onOk: () => {
                            this.props.action.generator.generatorFiles({params: {baseInfo, ...params}, successTip: '生成成功！'});
                        },
                    });

                }
                this.props.action.generator.generatorFiles({params: {baseInfo, ...params}, successTip: '生成成功！'});
            }
        });
    };

    handlePanelChange = (activePanelKeys) => {
        this.setState({activePanelKeys});
    };

    handlePanelCheckboxChange = (checked, key) => {
        const activePanelKeys = [...this.state.activePanelKeys];
        const checkedPanels = {...this.state.checkedPanels};
        checkedPanels[key] = checked;

        const activePanelKeyIndex = activePanelKeys.indexOf(key);

        if (checked && activePanelKeyIndex === -1) {
            activePanelKeys.push(key);
        }

        if (!checked && activePanelKeyIndex !== -1) {
            activePanelKeys.splice(activePanelKeyIndex, 1)
        }

        this.setState({checkedPanels, activePanelKeys});
    };

    getPanelProps = (title, key) => {
        const {checkedPanels} = this.state;
        const checked = checkedPanels[key];
        const titleStyle = {};

        if (!checked) {
            titleStyle.color = 'rgba(0,0,0,.25)';
        }

        const header = (
            <Checkbox
                checked={checked}
                onChange={(e) => this.handlePanelCheckboxChange(e.target.checked, key)}
                onClick={e => e.stopPropagation()}
            >
                <span
                    style={titleStyle}
                    onClick={e => e.stopPropagation()}
                >{title}</span>
            </Checkbox>
        );
        return {
            header,
            key,
            disabled: !checkedPanels[key],
        };
    };

    handleListPagePreviewCode = () => {
        window.Promise.all([
            this.validateBaseInfo(),
            this.validateListPage(),
        ]).then(([baseInfo, listPage]) => {
            const params = {baseInfo, pageInfo: listPage};
            this.props.action.generator
                .getFileContent({
                    params,
                    onResolve: this.previewCode
                });
        }).catch(console.error);
    };

    handleEditPagePreviewCode = () => {
        window.Promise.all([
            this.validateBaseInfo(),
            this.validateEditPage(),
        ]).then(([baseInfo, editPage]) => {
            const params = {baseInfo, pageInfo: editPage};
            this.props.action.generator
                .getFileContent({
                    params,
                    onResolve: this.previewCode
                });
        }).catch(console.error);
    };

    handleListEditModelPreviewCode = () => {
        window.Promise.all([
            this.validateBaseInfo(),
            this.validateListEditModel(),
        ]).then(([baseInfo, listEditModel]) => {
            const params = {baseInfo, pageInfo: listEditModel};
            this.props.action.generator
                .getFileContent({
                    params,
                    onResolve: this.previewCode
                });
        }).catch(console.error);
    };

    previewCode = (content) => {
        this.setState({previewCodeModalVisible: true, codeForPreview: content});
    };

    render() {
        const {showDatabaseConfig} = this.props;
        const {
            activePanelKeys,
            checkedPanels,
            codeForPreview,
            previewCodeModalVisible,
        } = this.state;
        const fileCount = Object.keys(checkedPanels).reduce((prev, next) => checkedPanels[next] ? prev + 1 : prev, 0);
        const cardStyle = {
            marginBottom: '16px',
        };

        return (
            <PageContent styleName="root">
                <Card
                    title="基础命名"
                    style={cardStyle}
                    bodyStyle={{paddingBottom: 0}}
                >
                    <BaseInfo
                        validate={validate => this.validateBaseInfo = validate}
                    />
                </Card>

                <Collapse activeKey={activePanelKeys} onChange={this.handlePanelChange}>
                    <Panel
                        header={(
                            <span>
                                数据库配置
                                <a
                                    style={{marginLeft: 16}}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        this.props.action.database
                                            .setFields({showConfig: !showDatabaseConfig})
                                    }}
                                >
                                    {showDatabaseConfig ? '隐藏配置' : '显示配置'}
                                </a>
                            </span>
                        )}
                        key="database"
                    >
                        <DatabaseConfig
                            validate={validate => this.validateDatabaseConfig = validate}
                        />
                    </Panel>
                    <Panel {...this.getPanelProps('列表页', 'listPage')}>
                        <ListPage
                            validate={validate => this.validateListPage = validate}
                            onPreviewCode={this.handleListPagePreviewCode}
                        />
                    </Panel>
                    <Panel {...this.getPanelProps('编辑页', 'editPage')}>
                        <EditPage
                            validate={validate => this.validateEditPage = validate}
                            onPreviewCode={this.handleEditPagePreviewCode}
                        />
                    </Panel>
                </Collapse>

                <PreviewCodeModal
                    visible={previewCodeModalVisible}
                    code={codeForPreview}
                    onCancel={() => this.setState({previewCodeModalVisible: false})}
                    onOk={() => this.setState({previewCodeModalVisible: false})}
                />

                <FixBottom>
                    <Button
                        type="primary"
                        onClick={this.handleSubmit}
                        disabled={!fileCount}
                    >
                        生成文件（{fileCount}）
                    </Button>
                </FixBottom>
            </PageContent>
        );
    }
}
