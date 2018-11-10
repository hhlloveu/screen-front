import React from "react";
import {BaseComponent} from "../component/BaseComponent";
import {Alert, Button, Form, FormGroup, Input, Label} from "reactstrap";
import {ajax, COLORS} from "../util/Util";
import $ from "jquery";
import {URLS} from "../util/URLS";

export class Login extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            msg: null,
            color: null
        };
        this.setSelf(this.subFix.login, this);
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

    login = () => {
        ajax({
            optionName: "登录",
            url: URLS.LOGIN,
            data: {
                userid: $("#userid").val(),
                pass: $("#pass").val()
            },
            success: (data) => {
                if (data.status == 1) {
                    this.props.login(data.user);
                } else {
                    this.alert(COLORS.danger, "登录失败");
                }
            }
        });
    };

    render() {
        return (
            <div>
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
                </div>
                <div style={{width: "50%", marginTop: "10%", marginLeft: "25%", textAlign: "center"}}>
                    <Form>
                        <FormGroup>
                            <Label for="userid" hidden>用户名</Label>
                            <Input type="text" name="userid" id="userid" placeholder="用户名"/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="pass" hidden>密码</Label>
                            <Input type="password" name="pass" id="pass" placeholder="密码"/>
                        </FormGroup>
                        <Button color={COLORS.primary} onClick={this.login}>登录</Button>
                    </Form>
                </div>
            </div>
        );
    }
}