import React, {Component} from 'react';
import PropTypes from 'prop-types';
import 'animate.css';

export default function (OriTable) {

    class AnimationTable extends Component {
        constructor(props) {
            super(props);
            this.state.dataSource = props.dataSource;
        }

        static propTypes = {
            rowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,            // 数据的唯一key值
            animationDuring: PropTypes.number,      // 动画持续时间
            inAnimationClass: PropTypes.string,     // 插入动画 class
            outAnimationClass: PropTypes.string,    // 移除动画 class
        };

        static defaultProps = {
            rowKey: 'id',
            animationDuring: 500,
            inAnimationClass: 'animated fadeInLeft',
            outAnimationClass: 'animated zoomOutRight',
        };

        state = {
            dataSource: [],
        };

        isExist = (record1, index1, record2, index2) => {
            const {rowKey} = this.props;

            if (typeof rowKey === 'string') {
                return record1[rowKey] === record2[rowKey];
            } else {
                return rowKey(record1, index1) === rowKey(record2, index2);
            }
        };

        componentWillReceiveProps(nextProps) {
            let {animationDuring} = this.props;
            const nextDataSource = nextProps.dataSource || [];
            const dataSource = this.props.dataSource || [];

            // 筛选原dataSource中有哪些数据新的dataSource中已经删除
            let hasDeletedRecord = false;
            dataSource.forEach((item, index) => {
                const exist = nextDataSource.find((it, i) => this.isExist(item, index, it, i));
                if (!exist) {
                    hasDeletedRecord = true;
                    item.__isDeleted = true;
                }
            });

            nextDataSource.forEach((item, index) => {
                const exist = dataSource.find((it, i) => this.isExist(item, index, it, i));
                if (!exist) {
                    item.__isNewAdd = true;
                }
            });

            if (hasDeletedRecord) {
                this.setState({dataSource});

                setTimeout(() => {
                    this.setState({dataSource: nextDataSource});
                }, animationDuring);
            } else {
                this.setState({dataSource: nextDataSource});
            }
        }


        render() {
            const {
                rowClassName,
                inAnimationClass,
                outAnimationClass,
                ...others
            } = this.props;
            const {dataSource} = this.state;

            return (
                <OriTable
                    {...others}
                    dataSource={dataSource}
                    rowClassName={(record, index) => {
                        let cn = '';
                        if (rowClassName) {
                            cn = rowClassName(record, index);
                        }

                        if (record.__isDeleted) return `${outAnimationClass} ${cn}`;
                        if (record.__isNewAdd) return `${inAnimationClass} ${cn}`;
                    }}
                />
            );
        }
    }

    return AnimationTable;
}

