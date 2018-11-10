import React from "react";
import {BaseComponent} from "./BaseComponent";
import {ajax, COLORS, submitForm} from "../util/Util";
import {URLS} from "../util/URLS";
import $ from "jquery";
import {
    Breadcrumb,
    BreadcrumbItem, Button,
    Form,
    FormGroup,
    Input,
    Label,
    Modal,
    ModalBody, ModalFooter,
    ModalHeader,
    Table
} from "reactstrap";
import {ModalComponent} from "./ModalComponent";

export class FileSystem extends BaseComponent {
    root = {
        name: "我的电脑",
        path: ""
    };
    fileInfo = null;

    constructor(props) {
        super(props);
        this.state = {
            breadcrumb: [this.root],
            list: null
        };
    }

    getList = () => {
        const fileInfo = this.fileInfo || this.root;
        const breadcrumb = this.fileInfo ? [].concat(this.root, this.fileInfo.parents ? this.fileInfo.parents : [], this.fileInfo) : [this.root];
        ajax({
            optionName: "获取文件系统",
            url: URLS.FILE_SYSTEM,
            data: {
                path: fileInfo.path
            },
            success: (data) => {
                if ($.isArray(data)) {
                    data = data.sort((a, b) => {
                        if (a.directory && a.name == "screen_trash") {
                            return 0;
                        }
                        if (b.directory && b.name == "screen_trash") {
                            return 1;
                        }
                        if (a.directory) {
                            return 0;
                        } else if (!b.directory) {
                            return 0;
                        } else if (b.directory) {
                            return 1;
                        }
                    });
                    this.setSomeState({
                        breadcrumb: breadcrumb,
                        list: data
                    });
                } else {
                    this.setSomeState({
                        breadcrumb: breadcrumb,
                        list: []
                    });
                }
            }
        });
    };

    init = () => {
        this.getList();
    };

    setFileInfo = (fileInfo) => {
        if (fileInfo && fileInfo.path == "") {
            this.fileInfo = null;
        } else {
            if (fileInfo.parent && !fileInfo.parents) {
                fileInfo.parents = [].concat(this.fileInfo.parents);
                fileInfo.parents.pop();
            }
            this.fileInfo = fileInfo;
        }
        this.getList();
    };

    doDownLoad = (fileInfo) => {
        submitForm(URLS.FILE_SYSTEM_DOWNLOAD, "post", {path: fileInfo.path});
    };

    render() {
        return (
            <div>
                <Breadcrumb>
                    {
                        (() => {
                            const setFileInfoFunc = this.setFileInfo;
                            return this.state.breadcrumb.map((item, idx) => {
                                if (idx != this.state.breadcrumb.length - 1) {
                                    return (
                                        <BreadcrumbItem key={"breadcrumb" + idx}>
                                            <a href="#" onClick={() => {
                                                setFileInfoFunc(item)
                                            }}>{item.name == "screen_trash" ? "回收站" : item.name}</a>
                                        </BreadcrumbItem>
                                    );
                                } else {
                                    return (
                                        <BreadcrumbItem active key={"breadcrumb" + idx}>
                                            {item.name == "screen_trash" ? "回收站" : item.name}
                                        </BreadcrumbItem>
                                    );
                                }
                            });
                        })()
                    }
                </Breadcrumb>
                {
                    (() => {
                        if (this.fileInfo) {
                            return (
                                <div>
                                    <a className="btn btn-small" href="#" title="刷新" onClick={this.getList}><i
                                        className="icon-repeat"></i></a>
                                    {
                                        (() => {
                                            if (this.fileInfo.name != "screen_trash") {
                                                if (this.fileInfo.parents && !this.fileInfo.parents.some(fInfo => fInfo.name == "screen_trash") || !this.fileInfo.parents) {
                                                    return (
                                                        <span>
                                                            <CreateModal alert={this.alert} afterAction={this.getList}
                                                                         path={this.fileInfo.path}/>
                                                            <UploadModal alert={this.alert} afterAction={this.getList}
                                                                         path={this.fileInfo.path}/>
                                                        </span>
                                                    );
                                                }
                                            }
                                        })()
                                    }
                                </div>
                            );
                        }
                    })()
                }
                <Table dark striped>
                    <tbody>
                    {
                        (() => {
                            const alertFunc = this.alert;
                            const getListFunc = this.getList;
                            const setFileInfoFunc = this.setFileInfo;
                            const downloadFunc = this.doDownLoad;
                            const fi = this.fileInfo;
                            if ($.isArray(this.state.list)) {
                                return this.state.list.map(function (item, idx) {
                                    return (
                                        <tr key={"item" + idx}>
                                            <th scope="row">
                                                {
                                                    (() => {
                                                        if (item.directory) {
                                                            if (item.name == "screen_trash") {
                                                                return (
                                                                    <span style={{cursor: "pointer"}} onClick={() => {
                                                                        setFileInfoFunc(item);
                                                                    }}>
                                                                    <i className="icon-trash"></i>
                                                                        {"    "}回收站
                                                                </span>
                                                                );
                                                            }
                                                            return (
                                                                <span style={{cursor: "pointer"}} onClick={() => {
                                                                    setFileInfoFunc(item);
                                                                }}>
                                                                    <i className="icon-folder-close-alt"></i>
                                                                    {"    "}{item.name}
                                                                </span>
                                                            );
                                                        } else {
                                                            return (
                                                                <span style={{
                                                                    cursor: "pointer",
                                                                    color: "#DFF1FD",
                                                                    fontWeight: "normal"
                                                                }} onClick={() => {
                                                                    downloadFunc(item)
                                                                }}>
                                                                    <i className="icon-file-alt"></i>
                                                                    {"    "}{item.name}
                                                                </span>
                                                            );
                                                        }
                                                    })()
                                                }
                                            </th>
                                            <td>{item.file ? item.length : ""}</td>
                                            <td>
                                                {
                                                    (() => {
                                                        if (fi) {
                                                            if (fi.name == "screen_trash") {
                                                                return (
                                                                    <RecoveryModal alert={alertFunc}
                                                                                   afterAction={getListFunc}
                                                                                   path={item.path}
                                                                                   parent={fi.parent}/>
                                                                );
                                                            }
                                                            if (item.name != "screen_trash") {
                                                                if (item.parents && !item.parents.some(fInfo => fInfo.name == "screen_trash") || !item.parents) {
                                                                    return (
                                                                        <div>
                                                                            <RenameModal alert={alertFunc}
                                                                                         afterAction={getListFunc}
                                                                                         path={item.path}/>
                                                                            <DeleteModal alert={alertFunc}
                                                                                         afterAction={getListFunc}
                                                                                         path={item.path}/>
                                                                        </div>
                                                                    );
                                                                }
                                                            }
                                                        }
                                                    })()
                                                }
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

class CreateModal extends ModalComponent {
    action = () => {
        const nm = $("#createForm input[name='name']").val();
        if (nm && nm != "" || nm == 0) {
            ajax({
                optionName: "创建文件夹",
                url: URLS.FILE_SYSTEM_CREATE,
                data: {
                    path: this.props.path,
                    name: nm
                },
                success: (data) => {
                    if (data == 1) {
                        this.afterAction();
                        this.toggle();
                    } else {
                        this.alert(COLORS.danger, "创建文件夹失败");
                    }
                }
            });
        }
    };

    render() {
        return (
            <span>
                <a className="btn btn-small" href="#" title="创建文件夹" onClick={this.toggle}><i
                    className="icon-folder-close-alt"></i></a>
                <Modal isOpen={this.state.modal} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>创建文件夹</ModalHeader>
                    <ModalBody>
                        <Form id="createForm">
                            <FormGroup>
                                <Label for="name">文件夹名称</Label>
                                <Input type="text" name="name" id="name" defaultValue="新建文件夹"/>
                            </FormGroup>
                        </Form>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.action}>创建</Button>{' '}
                        <Button color="secondary" onClick={this.toggle}>取消</Button>
                    </ModalFooter>
                </Modal>
            </span>
        );
    }
}

class UploadModal extends ModalComponent {
    action = () => {
        const file = $("#fileUploadForm input[type='file']");
        if (file.val() && file.val() != "") {
            const formData = new FormData();
            formData.append('path', this.props.path);
            formData.append('file', file[0].files[0]);
            ajax({
                optionName: "上传文件",
                url: URLS.FILE_SYSTEM_UPLOAD,
                cache: false,
                data: formData,
                processData: false,
                contentType: false,
                dataType: "json",
                success: (data) => {
                    if (data == 1) {
                        this.afterAction();
                        this.toggle();
                    } else {
                        this.alert(COLORS.danger, "上传失败");
                    }
                }
            });
        }
    };

    render() {
        return (
            <span>
                <a className="btn btn-small" href="#" title="上传文件" onClick={this.toggle}><i
                    className="icon-cloud-upload"></i></a>
                <Modal isOpen={this.state.modal} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>上传文件</ModalHeader>
                    <ModalBody>
                        <Form id="fileUploadForm">
                            <FormGroup>
                                <Label for="file">目标：{this.props.path}</Label>
                                <Input type="file" name="file" id="file"/>
                            </FormGroup>
                        </Form>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.action}>上传</Button>{' '}
                        <Button color="secondary" onClick={this.toggle}>取消</Button>
                    </ModalFooter>
                </Modal>
            </span>
        );
    }
}

class RenameModal extends ModalComponent {
    action = () => {
        const nm = $("#renameForm input[name='name']").val();
        if (nm && nm != "" || nm == 0) {
            ajax({
                optionName: "重命名",
                url: URLS.FILE_SYSTEM_RENAME,
                data: {
                    path: this.props.path,
                    name: nm
                },
                success: (data) => {
                    if (data == 1) {
                        this.afterAction();
                        this.toggle();
                    } else {
                        this.alert(COLORS.danger, "重命名失败");
                    }
                }
            });
        }
    };

    render() {
        return (
            <span>
                <a className="btn btn-small" href="#" title="重命名" onClick={this.toggle}><i className="icon-edit"></i></a>
                <Modal isOpen={this.state.modal} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>重命名</ModalHeader>
                    <ModalBody>
                        <Form id="renameForm">
                            <FormGroup>
                                <Label for="name">目标：{this.props.path}</Label>
                                <Input type="text" name="name" id="name"
                                       defaultValue={this.props.path.split("/").pop()}/>
                            </FormGroup>
                        </Form>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.action}>重命名</Button>{' '}
                        <Button color="secondary" onClick={this.toggle}>取消</Button>
                    </ModalFooter>
                </Modal>
            </span>
        );
    }
}

class DeleteModal extends ModalComponent {
    action = () => {
        ajax({
            optionName: "删除",
            url: URLS.FILE_SYSTEM_DELETE,
            data: {
                path: this.props.path
            },
            success: (data) => {
                if (data == 1) {
                    this.afterAction();
                    this.toggle();
                } else {
                    this.alert(COLORS.danger, "删除失败");
                }
            }
        });
    };

    render() {
        return (
            <span>
                <a className="btn btn-small" href="#" title="删除" onClick={this.toggle}><i
                    className="icon-trash"></i></a>
                <Modal isOpen={this.state.modal} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>删除</ModalHeader>
                    <ModalBody>
                        确定删除目标：{this.props.path}吗?
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.action}>确定</Button>{' '}
                        <Button color="secondary" onClick={this.toggle}>取消</Button>
                    </ModalFooter>
                </Modal>
            </span>
        );
    }
}

class RecoveryModal extends ModalComponent {
    action = () => {
        ajax({
            optionName: "还原",
            url: URLS.FILE_SYSTEM_RECOVERY,
            data: {
                path: this.props.path
            },
            success: (data) => {
                if (data == 1) {
                    this.afterAction();
                    this.toggle();
                } else {
                    this.alert(COLORS.danger, "还原失败");
                }
            }
        });
    };

    render() {
        return (
            <span>
                <a className="btn btn-small" href="#" title="还原" onClick={this.toggle}><i
                    className="icon-reply"></i></a>
                <Modal isOpen={this.state.modal} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>还原</ModalHeader>
                    <ModalBody>
                        确定还原到：{this.props.parent}吗?
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.action}>确定</Button>{' '}
                        <Button color="secondary" onClick={this.toggle}>取消</Button>
                    </ModalFooter>
                </Modal>
            </span>
        );
    }
}