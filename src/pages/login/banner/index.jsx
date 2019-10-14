import React, {Component} from 'react';
import loginBanner from './login_banner.png';
import logo from './logo.png';
import cirle from './cirle.png';
import folder from './folder.png';
import folder_grey from './folder_grey.png';
import text from './text.png';
import info from './info.png';
import star from './star.png';
import bar from './bar.png';
import './style.less';

export default class Banner extends Component {
    render() {
        return (
            <div styleName="root">
                <div styleName="logo">
                        <img alt="logo" src={logo}/>
                    <i>React Admin</i>
                </div>
                <div styleName="banner">
                    <div styleName="banner-image">
                        <img alt="宣传图" src={loginBanner}/>
                        <div styleName="star">
                            <img alt="star" src={star}/>
                        </div>
                        <div styleName="star2">
                            <img alt="star" src={star}/>
                        </div>
                        <div styleName="text">
                            <img alt="text" src={text}/>
                        </div>

                        <div styleName="folder_grey">
                            <img alt="folder_grey" src={folder_grey}/>
                        </div>
                        <div styleName="folder2">
                            <img alt="folder" src={folder}/>
                        </div>
                        <div styleName="folder">
                            <img alt="folder" src={folder}/>
                        </div>
                        <div styleName="info">
                            <img alt="info" src={info}/>
                        </div>
                        <div styleName="cirle_b">
                            <img alt="cirle" src={cirle}/>
                        </div>
                        <div styleName="cirle2">
                            <img alt="cirle" src={cirle}/>
                        </div>
                        <div styleName="cirle">
                            <img alt="cirle" src={cirle}/>
                        </div>
                        <div styleName="bar_z">
                            <img alt="bar" src={bar}/>
                        </div>

                    </div>
                </div>
            </div>
        );
    }
}
