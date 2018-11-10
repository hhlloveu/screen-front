import React from "react";
import {BaseComponent} from "./BaseComponent";
import {Button, Col, Container, Input, Row, Table} from "reactstrap";
import {ajax, COLORS} from "../util/Util";
import $ from "jquery";
import {URLS} from "../util/URLS";

export class Sql extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            list: null
        };
    }

    run = (sqlIdx) => {
        const sql = [
            "SELECT name FROM sqlite_master WHERE type = 'table' AND name != 'sqlite_sequence' ORDER BY name",
            "PRAGMA table_info (TABLE_NAME_HERE)"
        ];
        if (sql[sqlIdx]) {
            $("#sql").val(sql[sqlIdx]);
        } else {
            ajax({
                optionName: "执行SQL",
                url: URLS.SQL_RUN,
                data: {
                    sql: $("#sql").val()
                },
                success: (result) => {
                    this.alert(COLORS.success, "执行完成");
                    if (result) {
                        this.setSomeState({list: result})
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
                        <Input type="text" id="sql" placeholder="请输入SQL语句"/>
                        <Button color={COLORS.secondary} size="sm" onClick={() => this.run(0)}>列出表</Button>{'  '}
                        <Button color={COLORS.warning} size="sm" onClick={() => this.run(1)}>表结构</Button>{'  '}
                        <Button color={COLORS.primary} size="sm" onClick={() => this.run()}>执行SQL</Button>
                    </Col>
                </Row>
                <Row>
                    <Col id="sqlResult">
                        {
                            (() => {
                                if ($.isArray(this.state.list) && this.state.list.length>0) {
                                    const list = this.state.list;
                                    const obj = list[0];
                                    const dt = new Date().getTime();
                                    return (
                                        <Table dark striped key={"table" + dt}>
                                            <thead>
                                            <tr>
                                                {
                                                    (() => {
                                                        const th = [];
                                                        $.each(obj, (o) => {
                                                            if (obj.hasOwnProperty(o)) {
                                                                th.push(<th>{o.toUpperCase()}</th>);
                                                            }
                                                        });
                                                        return th;
                                                    })()
                                                }
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {
                                                (() => {
                                                    return list.map((item, idx) => {
                                                        return (
                                                            <tr key={"tr" + idx + dt}>
                                                                {
                                                                    (() => {
                                                                        const td = [];
                                                                        $.each(obj, (o) => {
                                                                            if (obj.hasOwnProperty(o)) {
                                                                                td.push(<td>{item[o]}</td>);
                                                                            }
                                                                        });
                                                                        return td;
                                                                    })()
                                                                }
                                                            </tr>
                                                        );
                                                    });
                                                })()
                                            }
                                            </tbody>
                                        </Table>
                                    );
                                }
                            })()
                        }
                    </Col>
                </Row>
            </Container>
        );
    }
}