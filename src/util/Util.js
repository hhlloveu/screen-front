import $ from "jquery";

export function ajax(opt) {
    const option = $.extend({
        type: "post",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true
    }, opt);
    if ($.isPlainObject(opt.data)) {
        option.data = JSON.stringify(opt.data);
    }
    $.ajax(option);
}

export function printObject (a, nm, subIdx) {
    let ret = true;
    subIdx = subIdx || 0;
    let subStr = "";
    let space = "";
    for (var k = 0; k < subIdx; k++) {
        space += "    ";
    }
    if (nm) subStr = subStr + space + nm + ": ";
    if (a == null && a == undefined) {
        subStr += "null,\n";
        ret = false;
    }
    if (ret) {
        if ($.isArray(a)) {
            subStr += "[\n";
            a.forEach(function (x, i){
                subStr += printObject(x, null, subIdx + 1) + "";
            });
            subStr += space + "],\n";
        } else if ($.isFunction(a)) {
            subStr += "[Function],\n";
        } else if ($.isPlainObject(a)) {
            subStr += space + "{\n";
            for (let o in a) {
                if (a.hasOwnProperty(o)) {
                    subStr += printObject(a[o], o, subIdx + 1);
                }
            }
            subStr += space + "},\n";
        } else {
            subStr += a + ",\n";
        }
    }
    return subStr;
}

export const COLORS = {
    primary: "primary",
    secondary: "secondary",
    success: "success",
    danger: "danger",
    warning: "warning",
    info: "info",
    light: "light",
    dark: "primary",
    all: ["primary", "secondary", "success", "danger", "warning", "info", "light", "dark"]
};

export const submitForm = (action, method, data) => {
    const form = $("<form>");
    if ($.isPlainObject(data)) {
        $.each(data, key => {
            if (data.hasOwnProperty(key)) {
                const input = $("<input>");
                input.val(data[key]);
                input.attr("name", key);
                input.attr("type", 'hidden');
                form.append(input);
            }
        });
    }
    form.attr("action", action);
    form.attr("method", method || "get");
    form.attr("target", '_blank');
    $("body").append(form);
    form.submit();
    setTimeout(() => {
        form.remove();
    }, 100);
};