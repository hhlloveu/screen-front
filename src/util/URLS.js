import $ from "jquery";

const urls = {
    LOGIN: "/login",
    LOGOUT: "/logout",
    SCHEDULE_ON: "/schedule/on",
    SCHEDULE_OFF: "/schedule/off",
    STATE_ON_OFF: "/schedule/onoff",
    CONFIG_LIST: "/config/list",
    CONFIG_SAVE: "/config/save",
    COMMAND_RUN: "/command/run",
    SQL_RUN: "/sql",
    TASK_LIST: "/task/list",
    TASK_LIST_FIX: "/task/list/fix",
    TASK_SAVE: "/task/save",
    TASK_DELETE: "/task/delete",
    TASK_UPLOAD: "/task/upload",
    TASK_UPLOAD_FIX: "/task/upload/fix",
    FILE_SYSTEM: "/fs/list",
    FILE_SYSTEM_DOWNLOAD: "/fs/download",
    FILE_SYSTEM_UPLOAD: "/fs/upload",
    FILE_SYSTEM_RENAME: "/fs/rename",
    FILE_SYSTEM_DELETE: "/fs/delete",
    FILE_SYSTEM_RECOVERY: "/fs/recovery",
    FILE_SYSTEM_CREATE: "/fs/create",
    /**
     * 外网地址是80端口
     */
    try: () => {
        const me = urls;
        const baseUrl = "http://" + window.location.hostname + ":80";
        $.each(me, (k, v) => {
            if (k != "try" && k != "retry") {
                me[k] = baseUrl + v;
            }
        });
        //console.table($.extend({}, me));
    },
    /**
     * 内网地址是9797端口
     */
    retry: () => {
        const me = urls;
        $.each(me, (k, v) => {
            if (k != "try" && k != "retry") {
                me[k] = v.replace(new RegExp(/(:)80/g), ":9797");
            }
        });
        //console.table($.extend({}, me));
    }
};

export const URLS = urls;
