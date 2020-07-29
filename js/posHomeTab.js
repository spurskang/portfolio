//用來裝後台餐桌資料
var tabReceiveJson = (JSON.parse(localStorage.getItem("allData")));

//新增外帶訂單
var topTabToGo = document.getElementsByClassName('topTabToGo')[0];
// document.getElementById('topTapToGo');

//外帶訂單產生區域
var toGoZone = document.getElementById('toGoZone');

var checkOutOrdSvg = document.getElementById('testQ'); //已出單未結帳

var OrdNoCheckOutSvg = document.getElementById('testZ'); //已點餐未出餐


//  預約/關閉/清潔中/用餐中
var tabEditColor = tabReceiveJson[0].selectEmptyColor;
var tabResColor = tabReceiveJson[0].selectResColor;
var tabCloseColor = tabReceiveJson[0].selectCloseColor;
var tabCleanColor = tabReceiveJson[0].selectCleanColor;
var tabEatColor = tabReceiveJson[0].selectEatColor;

//取出餐桌資料並畫回桌面
var tabConstrainZone = document.getElementById('showTableToResPage');

//---------------------------------
//記訂單    
let posHomePageOrd = 0;
let posHomeOrderList;
// let ttt = localStorage.getItem('posHomePageOrd');
// //產生訂單編號，要下ajax
// if (ttt == undefined) {
//     posHomePageOrd = 0;
// } else {
//     posHomePageOrd = ttt;
// }

let posHomeInsert;

let newDate = new Date();
let ThisDate = `${newDate.getFullYear()}-${(newDate.getMonth() + 1) < 10 ? 0 : ''}${newDate.getMonth() + 1}-${(newDate.getDate() + 1) < 10 ? 0 : ''}${newDate.getDate()}`;

//----------------------------
//紀錄傳到點餐頁面的資訊
var loadOrdListTips = JSON.parse(localStorage.getItem('ordlistTips'));
var ordlistTips = {
    orderList: ' ',
    inOrOut: ' ',
    number: ' '
};

if (loadOrdListTips == undefined) {
    ordlistTips = {
        orderList: ' ',
        inOrOut: ' ',
        number: ' '
    };
} else {
    ordlistTips = loadOrdListTips;
}

//出餐boolean
var ordPostBool = localStorage.getItem('ordPostBool');

//儲存外帶的資料，看要生成多少個li
var toGoArr = [];

if (localStorage.getItem('toGoArr') == undefined) {

    toGoArr = [];
} else {

    toGoArr = JSON.parse(localStorage.getItem('toGoArr'));

}

var tmpBackKitchen = [];
//確認是否有後廚完成訂單，有渲染內用外帶訂單
var tmpBackKitchenDone = [];

//記資料庫中的紅利折抵規則
let bonusRule;

function checkBackKitchenDone() {
    for (var i = 0; i < localStorage.length; i++) {
        tmpBackKitchen.push(localStorage.key(i));
    }

    for (j = 0; j < tmpBackKitchen.length; j++) {
        if (tmpBackKitchen[j].includes('done_')) {
            tmpBackKitchenDone.push(tmpBackKitchen[j]);
        }
    }

}

function componentToHex(color) {
    var hex = color.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function loadOrderList() {
    let xhr = new XMLHttpRequest();

    xhr.onload = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            let result = JSON.parse(xhr.responseText);

            posHomeOrderList = parseInt(result.ORDER_NO);
            console.log(posHomeOrderList);
        }

    }
    xhr.open("post", "./php/loadOrderList.php", false);
    xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
    xhr.send(null);
}

//撈資料庫裡的紅利折抵規則
function bonusRuleGetData() {
    let xhr = new XMLHttpRequest();
    xhr.onload = function () {

        if (xhr.readyState == 4 && xhr.status == 200) {
            let result = xhr.responseText;
            bonusRule = result;


            let bounsCom = parseInt(bonusRule.substring(bonusRule.indexOf('費') + 1, bonusRule.indexOf('元')));
            let bonusExchange = parseInt(bonusRule.substring(bonusRule.indexOf('每') + 1, bonusRule.lastIndexOf('點')));


        }
    }
    xhr.open("post", "./php/checkOut.php", true);
    xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
    xhr.send(null);

}



//新訂單寫入資料庫
function posHomeInsertDataAjax(data) {
    let xhr = new XMLHttpRequest();

    xhr.onload = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            let result = JSON.parse(xhr.responseText);
            console.log(result);

        }

    }
    xhr.open("post", "./php/posHomeInsertDataAjax.php", false);
    xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
    xhr.send(`data=${JSON.stringify(data)}`);
}

window.addEventListener('load', function (e) {
    loadEditTab();
    //撈資料庫訂單編號
    loadOrderList();
    bonusRuleGetData();
    //undefined改成用isNaN判斷
    isNaN(posHomeOrderList) ? posHomePageOrd = 0 : posHomePageOrd = posHomeOrderList;
    console.log(posHomePageOrd);
    console.log(posHomeOrderList);

    //確認是否有後廚完成訂單
    checkBackKitchenDone();

    //渲染內用"已點餐未出餐"訂單
    for (i = 0; i < tabConstrainZone.childElementCount; i++) {

        // console.log(tabConstrainZone.childNodes[i].basicInfo.orderList);
        if (tabConstrainZone.childNodes[i].basicInfo.orderList == "") {
            console.log(`餐桌${i}沒有產生新訂單`);

        } else {

            //已點餐未出餐
            let newlist = OrdNoCheckOutSvg.cloneNode(true);
            //已出餐未結帳
            let ordlist = checkOutOrdSvg.cloneNode(true);

            newlist.style.setProperty("display", "block");
            ordlist.style.setProperty("display", "inline-block");
            tabConstrainZone.childNodes[i].appendChild(newlist);
            //0708-------產生餐桌的訂單改為用餐中
            tabConstrainZone.childNodes[i].style.backgroundColor = tabEatColor;
            //0714 把用餐中狀態寫入localstorage
            tabReceiveJson[i].bgc = tabEatColor;
            saveDataToLocal('allData', tabReceiveJson);
            console.log("產生內用訂單");


            if (tmpBackKitchenDone.length > 0) {

                for (k = 0; k < tmpBackKitchenDone.length; k++) {
                    let checktmpBack = tmpBackKitchenDone[k].substring(5, tmpBackKitchenDone[k].length);
                    if (tabConstrainZone.childNodes[i].basicInfo.orderList == checktmpBack) {
                        //已出餐未結帳

                        if (tabConstrainZone.childNodes[i].hasChildNodes() == true) {
                            // console.log(tabConstrainZone.childNodes[i].childNodes[0].nextSibling);
                            tabConstrainZone.childNodes[i].removeChild(tabConstrainZone.childNodes[i].childNodes[0].nextSibling);
                            let ordlist = checkOutOrdSvg.cloneNode(true);
                            ordlist.style.setProperty("display", "block");
                            tabConstrainZone.childNodes[i].appendChild(ordlist);
                            tabConstrainZone.childNodes[i].style.backgroundColor = tabEatColor;
                            tabReceiveJson[i].bgc = tabEatColor;
                            saveDataToLocal('allData', tabReceiveJson);
                        } else {

                            let ordlist = checkOutOrdSvg.cloneNode(true);
                            ordlist.style.setProperty("display", "block");
                            tabConstrainZone.childNodes[i].appendChild(ordlist);
                            tabConstrainZone.childNodes[i].style.backgroundColor = tabEatColor;
                            tabReceiveJson[i].bgc = tabEatColor;
                            saveDataToLocal('allData', tabReceiveJson);
                        }

                    }
                }
            }

        }
    }


    if (toGoArr.length == 0) {

    } else {

        //渲染外帶訂單
        for (k = 0; k < toGoArr.length; k++) {

            let el = document.createElement('li');
            toGoZone.appendChild(el);

            //已點餐未出餐
            let newlist = OrdNoCheckOutSvg.cloneNode(true);
            newlist.style.setProperty("display", "inline-block");
            //已出餐未結帳
            let ordlist = checkOutOrdSvg.cloneNode(true);
            ordlist.style.setProperty("display", "inline-block");
            el.appendChild(newlist);

            //產生外帶訂單時寫屬性
            for (i = 0; i < toGoZone.childElementCount; i++) {

                toGoZone.childNodes[i].orderList = toGoArr[k].orderList;
                toGoZone.childNodes[i].inOrOut = "out";
            }
            // console.log(toGoZone.childNodes[0].orderList);
            if (tmpBackKitchenDone.length > 0) {

                for (j = 0; j < tmpBackKitchenDone.length; j++) {
                    let checktmpBack = tmpBackKitchenDone[j].substring(5, tmpBackKitchenDone[j].length);
                    if (toGoZone.childNodes[k].orderList == checktmpBack) {
                        //已出餐未結帳
                        console.log(toGoZone.childNodes[k]);
                        if (toGoZone.childNodes[k].hasChildNodes() == true) {
                            // console.log(toGoZone.childNodes[k].childNodes[0].nextSibling);
                            toGoZone.childNodes[k].removeChild(toGoZone.childNodes[k].childNodes[0]);
                            let ordlist = checkOutOrdSvg.cloneNode(true);
                            ordlist.style.setProperty("display", "inline-block");
                            toGoZone.childNodes[k].appendChild(ordlist);

                        } else {

                            let ordlist = checkOutOrdSvg.cloneNode(true);
                            ordlist.style.setProperty("display", "inline-block");
                            toGoZone.childNodes[k].appendChild(ordlist);

                        }

                    }
                }
            }


        }


    }

    //從外帶訂單進到點餐畫面，要先等外帶區有訂單出現才能點訂單
    if (toGoZone.childElementCount == 0) {

    } else {

        toGoZone.addEventListener('click', e => {
            const li = e.target.closest('li');
            //ES6 可用
            // console.log(Array.from(li.parentNode.children).indexOf(li));
            //不支援ES6語法可用
            console.log(Array.prototype.indexOf.call(li.parentNode.children, li));
            ordlistTips.orderList = toGoArr[Array.prototype.indexOf.call(li.parentNode.children, li)].orderList;
            ordlistTips.inOrOut = "out";
            ordlistTips.number = "";
            saveDataToLocal('ordlistTips', ordlistTips);
            location.replace('./orderPage.html');
        });
    }

});

//從localstorage撈出資料後渲染畫面
function loadEditTab() {

    for (i = 0; i < tabReceiveJson.length; i++) {
        let tabElement = document.createElement('li');
        tabElement.id = tabReceiveJson[i].id;
        tabElement.style.width = tabReceiveJson[i].width;
        tabElement.style.height = tabReceiveJson[i].height;
        tabElement.style.backgroundColor = tabReceiveJson[i].bgc;
        tabElement.style.borderRadius = tabReceiveJson[i].borderRadius;
        tabElement.style.position = "absolute";
        tabElement.style.transform = `translate(${tabReceiveJson[i].x + 324}px,${tabReceiveJson[i].y + 167}px)`;
        tabElement.style.listStyle = "none";
        tabElement.tabChangeCheckClose = true;
        tabElement.tabChangeCheckRes = true;
        tabElement.tabChangeCheckOrd = true;
        tabElement.shape = tabReceiveJson[i].shape;
        //餐桌綁訂單
        tabElement.tabOrdList = tabReceiveJson[i].tabOrdList;
        //餐桌有無點擊出餐
        tabElement.tabClickOrder = tabReceiveJson[i].tabClickOrder;
        //餐桌有無點擊結帳
        tabElement.tabClickCheckOut = tabReceiveJson[i].tabClickCheckOut;
        //餐桌綁訂單
        tabElement.basicInfo = tabReceiveJson[i].basicInfo;

        tabElement.innerText = tabReceiveJson[i].number;
        tabConstrainZone.appendChild(tabElement);
    }
}

function saveDataToLocal(name, data) {
    localStorage.setItem(name, JSON.stringify(data));
}

function appendOrder() {

}

//點擊餐桌
tabConstrainZone.addEventListener('click', e => {

    e.preventDefault();
    e.stopImmediatePropagation();

    const li = e.target.closest('li');
    //---------- Hex -> RGB

    var color = li.style.backgroundColor;
    var start = color.indexOf('(');
    var stop = color.lastIndexOf(')');
    var d = color.substring(start + 1, stop);
    var bColor = parseInt(d.substring(d.lastIndexOf(' ') + 1, d.length));
    var gColor = parseInt(d.substring(d.indexOf(' ') + 1, d.lastIndexOf(',')));
    var rColor = parseInt(d.substring(0, d.indexOf(',')));
    //轉換後的值
    var transformColor = rgbToHex(rColor, gColor, bColor);

    switch (transformColor) {

        case tabCloseColor:
            alert('此餐桌被關閉無法進行點餐');
            break;

        //空桌
        case tabEditColor:
            if (li.basicInfo.orderList.length != 0) {
                //該桌已新增訂單但未出單
                //內用/桌號/訂單編號
                ordlistTips.orderList = li.basicInfo.orderList;
                ordlistTips.inOrOut = "in";
                ordlistTips.number = li.basicInfo.number;
                saveDataToLocal('ordlistTips', ordlistTips);
                location.replace('./orderPage.html');
            } else {
                //產生新訂單編號
                posHomePageOrd++;
                //日期 ThisDate
                //顧客手機 0911123456
                //付款方式編號 1
                //員工編號 100003
                //紅利折抵名稱 "消費500元累積1點，每300點可折抵1元" 
                //顧客意見 null
                //統一編號 null
                //載具編號 null
                //內用外帶 "in"
                //人數 1
                //總金額 0
                posHomeInsert = {
                    "ORDER_NO": posHomePageOrd,
                    "CUS_PHONE": "0947382934",
                    "PAY_NO": 1,
                    "EMP_NO": 100003,
                    "BONUS_NAME": bonusRule,
                    "ORDER_TAX_ID": "",
                    "ORDER_DEVICE_NO": "",
                    "ORDER_INNOUT": 0,
                    "ORDER_NUM": 1,
                    "ORDER_TTL_PRICE": 100,
                    "ORDER_DATE": ThisDate
                }
                //餐桌綁訂單
                li.basicInfo.orderList = posHomePageOrd;
                li.basicInfo.inOrOut = "in";
                saveDataToLocal('allData', tabReceiveJson);

                //寫入共用資料
                ordlistTips.orderList = posHomePageOrd;
                ordlistTips.inOrOut = "in";
                ordlistTips.number = li.basicInfo.number;
                saveDataToLocal('ordlistTips', ordlistTips);

                //生成新訂單寫入資料庫
                posHomeInsertDataAjax(posHomeInsert);
                //把訂單編號次數寫入localstorage
                localStorage.setItem('posHomePageOrd', posHomePageOrd);

                //跳轉頁面
                location.replace('./orderPage.html');
            }


            break;

        //預約桌
        case tabResColor:

            if (li.basicInfo.orderList.length != 0) {
                //該桌已新增訂單但未出單
                //內用/桌號/訂單編號
                ordlistTips.orderList = li.basicInfo.orderList;
                ordlistTips.inOrOut = "in";
                ordlistTips.number = li.basicInfo.number;
                saveDataToLocal('ordlistTips', ordlistTips);
                location.replace('./orderPage.html');
            } else {
                posHomePageOrd++;

                posHomeInsert = {
                    "ORDER_NO": posHomePageOrd,
                    "CUS_PHONE": "0947382934",
                    "PAY_NO": 1,
                    "EMP_NO": 100003,
                    "BONUS_NAME": bonusRule,
                    "ORDER_FEEDBACK": "",
                    "ORDER_TAX_ID": "",
                    "ORDER_DEVICE_NO": "",
                    "ORDER_INNOUT": 0,
                    "ORDER_NUM": 1,
                    "ORDER_TTL_PRICE": 100,
                    "ORDER_DATE": ThisDate
                }

                // ThisDate
                posHomeInsertDataAjax(posHomeInsert);
                //把訂單編號次數寫入localstorage
                // saveDataToLocal('posHomePageOrd',posHomePageOrd);
                localStorage.setItem('posHomePageOrd', posHomePageOrd);
                // li.tabOrdList = `O${posHomePageOrd}`;
                li.basicInfo.orderList = posHomePageOrd;
                li.basicInfo.inOrOut = "in";
                // saveDataToLocal('ordlistTips',ordlistTips);
                saveDataToLocal('allData', tabReceiveJson);

                //寫入共用資料
                ordlistTips.orderList = posHomePageOrd;
                ordlistTips.inOrOut = "in";
                ordlistTips.number = li.basicInfo.number;
                saveDataToLocal('ordlistTips', ordlistTips);


                //跳轉頁面
                location.replace('./orderPage.html');
            }
            break;

        //用餐中
        case tabEatColor:
            //0708用餐中
            ordlistTips.orderList = li.basicInfo.orderList;
            ordlistTips.inOrOut = "in";
            ordlistTips.number = li.basicInfo.number;
            saveDataToLocal('ordlistTips', ordlistTips);
            location.replace('./orderPage.html');
            break;
        //清潔中
        case tabCleanColor:
            //0708清潔中
            li.style.backgroundColor = tabEditColor;
            tabReceiveJson[Array.prototype.indexOf.call(li.parentNode.children, li)].bgc = tabEditColor;

            saveDataToLocal('allData', tabReceiveJson);
            break;
    }

});


//點擊外帶區
topTabToGo.addEventListener('click', e => {

    //訂單編號+1
    posHomePageOrd++;
    console.log(posHomePageOrd);
    posHomeInsert = {
        "ORDER_NO": posHomePageOrd,
        "CUS_PHONE": "0947382934",
        "PAY_NO": 1,
        "EMP_NO": 100003,
        "BONUS_NAME": bonusRule,
        "ORDER_FEEDBACK": "",
        "ORDER_TAX_ID": "",
        "ORDER_DEVICE_NO": "",
        "ORDER_INNOUT": 1,
        "ORDER_NUM": 1,
        "ORDER_TTL_PRICE": 100,
        "ORDER_DATE": ThisDate
    }

    // ThisDate
    posHomeInsertDataAjax(posHomeInsert);
    //把訂單編號次數寫入localstorage
    // saveDataToLocal('posHomePageOrd',posHomePageOrd);
    localStorage.setItem('posHomePageOrd', posHomePageOrd);

    //在外帶區生成訂單
    let toGoli = document.createElement('li');
    toGoli.basicInfo = {
        orderList: posHomePageOrd,
        inOrOut: "out",
        number: ""
    };

    //已點餐未出餐
    let newlist = OrdNoCheckOutSvg.cloneNode(true);
    //已出餐未結帳
    let ordlist = checkOutOrdSvg.cloneNode(true);
    toGoZone.appendChild(toGoli);
    newlist.style.display = 'inline-block';
    toGoli.appendChild(newlist);

    toGoArr.push(toGoli.basicInfo);

    //把外帶資訊存到localstorage
    localStorage.setItem('toGoArr', JSON.stringify(toGoArr));
    //把資訊傳到共用的localstorage
    ordlistTips.orderList = toGoli.basicInfo.orderList;
    ordlistTips.inOrOut = "out";
    ordlistTips.number = "";

    saveDataToLocal('ordlistTips', ordlistTips);

    //跳轉到點餐頁面
    location.replace('./orderPage.html');
});