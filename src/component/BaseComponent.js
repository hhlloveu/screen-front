import React from "react";
import $ from "jquery"

export class BaseComponent extends React.Component {
    subFix = {
        header: "header"
    };

    constructor(props) {
        super(props);
    }

    alert = (color, msg, onOff) => {
        if (this.props.alert) {
            this.props.alert(color, msg, onOff);
        }
    };

    setSelf = (key) => {
        if (this.props.setSelf) {
            this.props.setSelf(key, this);
        }
    };

    setSomeState = (obj) => {
        const s = $.extend({}, this.state, obj);
        this.setState(s);
    };

    afterAction = () => {
        if (this.props.afterAction) {
            this.props.afterAction();
        }
    };

    action = () => {};

    init = () => {};

    componentDidMount() {
        this.init();
    }
}