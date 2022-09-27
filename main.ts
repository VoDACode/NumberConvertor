import BigNumber from 'bignumber.js';

let data = {
    n: "0",
    d: 2,
    inputD: 10,
    count: 8
};
//load the data
(() => {
    let _data = {
        "-n": "0",
        "-d": "2",
        "-input-d": "10",
        "-c": '8'
    };

    for (let i = 0; i < process.argv.length; i++) {
        for (const key in _data) {
            if ((key == "-n" || key == "-d" || key == "-input-d" || key == "-c") && key == process.argv[i]) {
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
})();

let a = "";
let b = "";
(() => {
    let tmp = data.n.split('.');
    a = tmp[0];
    b = tmp.length == 2 ? tmp[1] : "0";
})();
a = translateNumber(a, data.d, data.inputD);
b = translateFractional(b, data.d, data.inputD);

console.log(`RESULT: ${a}.${b}`);

function translateFractional(n: string, to: number, from: number = 10): string {
    let dNumber:BigNumber = new BigNumber(0);
    if (from != 10) {
        for(let i = 0; i < n.length; i++) {
            dNumber = dNumber.plus(new BigNumber((!!Number(n[i]) || n[i] == '0' ? Number(n[i]) : n.charCodeAt(i) - 55) * (from ** -(i + 1))));
        }
    } else {
        dNumber = new BigNumber("0."+n);
    }
    let result: string[] = [];
    for (let i = 0; i < data.count; i++) {
        let tmp = dNumber.multipliedBy(to);
        result.push(translateNumber(tmp.decimalPlaces(0, 1).toString(), to, 10));
        dNumber = tmp.minus(tmp.decimalPlaces(0, 1));
        if (dNumber.isEqualTo(0))
            break;
    }
    return result.join('');
}

function translateNumber(n: string, to: number, from: number = 10): string {
    let dNum = 0;
    if (from != 10) {
        let tmp = 0;
        for (let i = 0; i < n.length; i++) {
            tmp += (!!Number(n[i]) || n[i] == '0' ? Number(n[i]) : n.charCodeAt(i) - 55) * (from ** (n.length - i - 1));
        }
        dNum = tmp;
    }
    else {
        dNum = Number(n);
    }
    let store: string[] = [];
    while (dNum >= to) {
        let mod = dNum % to;
        while (mod >= to) {
            mod -= to;
        }
        store.push(mod < 10 ? mod.toString() : String.fromCharCode(mod + 55));
        dNum = dNum / to | 0;
    }
    store.push(dNum < 10 ? dNum.toString() : String.fromCharCode(dNum + 55));
    return store.reverse().join('');
}