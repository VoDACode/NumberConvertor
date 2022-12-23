import BigNumber from 'bignumber.js';

let data = {
    n: "0",
    d: 2,
    inputD: 10,
    count: 8,
    debug: false,
    info: "",
    rs: 8
};
//load the data
(() => {
    let _data = {
        "-n": "0",
        "-d": "2",
        "-input-d": "10",
        "-c": '8',
        "-debug": '0',
        "-info": '',
        "-rs": '8'
    };

    for (let i = 0; i < process.argv.length; i++) {
        for (const key in _data) {
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

if(data.info.length > 0){
    let num = Number(data.info);
    num = num | 0;
    let res = "";
    let d2 = translateNumber(Math.abs(num).toString(), 2, 10);
    while(res.length + d2.length < data.rs){
        res += "0";
    }
    res += d2;
    console.log(`Direct code: ${num >= 0 ? 0 : 1}.${res}`);
    if(num >= 0){
        console.log(`Additional code: 0.${res}`);
        console.log(`Return code: 0.${res}`);
    }else{
        let tmp = "";
        for(let i = 0; i < res.length; i++){
            tmp += res[i] == '0' ? '1' : '0';
        }
        console.log(`Additional code: 1.${plassOneLaftBit(tmp)}`);
        console.log(`Return code: 1.${tmp}`);
    }
    process.exit(0);
}

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
    let dNumber: BigNumber = new BigNumber(0);
    let debug = "[TO 10 (F)]\n";
    if (from != 10) {
        for (let i = 0; i < n.length; i++) {
            if(data.debug){
                debug += `${!!Number(n[i]) || n[i] == '0' ? Number(n[i]) : n.charCodeAt(i) - 55} * (${from}^-${i + 1}) + `;
            }
            dNumber = dNumber.plus(new BigNumber((!!Number(n[i]) || n[i] == '0' ? Number(n[i]) : n.charCodeAt(i) - 55) * (from ** -(i + 1))));
        }
        if(data.debug){
            debug += `= ${dNumber}\n\n`;
        }
    } else {
        dNumber = new BigNumber("0." + n);
    }
    let result: string[] = [];
    for (let i = 0; i < data.count; i++) {
        let tmp = dNumber.multipliedBy(to);
        let decimal = tmp.decimalPlaces(0, 1);
        if (data.debug) {
            console.log(`${dNumber.toString()} * ${to} = ${tmp.toString()} (${decimal.isLessThan(10) ? decimal.toString() : String.fromCharCode(decimal.plus(55).toNumber()).toUpperCase()})`)
        }
        result.push(translateNumber(decimal.toString(), to, 10));
        dNumber = tmp.minus(decimal);
        if (dNumber.isEqualTo(0))
            break;
    }
    if(data.debug){
        console.log(debug);
    }
    return result.join('');
}

function translateNumber(n: string, to: number, from: number = 10): string {
    let dNum = 0;
    let debug = "[TO 10 (N)]\n";
    if (from != 10) {
        let tmp = 0;
        for (let i = 0; i < n.length; i++) {
            if(data.debug){
                debug += `${!!Number(n[i]) || n[i] == '0' ? Number(n[i]) : n.charCodeAt(i) - 55} * (${from}^${n.length - i - 1}) + `;
            }
            tmp += (!!Number(n[i]) || n[i] == '0' ? Number(n[i]) : n.charCodeAt(i) - 55) * (from ** (n.length - i - 1));
        }
        if(data.debug){
            debug += `= ${tmp}\n\n`;
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
        let c = mod < 10 ? mod.toString() : String.fromCharCode(mod + 55);
        store.push(c);
        let tmp = dNum;
        dNum = dNum / to | 0;
        if(data.debug){
            debug += `${tmp} / ${to} = ${dNum} (${dNum * to}) [${c}]\n`;
        }
    }
    store.push(dNum < 10 ? dNum.toString() : String.fromCharCode(dNum + 55));
    if(data.debug){
        debug += `[${dNum}]\n`
        console.log(debug);
    }
    return store.reverse().join('');
}

function plassOneLaftBit(n: string): string {
    let arr = n.split('');
    let k = 1;
    for (let i = arr.length - 1; i >= 0; i--) {
        let num = Number(arr[i]) + k;
        if(num > 1){
            arr[i] = '0';
            k = 1;
        }else{
            arr[i] = num.toString();
            k = 0;
        }
    }
    return arr.join('');
}