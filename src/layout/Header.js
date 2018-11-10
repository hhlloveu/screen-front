import React from 'react';
import {Alert, Button, ButtonGroup} from "reactstrap";
import {ajax, COLORS} from "../util/Util";
import {URLS} from "../util/URLS";
import {BaseComponent} from "../component/BaseComponent";
import $ from "jquery";

export class Header extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            msg: null,
            color: null,
            isRunning: true,
            login: false,
            user: null
        };
        this.setSelf(this.subFix.header);
    }

    alert = (color, msg) => {
        if (!$.inArray(color, COLORS.all)) {
            color = COLORS.info;
        }
        this.setSomeState({
            msg: msg,
            color: color
        });
        window.setTimeout(() => this.setSomeState({
            msg: null,
            color: COLORS.light
        }), 2000);
    };

    on = () => ajax({
        optionName: "启动播放",
        url: URLS.SCHEDULE_ON,
        success: (data) => {
            if (data == 1) {
                this.setSomeState({
                    isRunning: true
                });
                this.alert(COLORS.success, "启动播放成功");
            } else {
                this.setSomeState({
                    isRunning: false
                });
                this.alert(COLORS.danger, "启动播放失败");
            }
        }
    });

    off = () => ajax({
        optionName: "停止播放",
        url: URLS.SCHEDULE_OFF,
        success: (data) => {
            if (data == 1) {
                this.setSomeState({
                    isRunning: false
                });
                this.alert(COLORS.success, "停止播放成功");
            } else {
                this.setSomeState({
                    isRunning: true
                });
                this.alert(COLORS.danger, "停止播放失败");
            }
        }
    });

    init = () => {
        ajax({
            optionName: "获取服务状态",
            url: URLS.STATE_ON_OFF,
            success: (data) => {
                this.setSomeState({
                    isRunning: data == 1
                });
            }
        });
    };

    logout = () => ajax({
        optionName: "退出",
        url: URLS.LOGOUT,
        success: (data) => {
            if (data == 1) {
                this.props.logout();
            } else {
                this.alert(COLORS.danger, "退出失败");
            }
        }
    });

    render() {
        return (
            <div className="Header">
                <div className="Header-left">
                </div>
                <div className="Header-center">
                    {
                        (() => {
                            if (this.state.msg && this.state.msg != "") {
                                return (
                                    <Alert color={this.state.color || "success"} size="sm">
                                        {this.state.msg}
                                    </Alert>
                                );
                            }
                        })()
                    }
                </div>
                {
                    (() => {
                        if (this.state.login) {
                            return (
                                <div className="Header-right">
                                    {this.state.user}
                                    &nbsp;&nbsp;
                                    {
                                        (() => {
                                            if (this.state.isRunning) {
                                                return (
                                                    <ButtonGroup>
                                                        <Button color={COLORS.success} size="sm">大屏播放已启动</Button>
                                                        <Button color={COLORS.danger} size="sm"
                                                                onClick={() => this.off()}>停止</Button>
                                                    </ButtonGroup>
                                                );
                                            } else {
                                                return (
                                                    <ButtonGroup>
                                                        <Button color={COLORS.danger} size="sm">大屏播放已停止</Button>
                                                        <Button color={COLORS.success} size="sm"
                                                                onClick={() => this.on()}>启动</Button>
                                                    </ButtonGroup>
                                                );
                                            }
                                        })()
                                    }
                                    &nbsp;&nbsp;
                                    <Button color="primary" size="sm" onClick={() => this.logout()}>退出</Button>
                                </div>
                            );
                        }
                    })()
                }
            </div>
        );
    }
}