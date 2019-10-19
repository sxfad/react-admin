import React, {Component} from 'react';
import ReactEchart from 'echarts-for-react';
import echarts from 'echarts';
import {Row, Col} from 'antd';
import Map from './Map';
import Bar from './Bar';
import {DataBlock} from '@/library/components';
import PageContent from "@/layouts/page-content";
import './style.less';

export default class Home extends Component {
    // constructor(...props) {
    //     super(...props);
    //     this.props.onComponentWillShow(() => {
    //         this.setState({
    //             users: 868,
    //             read: 1869,
    //             like: 666,
    //             warning: 28,
    //             start: 168,
    //         });
    //     });
    //
    //     this.props.onComponentWillHide(() => {
    //         this.setState({
    //             users: 0,
    //             read: 0,
    //             like: 0,
    //             warning: 0,
    //             start: 0,
    //         });
    //     });
    // }

    state = {
        users: 868,
        read: 1869,
        like: 666,
        warning: 28,
        start: 168,
    };

    getBar3Option = () => {
        const charts = {
            unit: '户数',
            names: ['新增户数', '注销户数'],
            lineX: ['2012年', '2013年', '2014年', '2015年', '2016年', '2017年', '2018年'],
            value: [
                [451, 352, 303, 534, 95, 236, 217, 328, 159, 151, 231, 192, 453, 524, 165, 236, 527, 328, 129, 530],
                [360, 545, 80, 192, 330, 580, 192, 80, 250, 453, 352, 28, 625, 345, 65, 325, 468, 108, 253, 98]
            ]

        };
        const color = ['rgba(23, 255, 243', 'rgba(119,61,190'];
        const lineY = [];
        for (let i = 0; i < charts.names.length; i++) {
            let x = i;
            if (x > color.length - 1) {
                x = color.length - 1
            }
            let data = {
                name: charts.names[i],
                type: 'line',
                color: color[x] + ')',
                smooth: true,
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: color[x] + ', .4)'
                        }, {
                            offset: 0.8,
                            color: color[x] + ', 0)'
                        }], false),
                        shadowColor: 'rgba(0, 0, 0, 0.1)',
                        shadowBlur: 10
                    }
                },
                symbol: 'circle',
                symbolSize: 5,
                data: charts.value[i]
            };
            lineY.push(data)
        }
        lineY[0].markLine = {
            silent: true,
            data: [{
                yAxis: 5
            }, {
                yAxis: 100
            }, {
                yAxis: 200
            }, {
                yAxis: 300
            }, {
                yAxis: 400
            }]
        };
        return {
            title: {
                text: '开通户数的统计'
            },

            backgroundColor: '#fff',
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: charts.names,
                textStyle: {
                    fontSize: 12,
                    color: 'rgb(50,50,50,1)'
                },
                right: '4%'
            },
            grid: {
                top: '24%',
                left: '4%',
                right: '4%',
                bottom: '12%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: charts.lineX,
                axisLabel: {
                    textStyle: {
                        color: 'rgb(50,50,50,1)'
                    },
                    formatter: function (params) {
                        return params.split(' ')[0]
                    }
                }
            },
            yAxis: {
                name: charts.unit,
                type: 'value',
                axisLabel: {
                    formatter: '{value}',
                    textStyle: {
                        color: 'rgb(50,50,50,1)'
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: 'rgb(50,50,50,0.3)'
                    }
                },
                axisLine: {
                    lineStyle: {
                        color: 'rgb(50,50,50,0.6)'
                    }
                }
            },
            series: lineY

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
            background: '#fff'
        };
        return (
            <PageContent styleName="root">
                <div styleName="statistics">
                    <DataBlock
                        color="#00dffe"
                        color2='#029cf5'
                        count={users}
                        tip="新增用户"
                        icon="user-add"
                    />
                    <DataBlock
                        color="#ff8a85"
                        color2='#ff6086'
                        count={read}
                        tip="昨日阅读"
                        icon="area-chart"
                    />
                    <DataBlock
                        color="#fbae52"
                        color2='#fda33a'
                        count={like}
                        tip="新增点赞"
                        icon="like"
                    />
                    <DataBlock
                        color="#b7a0f9"
                        color2="#7c69ff"
                        count={warning}
                        tip="报警次数"
                        icon="warning"
                    />
                    <DataBlock
                        color="#4640ff"
                        color2="#5ba0f8"
                        count={start}
                        tip="新增收藏"
                        icon="star"
                    />
                </div>
                <Row style={{marginTop: 10}}>
                    <Col span={12} style={{paddingRight: 10}}>
                        <div style={colStyle}>
                            <Map/>
                        </div>

                    </Col>
                    <Col span={12}>
                        <div style={colStyle}>
                            <Bar/>
                        </div>
                    </Col>
                </Row>

                <div style={{...colStyle, marginTop: 10}}>
                    <ReactEchart option={this.getBar3Option()}/>
                </div>
            </PageContent>
        );
    }
}
