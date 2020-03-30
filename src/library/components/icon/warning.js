import warning from "rc-util/es/warning";
export default (function (valid, component, message) {
    warning(valid, "[antd-compatible: ".concat(component, "] ").concat(message));
});
