import React from "react";
import {BaseComponent} from "./BaseComponent";
import {Button, Col, Container, Input, Row} from "reactstrap";
import {ajax, COLORS} from "../util/Util";
import $ from "jquery";
import {URLS} from "../util/URLS";

export class Command extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            result: null
        };
    }

    run = (cmdIdx) => {
        const cmd = [
            'cmd /c dir log',
            'find /N /I "-" log/startServer_yyyyMMdd_HHmmss.log',
            'find /N /I "Tunnel established at " log/natapp.log'
        ];
        if (cmd[cmdIdx]) {
            $("#command").val(cmd[cmdIdx]);
        } else {
            ajax({
                optionName: "执行cmd命令",
                url: URLS.COMMAND_RUN,
                data: {
                    command: $("#command").val()
                },
                success: (result) => {
                    this.alert(COLORS.success, "执行完成");
                    if (result) {
                        this.setSomeState({result: result.message})
                    }
                }
            });
        }
    };

    render() {
        return (
            <Container style={{marginTop: "10px"}}>
                <Row>
                    <Col style={{textAlign: "center"}}>
                        <Input type="text" id="command" placeholder="请输入cmd命令"/>
                        <Button color={COLORS.secondary} size="sm" onClick={() => this.run(0)}>日志列表</Button>{'  '}
                        <Button color={COLORS.info} size="sm" onClick={() => this.run(1)}>查看日志</Button>{'  '}
                        <Button color={COLORS.warning} size="sm" onClick={() => this.run(2)}>外网地址</Button>{'  '}
                        <Button color={COLORS.primary} size="sm" onClick={() => this.run()}>执行命令</Button>
                    </Col>
                </Row>
                <Row>
                    <Col id="commandResult">
                        <pre style={{color: "#FFFFFF"}}>
                        {this.state.result}
                        </pre>
                    </Col>
                </Row>
            </Container>
        );
    }
}