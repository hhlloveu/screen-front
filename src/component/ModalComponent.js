import React from "react";
import {BaseComponent} from "./BaseComponent";

export class ModalComponent extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            modal: false
        };
    }

    toggle = () => {
        this.setSomeState({
            modal: !this.state.modal
        });
    };
}