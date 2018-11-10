import React from "react";
import {BaseComponent} from "./BaseComponent";
import {Button, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Table} from "reactstrap";
import $ from "jquery";
import {ajax, COLORS} from "../util/Util";
import {URLS} from "../util/URLS";
import {ModalComponent} from "./ModalComponent";

export class Config extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            list: null
        };
    }

    getList = () => {
        ajax({
            optionName: "获取配置列表",
            url: URLS.CONFIG_LIST,
            success: (data) => {
                if ($.isArray(data)) {
                    this.setSomeState({list: data});
                } else {
                    this.setSomeState({list: []});
                }
            }
        });
    };

    init = () => {
        this.getList();
    };

    render() {
        return (
            <Table dark striped>
                <thead>
                <tr>
                    <th>#</th>
                    <th>配置项</th>
                    <th>编码</th>
                    <th>配置值</th>
                    <th>操作</th>
                </tr>
                </thead>
                <tbody>
                {
                    (() => {
                        const getListFunc = this.getList;
                        const alertFunc = this.alert;
                        if ($.isArray(this.state.list)) {
                            return this.state.list.map(function (item) {
                                return (
                                    <tr key={item.id}>
                                        <th scope="row">{item.id}</th>
                                        <td>{item.name}</td>
                                        <td>{item.code}</td>
                                        <td>{item.value}</td>
                                        <td>
                                            <ConfigModal data={item} alert={alertFunc} afterAction={getListFunc}/>
                                        </td>
                                    </tr>
                                );
                            });
                        }
                    })()
                }
                </tbody>
            </Table>
        );
    }
}

class ConfigModal extends ModalComponent {
    action = () => {
        const value = $("#value").val();
        if (value || value == 0) {
            ajax({
                optionName: "保存配置",
                url: URLS.CONFIG_SAVE,
                data: {
                    id: this.props.data.id,
                    value: value
                },
                success: (ret) => {
                    if (ret == 1) {
                        this.toggle();
                        this.afterAction();
                        this.alert(COLORS.success, "保存成功");
                    } else {
                        this.alert(COLORS.danger, "保存失败");
                    }
                }
            });
        } else {
            this.alert(COLORS.danger, "请输入配置值");
        }
    };

    render() {
        return (
            <div>
                <Button color={COLORS.info} size="sm" onClick={this.toggle}>编辑</Button>
                <Modal isOpen={this.state.modal} toggle={this.toggle} color={COLORS.dark}>
                    <ModalHeader toggle={this.toggle}>{this.props.data.name}</ModalHeader>
                    <ModalBody>
                        <Form>
                            <FormGroup>
                                <Label for="value">配置值</Label>
                                <Input type="text" name="value" id="value" placeholder="配置值" defaultValue={this.props.data.value} onChange={() => {}}/>
                            </FormGroup>
                        </Form>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.action}>保存</Button>{' '}
                        <Button color="secondary" onClick={this.toggle}>取消</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}