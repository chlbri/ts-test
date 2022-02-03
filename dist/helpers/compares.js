"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.identityCompare = exports.dataCompare = void 0;
const core_1 = require("@core_chlbri/core");
const dequal_1 = require("dequal");
function _compareArray(arg1, arg2) {
    if ((0, core_1.isNullish)(arg2) || (0, core_1.isNullish)(arg1)) {
        return true;
    }
    if (arg2.length > arg1.length)
        return false;
    let out = true;
    for (let index = 0; index < arg2.length; index++) {
        const el1 = arg1[index];
        const el2 = arg2[index];
        out = _dataCompare(el1, el2);
        if (!out) {
            break;
        }
    }
    return out;
}
function _dataCompare(arg1, arg2) {
    if ((0, core_1.isNullish)(arg2))
        return true;
    if (typeof arg1 !== 'object' || typeof arg2 !== 'object') {
        return arg1 === arg2;
    }
    if ((0, core_1.isArray)(arg1) || (0, core_1.isArray)(arg2)) {
        return _compareArray(arg1, arg2);
    }
    const _arg2 = Object.entries({ ...arg2 })
        .filter(([, value]) => !(0, core_1.isNullish)(value))
        .reduce((prev, [key, value]) => {
        prev[key] = value;
        return prev;
    }, {});
    const keys2 = Object.keys(_arg2);
    if (!keys2.length) {
        return true;
    }
    const _arg1 = Object.entries({ ...arg1 })
        .filter(([key]) => {
        return keys2.includes(key);
    })
        .reduce((prev, [key, value]) => {
        prev[key] = value;
        return prev;
    }, {});
    return (0, dequal_1.dequal)(_arg1, _arg2);
}
function dataCompare(...[arg1, arg2]) {
    return _dataCompare(arg1, arg2);
}
exports.dataCompare = dataCompare;
function identityCompare(arg1, arg2) {
    return arg1 === arg2;
}
exports.identityCompare = identityCompare;
