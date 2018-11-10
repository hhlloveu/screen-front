import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './font-awesome/css/font-awesome.min.css';
import {Header} from "./layout/Header";
import {Footer} from "./layout/Footer";
import {Main} from "./layout/Main";
import {ajax, COLORS} from "./util/Util";
import $ from "jquery";
import {Login} from "./layout/Login";
import {URLS} from "./util/URLS";

class App extends React.Component {
    sub = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            login: false
        };
    }

    setSub = (key, subObj) => {
        this.sub[key] = subObj;
    };

    alert = (color, msg) => {
        if (this.sub.header && this.sub.header.alert) {
            this.sub.header.alert(color, msg);
        }
    };

    login = (user) => {
        this.setState({
            login: true
        });
        if (this.sub.header && this.sub.header.setSomeState) {
            this.sub.header.setSomeState({
                login: true,
                user: user
            });
        }
        this.alert(COLORS.info, "欢迎，" + user);
    };

    logout = () => {
        this.setState({
            login: false
        });
    };

    initAjaxErrorHandler = () => {
        $(document).ajaxError((event, xhr, opt, err) => {
            let str = "";
            if (opt && opt.optionName) {
                str = opt.optionName + "：";
            }
            this.alert(COLORS.danger, str + "请求出现错误，可能登录超时");
        });
    };

    init = () => {
        ajax({
            optionName: "获取服务状态",
            url: URLS.LOGOUT,
            success: (data) => {
                this.initAjaxErrorHandler();
            },
            error: () => {
                URLS.try();
                ajax({
                    optionName: "获取服务状态",
                    url: URLS.LOGOUT,
                    success: (data) => {
                        this.initAjaxErrorHandler();
                    },
                    error: () => {
                        URLS.retry();
                        this.initAjaxErrorHandler();
                    }
                });
            }
        });
    };

    render() {
        return (
            <div className="App">
                <div className="App-main">
                    {
                        (() => {
                            if (this.state.login) {
                                return (
                                    <div>
                                        <Header logout={this.logout} setSelf={this.setSub}/>
                                        <Main alert={this.alert}/>
                                    </div>
                                );
                            } else {
                                return <Login alert={this.alert} login={this.login}/>;
                            }
                        })()
                    }
                </div>
                <div className="App-footer">
                    <Footer alert={this.alert}/>
                </div>
            </div>
        );
    }

    componentDidMount() {
        this.init();
    }
}

export default App;
