const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");
const boardWidth = canvas.width;
const boardHeight = canvas.height;

//////////////////////
//程序入口
////////////////////
function Start() {

}

//成行显示
function WriteTextsH(arr1, x, y, hei, scale) {
    let tbWid = 0;
    let x2 = x;
    let arr2 = [];
    for (let i = 0; i < arr1.length; ++i) {
        x2 = x2 + tbWid;
        let oTxt = WriteText(arr1[i], x2, y, hei, scale);
        //计算宽度
        tbWid = arr1[i].length * hei * 0.7;
        arr2.push(oTxt);
    }

    return arr2;
}

//绘制题目
function WriteText(str1, x, y, hei, scale) {
    scale = scale || 60;
    let fontHei = hei * scale + "px";
    ctx.font = "normal " + fontHei + " Arial";
    ctx.fillStyle = "#000000";
    ctx.fillText(str1, x * scale, y * scale);

    return { txt: str1, x: x, y: y, h: hei, s: scale };
}

const rowTotal = 6;
var rowHeight = 4.0;
//计算的范围
var hardMin, hardMin2, hardMax, hardMax2;
//公式的类型
var formulaMode1, formulaMode2;
var grade = 1;
var isOral = false;

function CreateA4(category) {
    var toastDlg = new Toast({
        text: "生成中"
    });
    toastDlg.Show();
    //ctx.clearRect(0,0,boardWidth,boardHeight);
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, boardWidth, boardHeight);
    formulaMode1 = 1;
    formulaMode2 = 2;
    //1.title
    WriteText("口 算（竖 式）", 7.6, 1.5, 1.0);
    //2.sub-title
    WriteTextsH(["班级________", "姓名________", "用时________", "得分________"], 2.5, 3.5, 0.5);
    //3.subjects
    if (category == 1) {
        //100以内
        [hardMin, hardMin2, hardMax, hardMax2] = [10, 10, 100, 100];
        //绘制公式的
        DrawFormula(Formula, rowTotal, true);
    } else if (category == 2) {
        //连加 连减
        formulaMode2 = 4;
        [hardMin, hardMin2, hardMax, hardMax2] = [10, 10, 100, 100];
        DrawFormula(TowFormula, rowTotal, true);
    } else if (category == 3) {
        //连加减乘除
        formulaMode2 = 4;
        [hardMin, hardMin2, hardMax, hardMax2] = [10, 10, 100, 100];
        DrawFormula(TowFormula2, rowTotal, false);
    } else if (category == 4) {
        //除法带余
        [hardMin, hardMin2, hardMax, hardMax2] = [2, 1, 9, 9];
        DrawFormula(FormulaDivide2, rowTotal, false);
    }else if(category == 5){
        grade  =3;
        //三年级(一位除数)
        [hardMin,hardMin2,hardMax,hardMax2] = [100,2,999,10];
        formulaMode1 = 4;
        formulaMode2 = 4;
        DrawFormula(FormulaDivid3, rowTotal, false);
    }else if(category == 6){
        grade =3;
        //三年级(乘法二位)
        [hardMin,hardMin2,hardMax,hardMax2] = [10,10,99,99];
        formulaMode1 = 3;
        formulaMode2 = 3;
        DrawFormula(Formula, rowTotal, false);
    }else if(category == 7){
        grade =3;
        //三年级(乘法二位)
        [hardMin,hardMin2,hardMax,hardMax2] = [10,10,99,50];
        formulaMode1 = 1;
        formulaMode2 = 4;
        rowHeight = 1.0;
        isOral = true;
        WriteText("一、口算题", 1.5, 4.8, 0.5);
        let rowY = DrawFormula(Formula, 5, false, 5.8);
        [hardMin,hardMin2,hardMax,hardMax2] = [20,10,99,99];
        isOral = false;
        WriteText("二、笔算", 1.5, rowY+1.2, 0.5);
        rowHeight = 4.0;
        formulaMode1 = 3;
        formulaMode2 = 4;
        rowY = DrawFormula(Formula, 2, false,rowY+2.2);
        rowY += rowHeight;
        WriteText("三、递等式", 1.5, rowY, 0.5);
        rowHeight = 4.0;
        formulaMode1 = 1;
        formulaMode2 = 4;
        rowY = DrawFormula(TowFormula2, 1, false,rowY+1.0);
    }

    //二维码
    DrawImage('./qr.png', () => {
        toastDlg.Close();
        ShowImageDlg();
    });
}

function DrawFormula(cb, num, bDrawV, startY) {
    startY = startY || 5.0;
    let rowY = startY;
    if (typeof cb == "function") {
        for (let i = 0; i < num; i++) {
            rowY = startY + i * rowHeight;
            let arr1 = WriteTextsH([cb(), cb(), cb(), cb()], 1.5, rowY, 0.5);
            //绘制竖式公式
            if (bDrawV) DrawFormulaVerticals(arr1);
        }
    }
    return rowY;
}

//公式生成器
function Formula() {
    let str1 = "";
    //做法 + - x /
    quest_mode1 = RandomInt(formulaMode1, formulaMode2);
    if (quest_mode1 == 1) {
        str1 = FormulaAdd();
    } else if (quest_mode1 == 2) {
        str1 = FormulaMinus();
    } else if (quest_mode1 == 3) {
        if (grade <= 2) {
            str1 = FormulaCross2();  //基本乘法表
        } else {
            str1 = FormulaCross();
        }
    } else if(quest_mode1 == 4){
        if(isOral){
            str1 = FormulaDivide();
        }else{
            str1 = FormulaDivide2();
        }
    }
    //空格补齐
    str1 = MergeBlank(str1,14);
    return str1;
}

//连加连减公式
function TowFormula() {
    let str1 = "";
    //做法 + - x /
    quest_mode1 = RandomInt(formulaMode1, formulaMode2);
    if (quest_mode1 == 1) {
        str1 = TwoFormulaAdd();
    } else if (quest_mode1 == 2) {
        str1 = TowFormulaMinus();
    } else if (quest_mode1 == 3) {
        str1 = TowFormulaAddMinus();
    } else if (quest_mode1 == 4) {
        str1 = TowFormulaMinusAdd();
    }
    //空格补齐
    str1 = MergeBlank(str1);
    return str1;
}

//连加减乘除
function TowFormula2() {
    let str1 = "";
    //做法 + - x /
    quest_mode1 = RandomInt(formulaMode1, formulaMode2);
    if (quest_mode1 == 1) {
        str1 = TowFormulaAddCross();
    } else if (quest_mode1 == 2) {
        str1 = TowFormulaMinusCross();
    } else if (quest_mode1 == 3) {
        str1 = TowFormulaAddDivide();
    } else if (quest_mode1 == 4) {
        str1 = TowFormulaMinusDivide();
    }
    //空格补齐
    str1 = MergeBlank(str1);
    return str1;
}

function Formula2() {
    let str1 = "";
    //做法 + - x /
    quest_mode1 = RandomInt(formulaMode1, formulaMode2);
    if (quest_mode1 == 1) {
        str1 = FormulaAdd2();
    } else if (quest_mode1 == 2) {
        str1 = FormulaMinus2();
    }
    //空格补齐
    str1 = MergeBlank(str1);
    return str1;
}

function Formula3() {
    let str1 = "";
    //做法 + - x /
    quest_mode1 = RandomInt(formulaMode1, formulaMode2);
    if (quest_mode1 == 1) {
        str1 = FormulaAdd3();
    } else if (quest_mode1 == 2) {
        str1 = FormulaMinus3();
    } else if (quest_mode1 == 3) {
        str1 = FormulaCross3();
    }
    //空格补齐
    str1 = MergeBlank(str1);
    return str1;
}


//加法
function FormulaAdd() {
    arg1 = RandomInt(hardMin, hardMax);
    arg2 = RandomInt(hardMin2, hardMax2);
    return arg1 + "  +  " + arg2 + " =";
}

//进位
function FormulaAdd2() {
    let str1 = "";
    for (let i = 0; i < 1000; i++) {
        arg1 = RandomInt(hardMin, hardMax);
        arg2 = RandomInt(hardMin2, hardMax2);
        str1 = arg1 + "  +  " + arg2 + " =";
        //判断是否满足进位条件
        let t1 = arg1 % 10;
        let t2 = arg1 % 10;
        if ((t1 + t2) >= 10) {
            break;
        }
    }

    return str1;
}

//空格
function FormulaAdd3() {
    arg1 = RandomInt(hardMin, hardMax);
    arg2 = RandomInt(hardMin2, hardMax2);
    let md = RandomInt(0, 1);
    let res = arg1 + arg2;
    if (md == 0) {
        return "(   )" + "+" + arg2 + "=" + res;
    } else {
        return arg1 + "+" + "(   )" + "=" + res;
    }
}

//减法
function FormulaMinus() {
    arg1 = RandomInt(hardMin, hardMax);
    arg2 = RandomInt(hardMin2, hardMax2);
    while (arg1 == arg2) {
        arg2 = RandomInt(hardMin2, hardMax2);
    }
    if (arg2 > arg1) {
        [arg1, arg2] = [arg2, arg1];
    }
    return arg1 + "  -  " + arg2 + " ="
}

//退位
function FormulaMinus2() {
    let str1 = "";
    for (let i = 0; i < 1000; i++) {
        arg1 = RandomInt(hardMin, hardMax);
        arg2 = RandomInt(hardMin2, hardMax2);
        if (arg2 > arg1) {
            [arg1, arg2] = [arg2, arg1];
        }
        str1 = arg1 + "  -  " + arg2 + " =";
        //判断是否满足进位条件
        let t1 = arg1 % 10;
        let t2 = arg1 % 10;
        if ((t1 - t2) < 0) {
            break;
        }
    }

    return str1;
}

//空格
function FormulaMinus3() {
    arg1 = RandomInt(hardMin, hardMax);
    arg2 = RandomInt(hardMin2, hardMax2);
    if (arg2 > arg1) {
        [arg1, arg2] = [arg2, arg1];
    }
    let md = RandomInt(0, 1);
    let res = arg1 - arg2;
    if (md == 0) {
        return "(   )" + "-" + arg2 + "=" + res;
    } else {
        return arg1 + "-" + "(   )" + "=" + res;
    }
}

//乘法
function FormulaCross() {
    arg1 = RandomInt(hardMin, hardMax);
    arg2 = RandomInt(hardMin2, hardMax2);
    return arg1 + "  X  " + arg2 + " =";
}

//基本乘法表
function FormulaCross2() {
    arg1 = RandomInt(1, 9);
    arg2 = RandomInt(1, 9);
    return arg1 + "  X  " + arg2 + " =";
}

//乘整十
function FormulaCross3() {
    arg1 = RandomInt(hardMin, hardMax);
    arg2 = RandomInt(hardMin2, hardMax2);
    arg2 = arg2 * 10;
    let md = RandomInt(0, 1);
    if (md == 0) {
        return arg1 + "  X  " + arg2 + " =";
    }
    return arg2 + "  X  " + arg1 + " =";
}

//除号
function FormulaDivide() {
    arg1 = RandomInt(hardMin, hardMax);
    arg2 = RandomInt(hardMin2, hardMax2);
    let res = arg1 * arg2;
    return res + "  ÷  " + arg2 + " =";
}

//除号+余
function FormulaDivide2() {
    arg1 = RandomInt(hardMin, hardMax);
    arg2 = RandomInt(hardMin, hardMax);
    arg3 = RandomInt(0, arg2);
    let res = arg1 * arg2 + arg3;
    return res + " ÷ " + arg2 + "=";
}

//除号 带余数
function FormulaDivid3(){
    arg1 = RandomInt(hardMin, hardMax);
    arg2 = RandomInt(hardMin2, hardMax2);
    return arg1 + "  ÷  " + arg2 + " =";
}

//连加
function TwoFormulaAdd() {
    arg1 = RandomInt(hardMin, hardMax);
    arg2 = RandomInt(hardMin2, hardMax2);
    arg3 = RandomInt(hardMin2, hardMax2);
    return arg1 + "+" + arg2 + "+" + arg3 + "=";
}

//连减
function TowFormulaMinus() {
    arg1 = RandomInt(hardMin + 10, hardMax);
    arg2 = RandomInt(hardMin2, arg1 - 1);
    while (arg2 > arg1) {
        arg2 = RandomInt(hardMin2, arg2 - 1);
    }
    let rangMax3 = (arg1 - arg2);
    arg3 = RandomInt(1, rangMax3);
    while (arg3 > rangMax3) {
        arg3 = RandomInt(1, rangMax3);
    }
    return arg1 + "-" + arg2 + "-" + arg3 + "=";
}

//混合加减
function TowFormulaAddMinus() {
    arg1 = RandomInt(hardMin, hardMax);
    arg2 = RandomInt(hardMin2, hardMax2);
    let rangMax3 = (arg1 + arg2);
    arg3 = RandomInt(hardMin2, hardMax2);
    while (arg3 > rangMax3) {
        arg3 = RandomInt(1, hardMax2);
    }
    return arg1 + "+" + arg2 + "-" + arg3 + "=";
}

//混合减加
function TowFormulaMinusAdd() {
    arg1 = RandomInt(hardMin + 10, hardMax);
    arg2 = RandomInt(hardMin2, arg1 - 1);
    while (arg2 > arg1) {
        arg2 = RandomInt(hardMin2, arg2 - 1);
    }
    arg3 = RandomInt(hardMin2, hardMax2);
    return arg1 + "-" + arg2 + "+" + arg3 + "=";
}

//混合加乘
function TowFormulaAddCross() {
    arg1 = RandomInt(hardMin, hardMax);
    if(grade <= 2 ){
        arg2 = RandomInt(1, 10);
        arg3 = RandomInt(1, 10);
    }else{
        arg2 = RandomInt(hardMin2, hardMax2);
        arg3 = RandomInt(hardMin2, hardMax2);
    }
 
    let tmp1 = (arg1 + arg2) * arg3;
    let md1 = RandomInt(0, 3);
    if (md1 == 0 && tmp1 <= 100) {
        return "(" + arg1 + " + " + arg2 + ") X " + arg3 + "=";
    } else if (md1 == 1 && tmp1 <= 100) {
        return arg3 + " X (" + arg1 + " + " + arg2 + ")=";
    } else if (md1 == 2) {
        return arg3 + " X " + arg2 + " + " + arg1 + "=";
    }
    return arg1 + " + " + arg2 + " X " + arg3 + "=";
}

function TowFormulaMinusCross() {
    arg1 = RandomInt(hardMin, hardMax);
    if(grade <= 2 ){
        arg2 = RandomInt(1, 10);
        arg3 = RandomInt(1, 10);
    }else{
        arg2 = RandomInt(hardMin2, hardMax2);
        arg3 = RandomInt(hardMin2, hardMax2);
    }

    while (arg1 < arg2) {
        arg1 = RandomInt(arg2, hardMax);
    }

    let tmp2 = arg1 - arg2;
    let md1 = RandomInt(0, 1);
    if (md1 == 0 && tmp2 < 10) {
        return "(" + arg1 + " - " + arg2 + ")X " + arg3 + "=";
    }

    let tmp1 = arg2 * arg3
    if (arg1 < tmp1) {
        return arg2 + " X " + arg3 + " - " + arg1 + "=";
    }
    return arg1 + " - " + arg2 + " X " + arg3 + "=";
}

function TowFormulaAddDivide() {
    arg1 = RandomInt(hardMin, hardMax);
    if(grade <= 2 ){
        arg2 = RandomInt(1, 10);
        arg3 = RandomInt(1, 10);
    }else{
        arg2 = RandomInt(hardMin2, hardMax2);
        arg3 = RandomInt(hardMin2, hardMax2);
    }

    let tmp1 = arg2 * arg3;

    let md1 = RandomInt(0, 1);
    if (md1 == 0 && arg1 < tmp1) {
        return "(" + arg1 + " + " + (tmp1 - arg1) + ")÷" + arg3 + "=";
    }

    return arg1 + " + " + tmp1 + " ÷ " + arg3 + "=";
}

function TowFormulaMinusDivide() {
    arg1 = RandomInt(hardMin, hardMax);
    if(grade <= 2 ){
        arg2 = RandomInt(1, 10);
        arg3 = RandomInt(1, 10);
    }else{
        arg2 = RandomInt(hardMin2, hardMax2);
        arg3 = RandomInt(hardMin2, hardMax2);
    }
    let tmp1 = arg2 * arg3;

    let md1 = RandomInt(0, 1);
    if (md1 == 0 && arg1 > tmp1) {
        return "("+arg1 + "-" + (arg1-tmp1) + ") ÷ " + arg3 + "=";
    }

    if (arg2 > arg1) {
        return tmp1 + " ÷ " + arg3 + " - " + arg1 + "=";
    }

    return arg1 + " - " + tmp1 + " ÷ " + arg3 + "=";
}

//把输入和空白的进行组合
function MergeBlank(inputStr, strLen) {
    strLen = strLen || inputStr.length;
    if (strLen < 11) {
        strLen = 11;
    }
    let str2 = "";
    for (let i = 0, len = strLen; i < len; i++) {
        if (i < inputStr.length) {
            str2 = str2 + inputStr.charAt(i);
        } else {
            str2 = str2 + " ";
        }
    }

    return str2;
}

//左侧加字符
function MergeBlankLeft(inputStr, strLen) {
    strLen = strLen || inputStr.length;
    if (inputStr.length >= strLen) {
        return inputStr;
    }
    let str2 = "";
    for (let i = 0, len = (strLen - inputStr.length); i < len; i++) {
        str2 = str2 + "  ";
    }
    str2 = str2 + inputStr;

    return str2;
}

//生成随机值
function RandomInt(min, max) {
    var span = max - min + 1;
    var result = Math.floor(Math.random() * span + min);
    return result;
}

//显示生成的题目图片，长按保存
function ShowImageDlg() {
    let strImg = "<img ";
    strImg += "src=" + canvas.toDataURL('png', 1.0);
    strImg += " style='width:350px;height:500px;'></img>";
    let dlg1 = new Dialog({
        title: "长按图片，保存下载",
        text: strImg
    });

    dlg1.Show();
}

//下载
function DownLoad() {
    //确定图片的类型  获取到的图片格式 data:image/Png;base64,......
    let type = 'jpeg';
    let imgdata = canvas.toDataURL(type, 1.0);
    //将mime-type改为image/octet-stream,强制让浏览器下载
    let fixtype = function (type) {
        type = type.toLocaleLowerCase().replace(/jpg/i, 'jpeg');
        let r = type.match(/png|jpeg|bmp|gif/)[0];
        return 'image/' + r;
    };
    imgdata = imgdata.replace(fixtype(type), 'image/octet-stream');
    //将图片保存到本地
    let savaFile = function (data, filename) {
        let save_link = document.createElement('a');
        save_link.href = data;
        save_link.download = filename;
        let event = new MouseEvent('click');
        save_link.dispatchEvent(event);
    };

    let filename = '' + new Date().format('yyyy-MM-dd_hhmmss') + '.' + type;
    //用当前秒解决重名问题
    savaFile(imgdata, filename);
}

Date.prototype.format = function (format) {
    let o = {
        "y": "" + this.getFullYear(),
        "M": "" + (this.getMonth() + 1),  //month
        "d": "" + this.getDate(),         //day
        "h": "" + this.getHours(),        //hour
        "m": "" + this.getMinutes(),      //minute
        "s": "" + this.getSeconds(),      //second
        "S": "" + this.getMilliseconds(), //millisecond
    }
    return Object.keys(o).reduce((pre, k) => (new RegExp("(" + k + "+)").test(pre)) ? (pre.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : o[k].padStart(2, "0"))) : pre, format);
}

//绘制图片
function DrawImage(img0, cb) {
    let imgObj = new Image();
    imgObj.src = img0;
    imgObj.onload = function () {
        ctx.drawImage(imgObj, 10, 10, 150, 150);
        if (typeof cb == "function") {
            cb();
        }
    }
}

String.prototype.ATrim = function () {
    return this.replace(/(\s)*/g, "");
}

//从公式中得到元素
function GetItemsFromFormula(str1) {
    str1 = str1.ATrim();
    let arr1 = [];
    for (let i = 0; i < str1.length; i++) {
        let str2 = str1[i];
        if (["+", "-", "X", "÷", "="].indexOf(str2) >= 0) {
            arr1.push(str2);
            arr1.push("");
        } else {
            if (arr1.length == 0) {
                arr1.push(str2);
            } else {
                arr1[arr1.length - 1] += str2;
            }
        }

    }

    return arr1.filter((val) => {
        if (val !== "" && val != undefined) {
            return true;
        }
        return false;
    });
}

//绘制竖式方程
function DrawFormulaVerticals(arr1) {
    for (let i = 0; i < arr1.length; i++) {
        DrawFormulaVertical(arr1[i]);
    }
}

function DrawFormulaVertical(oTxt) {
    let str1 = oTxt.txt;
    let x = oTxt.x;
    let y = oTxt.y;
    let hei = oTxt.h + 0.05;
    let arr1 = GetItemsFromFormula(str1);

    if (arr1.length >= 4) {
        let arg1 = MergeBlankLeft(arr1[0], 2);
        let arg2 = MergeBlankLeft(arr1[2], 2);
        let op1 = arr1[1];
        WriteText(arg1, x + 0.8, y + 0.6, hei);
        WriteText(arg2, x + 0.8, y + 1.2, hei);
        WriteText(op1, x, y + 1.2, hei);
        //画直线
        WriteText("______", x, y + 1.3, hei);
        if (arr1.length >= 6) {
            let arg3 = MergeBlankLeft(arr1[4], 2);
            let op2 = arr1[3];
            WriteText("     ", x, y + 1.8, hei);
            WriteText(arg3, x + 0.8, y + 2.4, hei);
            WriteText(op2, x, y + 2.4, hei);
            WriteText("______", x, y + 2.5, hei);
        }
    }
}