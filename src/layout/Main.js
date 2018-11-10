import React from 'react';
import {Nav, NavItem, NavLink, TabContent, TabPane} from "reactstrap";
import classnames from 'classnames';
import {BaseComponent} from "../component/BaseComponent";
import {Config} from "../component/Config";
import {Command} from "../component/Command";
import {FixTask} from "../component/FixTask";
import {BreakTask} from "../component/BreakTask";
import {FileSystem} from "../component/FileSystem";
import {Sql} from "../component/Sql";

export class Main extends BaseComponent {
    sub = {
        config: null,
        fixTask: null,
        breakTask: null,
        fixVideo: null,
        sql: null,
        cmd: null
    };

    constructor(props) {
        super(props);
        this.state = {
            activeTab: '1'
        };
        this.setSelf(this.subFix.main, this);
    }

    setSub = (key, subObj) => {
        this.sub[key] = subObj;
    };

    toggle = (tab) => {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    };

    render() {
        return (
            <div>
                <Nav tabs>
                    <NavItem>
                        <NavLink
                            className={classnames({ active: this.state.activeTab === '1' })}
                            onClick={() => { this.toggle('1'); }}
                        >
                            系统配置
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={classnames({ active: this.state.activeTab === '2' })}
                            onClick={() => { this.toggle('2'); }}
                        >
                            固播任务
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={classnames({ active: this.state.activeTab === '3' })}
                            onClick={() => { this.toggle('3'); }}
                        >
                            插播任务
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={classnames({ active: this.state.activeTab === '4' })}
                            onClick={() => { this.toggle('4'); }}
                        >
                            文件系统
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={classnames({ active: this.state.activeTab === '5' })}
                            onClick={() => { this.toggle('5'); }}
                        >
                            SQL
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={classnames({ active: this.state.activeTab === '6' })}
                            onClick={() => { this.toggle('6'); }}
                        >
                            命令行
                        </NavLink>
                    </NavItem>
                </Nav>
                <TabContent activeTab={this.state.activeTab}>
                    <TabPane tabId="1" className="Main-tab-pane">
                        {
                            (() =>{
                                if (this.state.activeTab == 1) {
                                    return <Config alert={this.alert}/>;
                                }
                            })()
                        }
                    </TabPane>
                    <TabPane tabId="2" className="Main-tab-pane">
                        {
                            (() =>{
                                if (this.state.activeTab == 2) {
                                    return <FixTask alert={this.alert}/>;
                                }
                            })()
                        }
                    </TabPane>
                    <TabPane tabId="3" className="Main-tab-pane">
                        {
                            (() =>{
                                if (this.state.activeTab == 3) {
                                    return <BreakTask alert={this.alert}/>;
                                }
                            })()
                        }
                    </TabPane>
                    <TabPane tabId="4" className="Main-tab-pane">
                        {
                            (() =>{
                                if (this.state.activeTab == 4) {
                                    return <FileSystem alert={this.alert}/>;
                                }
                            })()
                        }
                    </TabPane>
                    <TabPane tabId="5" className="Main-tab-pane">
                        {
                            (() =>{
                                if (this.state.activeTab == 5) {
                                    return <Sql alert={this.alert}/>;
                                }
                            })()
                        }
                    </TabPane>
                    <TabPane tabId="6" className="Main-tab-pane">
                        {
                            (() =>{
                                if (this.state.activeTab == 6) {
                                    return <Command alert={this.alert}/>;
                                }
                            })()
                        }
                    </TabPane>
                </TabContent>
            </div>
        );
    }
}