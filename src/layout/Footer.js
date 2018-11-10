import React from 'react';
import {BaseComponent} from "../component/BaseComponent";

export class Footer extends BaseComponent {
    constructor(props) {
        super(props);
        this.setSelf(this.subFix.footer, this);
    }

    render() {
        return (
            <div className="Footer">
                <h6>
                    &copy;我爱我家-技术中心 &nbsp;2000&nbsp;-&nbsp;{new Date().getFullYear()}
                </h6>
                <span className="Footer-right">huangheliang@5i5j.com</span>
            </div>
        );
    }
}