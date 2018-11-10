import React from "react";
import {BaseComponent} from "./BaseComponent";
import {ajax, COLORS} from "../util/Util";
import {URLS} from "../util/URLS";
import $ from "jquery";
import {Button, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Table} from "reactstrap";
import {ModalComponent} from "./ModalComponent";

export class BreakTask extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            list: null
        };
    }

    getList = () => {
        ajax({
            optionName: "获取插播任务列表",
            url: URLS.TASK_LIST,
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
            <div>
                <Table dark striped>
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>名称</th>
                        <th>播放类型</th>
                        <th>播放日期</th>
                        <th>播放时间点</th>
                        <th>播放时长</th>
                        <th>播放顺序</th>
                        <th>
                            <TaskModal data={{}} alert={this.alert} afterAction={this.getList}/>
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        (() => {
                            const getListFunc = this.getList;
                            const alertFunc = this.alert;
                            if ($.isArray(this.state.list)) {
                                return this.state.list.map(function (item, idx) {
                                    const typeName = {
                                        url: "网址",
                                        img: "图片",
                                        video: "视频"
                                    };
                                    return (
                                        <tr key={item.id}>
                                            <th scope="row">{item.id}</th>
                                            <td>{item.name}</td>
                                            <td>{typeName[item.type]}</td>
                                            <td>{item.act}</td>
                                            <td>{item.start}</td>
                                            <td>{item.cost}</td>
                                            <td>{item.seq}</td>
                                            <td>
                                                <TaskModal data={item} alert={alertFunc} afterAction={getListFunc}/>
                                            </td>
                                        </tr>
                                    );
                                });
                            }
                        })()
                    }
                    </tbody>
                </Table>
            </div>
        );
    }
}

class TaskModal extends ModalComponent {
    action = () => {
        const taskId = this.props.data.id;
        let task = {
            name: null,
            type: null,
            target: null,
            act: null,
            start: null,
            cost: null,
            seq: null
        };
        for(let o in task) {
            if (task.hasOwnProperty(o)) {
                task[o] = $("#taskForm" + taskId + " [name='" + o + "']").val();
            }
        }
        $.extend(task, {
            id: taskId || null,
            groups: "BREAK"
        });
        ajax({
            optionName: "保存插播任务",
            url: URLS.TASK_SAVE,
            data: task,
            success: (ret) => {
                if (ret == 1) {
                    this.alert(COLORS.success, "保存成功");
                    this.toggle();
                    this.afterAction();
                } else {
                    this.alert(COLORS.danger, "保存失败");
                }
            }
        });
    };

    uploadBreak = () => {
        const taskId = this.props.data.id;
        const file = $("#taskForm" + taskId + " input[type='file']");
        if (file.val() && file.val() != "") {
            const formData = new FormData();
            formData.append('file', file[0].files[0]);
            ajax({
                optionName: "上传播放文件",
                url: URLS.TASK_UPLOAD,
                cache: false,
                data: formData,
                processData: false,
                contentType: false,
                dataType: "text",
                success: (data) => {
                    $("#taskForm" + taskId + " input[name='target']").val(data);
                }
            });
        }
    };

    render() {
        const getBtn = () => {
            if (this.props.data.id) {
                return <Button color={COLORS.info} size="sm" onClick={this.toggle}>编辑</Button>;
            } else {
                return <Button color={COLORS.primary} size="sm" onClick={this.toggle}>新增</Button>;
            }
        };
        return (
            <div>
                {getBtn()}
                <Modal isOpen={this.state.modal} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>插播任务</ModalHeader>
                    <ModalBody>
                        <Form id={"taskForm" + this.props.data.id}>
                            <FormGroup>
                                <Label for="name">任务名称</Label>
                                <Input type="text" name="name" id="name" placeholder="任务名称"
                                       defaultValue={this.props.data.name} onChange={() => {
                                }}/>
                            </FormGroup>
                            <FormGroup>
                                <Label for="type">播放类型</Label>
                                <Input type="select" name="type" id="type" placeholder="播放类型"
                                       defaultValue={this.props.data.type} onChange={() => {
                                }}>
                                    <option value="url">网址</option>
                                    <option value="img">图片</option>
                                    <option value="video">视频</option>
                                </Input>
                            </FormGroup>
                            <FormGroup>
                                <Label for="target">播放目标</Label>
                                <Input type="text" name="target" id="target" placeholder="播放目标"
                                       defaultValue={this.props.data.target} onChange={() => {
                                }}/>
                            </FormGroup>
                            <FormGroup>
                                <Label for="file">上传播放文件</Label>
                                <Input type="file" name="file" id="file" onChange={this.uploadBreak}/>
                            </FormGroup>
                            <FormGroup>
                                <Label for="act">播放日期</Label>
                                <Input type="text" name="act" id="act" placeholder="播放日起，格式：2018-09-28"
                                       defaultValue={this.props.data.act} onChange={() => {
                                }}/>
                            </FormGroup>
                            <FormGroup>
                                <Label for="start">播放时间点</Label>
                                <Input type="text" name="start" id="start" placeholder="播放时间点，如上午9点52分1秒，格式：09:52:01"
                                       defaultValue={this.props.data.start} onChange={() => {
                                }}/>
                            </FormGroup>
                            <FormGroup>
                                <Label for="cost">播放时长</Label>
                                <Input type="text" name="cost" id="cost" placeholder="播放时长"
                                       defaultValue={this.props.data.cost} onChange={() => {
                                }}/>
                            </FormGroup>
                            <FormGroup>
                                <Label for="seq">播放顺序</Label>
                                <Input type="text" name="seq" id="seq" placeholder="播放顺序"
                                       defaultValue={this.props.data.seq} onChange={() => {
                                }}/>
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