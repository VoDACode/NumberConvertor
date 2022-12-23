"use strict";
exports.__esModule = true;
var bignumber_js_1 = require("bignumber.js");
var data = {
    n: "0",
    d: 2,
    inputD: 10,
    count: 8,
    debug: false,
    info: "",
    rs: 8
};
//load the data
(function () {
    var _data = {
        "-n": "0",
        "-d": "2",
        "-input-d": "10",
        "-c": '8',
        "-debug": '0',
        "-info": '',
        "-rs": '8'
    };
    for (var i = 0; i < process.argv.length; i++) {
        for (var key in _data) {
            if ((key == "-n" || key == "-d" || key == "-input-d" || key == "-c" || key == "-debug" || key == "-info" || key == '-rs') && key == process.argv[i]) {
                if (!process.argv[i + 1]) {
                    throw new Error("Invalid value");
                }
                _data[key] = process.argv[i + 1];
            }
        }
    }
    data.count = Number(_data["-c"]);
    data.d = Number(_data["-d"]);
    data.inputD = Number(_data["-input-d"]);
    data.n = _data["-n"];
    data.info = _data["-info"];
    data.rs = Number(_data["-rs"]);
    data.debug = _data["-debug"] == '1' || _data["-debug"] == 'true';
})();
if (data.info.length > 0) {
    var num = Number(data.info);
    num = num | 0;
    var res = "";
    var d2 = translateNumber(Math.abs(num).toString(), 2, 10);
    while (res.length + d2.length < data.rs) {
        res += "0";
    }
    res += d2;
    console.log("Direct code: ".concat(num >= 0 ? 0 : 1, ".").concat(res));
    if (num >= 0) {
        console.log("Additional code: 0.".concat(res));
        console.log("Return code: 0.".concat(res));
    }
    else {
        var tmp = "";
        for (var i = 0; i < res.length; i++) {
            tmp += res[i] == '0' ? '1' : '0';
        }
        console.log("Additional code: 1.".concat(plassOneLaftBit(tmp)));
        console.log("Return code: 1.".concat(tmp));
    }
    process.exit(0);
}
var a = "";
var b = "";
(function () {
    var tmp = data.n.split('.');
    a = tmp[0];
    b = tmp.length == 2 ? tmp[1] : "0";
})();
a = translateNumber(a, data.d, data.inputD);
b = translateFractional(b, data.d, data.inputD);
console.log("RESULT: " + a + "." + b);
function translateFractional(n, to, from) {
    if (from === void 0) { from = 10; }
    var dNumber = new bignumber_js_1["default"](0);
    var debug = "[TO 10 (F)]\n";
    if (from != 10) {
        for (var i = 0; i < n.length; i++) {
            if (data.debug) {
                debug += "".concat(!!Number(n[i]) || n[i] == '0' ? Number(n[i]) : n.charCodeAt(i) - 55, " * (").concat(from, "^-").concat(i + 1, ") + ");
            }
            dNumber = dNumber.plus(new bignumber_js_1["default"]((!!Number(n[i]) || n[i] == '0' ? Number(n[i]) : n.charCodeAt(i) - 55) * (Math.pow(from, -(i + 1)))));
        }
        if (data.debug) {
            debug += "= ".concat(dNumber, "\n\n");
        }
    }
    else {
        dNumber = new bignumber_js_1["default"]("0." + n);
    }
    var result = [];
    for (var i = 0; i < data.count; i++) {
        var tmp = dNumber.multipliedBy(to);
        var decimal = tmp.decimalPlaces(0, 1);
        if (data.debug) {
            console.log("".concat(dNumber.toString(), " * ").concat(to, " = ").concat(tmp.toString(), " (").concat(decimal.isLessThan(10) ? decimal.toString() : String.fromCharCode(decimal.plus(55).toNumber()).toUpperCase(), ")"));
        }
        result.push(translateNumber(decimal.toString(), to, 10));
        dNumber = tmp.minus(decimal);
        if (dNumber.isEqualTo(0))
            break;
    }
    if (data.debug) {
        console.log(debug);
    }
    return result.join('');
}
function translateNumber(n, to, from) {
    if (from === void 0) { from = 10; }
    var dNum = 0;
    var debug = "[TO 10 (N)]\n";
    if (from != 10) {
        var tmp = 0;
        for (var i = 0; i < n.length; i++) {
            if (data.debug) {
                debug += "".concat(!!Number(n[i]) || n[i] == '0' ? Number(n[i]) : n.charCodeAt(i) - 55, " * (").concat(from, "^").concat(n.length - i - 1, ") + ");
            }
            tmp += (!!Number(n[i]) || n[i] == '0' ? Number(n[i]) : n.charCodeAt(i) - 55) * (Math.pow(from, (n.length - i - 1)));
        }
        if (data.debug) {
            debug += "= ".concat(tmp, "\n\n");
        }
        dNum = tmp;
    }
    else {
        dNum = Number(n);
    }
    var store = [];
    while (dNum >= to) {
        var mod = dNum % to;
        while (mod >= to) {
            mod -= to;
        }
        var c = mod < 10 ? mod.toString() : String.fromCharCode(mod + 55);
        store.push(c);
        var tmp = dNum;
        dNum = dNum / to | 0;
        if (data.debug) {
            debug += "".concat(tmp, " / ").concat(to, " = ").concat(dNum, " (").concat(dNum * to, ") [").concat(c, "]\n");
        }
    }
    store.push(dNum < 10 ? dNum.toString() : String.fromCharCode(dNum + 55));
    if (data.debug) {
        debug += "[".concat(dNum, "]\n");
        console.log(debug);
    }
    return store.reverse().join('');
}
function plassOneLaftBit(n) {
    var arr = n.split('');
    var k = 1;
    for (var i = arr.length - 1; i >= 0; i--) {
        var num = Number(arr[i]) + k;
        if (num > 1) {
            arr[i] = '0';
            k = 1;
        }
        else {
            arr[i] = num.toString();
            k = 0;
        }
    }
    return arr.join('');
}
