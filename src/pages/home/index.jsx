import React, {Component} from 'react';
import ReactEchart from 'echarts-for-react';
import {Row, Col} from 'antd';
import config from '@/commons/config-hoc';
import PageContent from '@/layouts/page-content';
import DataBlock from '@/components/data-block';
import './style.less';

@config({
    path: '/',
    title: {local: 'home', text: '首页', icon: 'home'},
    breadcrumbs: [{key: 'home', local: 'home', text: '首页', icon: 'home'}],
})
export default class Home extends Component {
    constructor(...props) {
        super(...props);
        this.props.onComponentWillShow(() => {
            this.setState({
                users: 868,
                read: 1869,
                like: 666,
                warning: 28,
                start: 168,
            });
        });

        this.props.onComponentWillHide(() => {
            this.setState({
                users: 0,
                read: 0,
                like: 0,
                warning: 0,
                start: 0,
            });
        });
    }

    state = {
        users: 868,
        read: 1869,
        like: 666,
        warning: 28,
        start: 168,
    };
    getPieOption = () => {
        return {
            title: {
                text: '访问来源',
                left: 'center',
                top: 20,
            },

            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },

            toolbox: {
                // y: 'bottom',
                feature: {
                    dataView: {},
                    saveAsImage: {
                        pixelRatio: 2
                    }
                }
            },

            visualMap: {
                show: false,
                min: 80,
                max: 600,
                inRange: {
                    colorLightness: [0, 1]
                }
            },
            series: [
                {
                    name: '访问来源',
                    type: 'pie',
                    radius: '55%',
                    center: ['50%', '50%'],
                    data: [
                        {value: 335, name: '直接访问'},
                        {value: 310, name: '邮件营销'},
                        {value: 274, name: '联盟广告'},
                        {value: 235, name: '视频广告'},
                        {value: 400, name: '搜索引擎'}
                    ].sort(function (a, b) {
                        return a.value - b.value;
                    }),
                    roseType: 'radius',
                    labelLine: {
                        normal: {
                            smooth: 0.2,
                            length: 10,
                            length2: 20
                        }
                    },
                    animationType: 'scale',
                    animationEasing: 'elasticOut',
                    animationDelay: function (idx) {
                        return Math.random() * 200;
                    }
                }
            ]
        };
    };

    getBarOption = () => {
        const xAxisData = [];
        const data1 = [];
        const data2 = [];
        for (let i = 0; i < 100; i++) {
            xAxisData.push('产品' + i);
            data1.push((Math.sin(i / 5) * (i / 5 - 10) + i / 6) * 5);
            data2.push((Math.cos(i / 5) * (i / 5 - 10) + i / 6) * 5);
        }

        return {
            title: {
                text: '月下载量'
            },
            legend: {
                data: ['上个月', '本月'],
                align: 'left'
            },
            toolbox: {
                // y: 'bottom',
                feature: {
                    magicType: {
                        type: ['stack', 'tiled']
                    },
                    dataView: {},
                    saveAsImage: {
                        pixelRatio: 2
                    }
                }
            },
            tooltip: {},
            xAxis: {
                data: xAxisData,
                silent: false,
                splitLine: {
                    show: false
                }
            },
            yAxis: {},
            series: [
                {
                    name: '上个月',
                    type: 'bar',
                    data: data1,
                    animationDelay: function (idx) {
                        return idx * 10;
                    }
                },
                {
                    name: '本月',
                    type: 'bar',
                    data: data2,
                    animationDelay: function (idx) {
                        return idx * 10 + 100;
                    }
                }],
            animationEasing: 'elasticOut',
            animationDelayUpdate: function (idx) {
                return idx * 5;
            }
        };
    };

    getBar2Option = () => {
        return {
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            legend: {
                data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎', '百度', '谷歌', '必应', '其他']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                {
                    name: '直接访问',
                    type: 'bar',
                    data: [320, 332, 301, 334, 390, 330, 320]
                },
                {
                    name: '邮件营销',
                    type: 'bar',
                    stack: '广告',
                    data: [120, 132, 101, 134, 90, 230, 210]
                },
                {
                    name: '联盟广告',
                    type: 'bar',
                    stack: '广告',
                    data: [220, 182, 191, 234, 290, 330, 310]
                },
                {
                    name: '视频广告',
                    type: 'bar',
                    stack: '广告',
                    data: [150, 232, 201, 154, 190, 330, 410]
                },
                {
                    name: '搜索引擎',
                    type: 'bar',
                    data: [862, 1018, 964, 1026, 1679, 1600, 1570],
                    markLine: {
                        lineStyle: {
                            normal: {
                                type: 'dashed'
                            }
                        },
                        data: [
                            [{type: 'min'}, {type: 'max'}]
                        ]
                    }
                },
                {
                    name: '百度',
                    type: 'bar',
                    barWidth: 5,
                    stack: '搜索引擎',
                    data: [620, 732, 701, 734, 1090, 1130, 1120]
                },
                {
                    name: '谷歌',
                    type: 'bar',
                    stack: '搜索引擎',
                    data: [120, 132, 101, 134, 290, 230, 220]
                },
                {
                    name: '必应',
                    type: 'bar',
                    stack: '搜索引擎',
                    data: [60, 72, 71, 74, 190, 130, 110]
                },
                {
                    name: '其他',
                    type: 'bar',
                    stack: '搜索引擎',
                    data: [62, 82, 91, 84, 109, 110, 120]
                }
            ]
        };
    };

    render() {
        const {
            users,
            read,
            like,
            warning,
            start,
        } = this.state;

        const colStyle = {
            border: '1px solid #e8e8e8',
            borderRadius: '5px',
            padding: 8,
        };
        return (
            <PageContent styleName="root">
                <div styleName="statistics">
                    <DataBlock
                        color="#1890FF"
                        count={users}
                        tip="新增用户"
                        icon="user-add"
                    />
                    <DataBlock
                        color="#FAAD14"
                        count={read}
                        tip="昨日阅读"
                        icon="area-chart"
                    />
                    <DataBlock
                        color="#3E8F2D"
                        count={like}
                        tip="新增点赞"
                        icon="like"
                    />
                    <DataBlock
                        color="red"
                        count={warning}
                        tip="报警次数"
                        icon="warning"
                    />
                    <DataBlock
                        color="#FA541C"
                        count={start}
                        tip="新增收藏"
                        icon="star"
                    />
                </div>
                <Row style={{marginTop: 16}}>
                    <Col span={8} style={{paddingRight: 16}}>
                        <div style={colStyle}>
                            <ReactEchart option={this.getPieOption()}/>
                        </div>
                    </Col>
                    <Col span={16}>
                        <div style={colStyle}>
                            <ReactEchart option={this.getBarOption()}/>
                        </div>
                    </Col>
                </Row>
                <div style={{...colStyle, marginTop: 16}}>
                    <ReactEchart option={this.getBar2Option()}/>
                </div>
            </PageContent>
        );
    }
}
