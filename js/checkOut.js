window.addEventListener('load', function () {

    let checkoutLeftSideMid = document.getElementById('checkoutLeftSideMid');
    let checkoutScrollbar = document.getElementsByClassName("checkoutScrollbar")[0];
    let checkoutLeftSideMidItemTop = document.getElementsByClassName("checkoutLeftSideMidItemTop");
    let checkoutIfEachCheck = document.getElementById("checkoutIfEachCheck");
    let checkoutIfDiscount = document.getElementById("checkoutIfDiscount");
    let checkoutIfPoint = document.getElementById("checkoutIfPoint");
    let checkoutDiscountBtn = document.getElementById("checkoutDiscountBtn");
    let checkoutPointBtn = document.getElementById("checkoutPointBtn");
    let checkoutEachCheckBtn = document.getElementById("checkoutEachCheckBtn");
    let checkoutTotal = document.getElementById('checkoutTotal');
    //輸入折扣
    let checkOutDiscountInput = document.getElementById('checkOutDiscountInput');
    let checkoutDiscount = document.getElementById('checkoutDiscount');
    //結帳按鈕
    let checkoutLastBtn = document.getElementById('checkoutLastBtn');
    //記錄幾筆訂單
    let checkoutMenuCount = 0;
    //拆單結帳按鈕
    let checkoutBtn = document.getElementById('checkoutBtn');
    //剩餘品項
    let checkoutLeftSideBottomTop = document.getElementById('checkoutLeftSideBottomTop');

    let checkoutLeftSideTopBtn = document.getElementById('checkoutLeftSideTopBtn');
    // console.log(checkoutLeftSideTopBtn);
    //接從後端撈回的紅利規則
    let bonusRule;

    let checkoutOrderListNo = document.getElementById('checkoutOrderListNo');

    let checkoutOrderInOrOut = document.getElementById('checkoutOrderInOrOut');
    let checkoutTabNo = document.getElementById('checkoutTabNo');

    let ordHTML;
    let checkoutLeftSideMidItemAll = document.getElementById('checkoutLeftSideMidItemAll');

    let cusPhoneNumber;

    let cusNowDay = new Date();

    let ppl;

    let sendDataToDB;
    let checkOutDone = document.getElementById('checkOutDone');
    // console.log(checkoutLeftSideMidItemTop);
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

    var toGoArr = JSON.parse(localStorage.getItem('toGoArr'));

    var tmpBackKitchen = [];
    //確認是否有後廚完成訂單，有渲染內用外帶訂單
    var tmpBackKitchenDone = [];
    var tabReceiveJson = JSON.parse(localStorage.getItem("allData"));

    var tabEditColor = tabReceiveJson[0].selectEmptyColor;
    var tabResColor = tabReceiveJson[0].selectResColor;
    var tabCloseColor = tabReceiveJson[0].selectCloseColor;
    var tabCleanColor = tabReceiveJson[0].selectCleanColor;
    var tabEatColor = tabReceiveJson[0].selectEatColor;
    var ordPostBool = false;
    var ordCheckOutBool = false;

    let checkoutSendNo = document.getElementById('checkoutSendNo');
    let checkoutSendPayNo = document.getElementById('checkoutSendPayNo');
    let checkoutSendGetPrice = document.getElementById('checkoutSendGetPrice');
    let checkoutSendCoin = document.getElementById('checkoutSendCoin');
    let checkoutSendDiscount = document.getElementById('checkoutSendDiscount');
    let checkoutSendBonus = document.getElementById('checkoutSendBonus');
    let checkoutSendLastBonus = document.getElementById('checkoutSendLastBonus');
    let checkoutSendTotalPrice = document.getElementById('checkoutSendTotalPrice');

    let checkoutGetCash = document.getElementById('checkoutGetCash');
    let checkoutChangeDiv = document.getElementById('checkoutChangeDiv').children[1];


    checkoutOrderListNo.innerText = `訂單編號: ${ordlistTips.orderList}`;
    
    if (ordlistTips.inOrOut == "in") {
        checkoutOrderInOrOut.innerText = "內用";
        checkoutTabNo.innerText = `桌號: ${ordlistTips.number}`;
    } else {
        checkoutOrderInOrOut.innerText = "外帶";
        checkoutTabNo.innerText = `桌號: ${ordlistTips.number}`;
    }

    var tmpOrderManu = [];
    //確認是否有後廚完成訂單，有渲染內用外帶訂單
    var tmpOrderManuDone = [];

    function checkOrderDone() {
        for (var i = 0; i < localStorage.length; i++) {
            tmpOrderManu.push(localStorage.key(i));
        }

        for (j = 0; j < tmpOrderManu.length; j++) {
            if (tmpOrderManu[j].includes('orderNo_')) {
                tmpOrderManuDone.push(tmpOrderManu[j]);
            }
        }

    }

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
    function saveDataToLocal(name, data) {
        localStorage.setItem(name, JSON.stringify(data));
    }

    //接會員點數
    // let cusPoint = 0;

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
    bonusRuleGetData();

    function insertCustomerData(data){
        let xhr = new XMLHttpRequest();
        xhr.onload = function () {

            if (xhr.readyState == 4 && xhr.status == 200) {
                let result = xhr.responseText;
                console.log(result);
            }
        }


        xhr.open("post", "./php/insertCustomerData.php", true);
        xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
        xhr.send(`customerData=${data}`);
    }
    function checkCustomer(data) {

        let xhr = new XMLHttpRequest();
        xhr.onload = function () {
            console.log(xhr.readyState);
            if (xhr.readyState == 4 && xhr.status == 200) {
                let phone = JSON.parse(xhr.responseText);


                if (phone == "") {
                    //查無此會員
                    checkoutLeftSideTopBtn.parentElement.children[0].value = "無會員資料";
                    checkoutLeftSideTopBtn.parentElement.children[0].style.color = "#E98E89";
                    checkoutLeftSideTopBtn.parentElement.children[0].style.fontSize = "25px";
                    //非會員現有紅利=0
                    checkoutNowBouns.innerText = 0;
                    insertCustomerData(data);
                } else {
                    checkoutLeftSideTopBtn.parentElement.children[1].style.display = "none";
                    checkoutLeftSideTopBtn.parentElement.children[0].style.padding = "0";
                    checkoutNowBouns.innerText = phone.CUS_POINT;
                    cusPoint = phone.CUS_POINT;
                    if (phone.CUS_GEN == "男") {
                        checkoutLeftSideTopBtn.parentElement.children[0].value = `${phone.CUS_LAST}先生您好`
                    } else {
                        checkoutLeftSideTopBtn.parentElement.children[0].value = `${phone.CUS_LAST}小姐您好`
                    }


                }

            }
        }
        xhr.open("post", "./php/customerSearch.php", true);
        xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
        xhr.send(`customer=${data}`);

    }

    

    function checkoutSaveDataToDB(Data) {
        let xhr = new XMLHttpRequest();
        xhr.onload = function () {

            if (xhr.readyState == 4 && xhr.status == 200) {
                let result = xhr.responseText;
                bonusRule = result;

            }
        }
        xhr.open("post", "./php/checkOutSaveDataToDB.php", true);
        xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
        xhr.send(`orderList=${Data}`);

    }


    //-------------------------- 紅利相關 --------------------------
    //輸入紅利點數
    let checkoutGetPoint = document.getElementById('checkoutGetPoint');
    //每筆品項金額
    let checkOutPrice = document.getElementsByClassName('checkOutPrice');
    //總金額 折扣/紅利/拆帳都會用到
    let checkOutTotalPrice = 0;
    //紀錄總金額 只有在折扣和紅利會變動變動的金額
    let checkOutTotalPriceSendToDB = 0;
    //折扣總金額
    let checkoutDiscountTotalPrice = 0;

    let checkoutNowBouns = document.getElementById('checkoutNowBouns');

    let checkoutDiscountPrice = document.getElementById('checkoutDiscountPrice');

    checkBackKitchenDone();
    checkOrderDone();



    ordHTML = "";
    checkoutLeftSideMidItemAll.innerHTML = "";

    let tmpcontent;

    for (i = 0; i < tmpOrderManuDone.length; i++) {
        let tmpstr = tmpOrderManuDone[i].indexOf('_') + 1;
        if (tmpOrderManuDone[i].substring(tmpstr) == ordlistTips.orderList) {
            tmpcontent = JSON.parse(localStorage.getItem(`orderNo_${ordlistTips.orderList}`));

        }
    }

    for (k = 1; k < tmpcontent.length; k++) {

        if (tmpcontent[k].status != 2) {

            if (tmpcontent[k].topping.length > 0) {
                // 把裝配料的容器清空

                let ordtoppingReloadHTML = '';
                // let ordToppingTtlNum = 0;

                // for (let s = 0; s < tmpcontent[k].topping.length; s++) {

                //     ordtoppingReloadHTML += `<span class="ordToppingSec"> ${tmpcontent[k].topping[s]}</span>`;
                //     // 把配料的價錢將加算出總價
                //     ordToppingTtlNum += parseInt(tmpcontent[k].topping[s].split("$")[1]);
                // };

                ordHTML += `
                                <div class="checkoutLeftSideMidItem" color:#ccc">
                                    <div class="checkoutLeftSideMidItemTop">
                                        <span class="ordSele ${tmpcontent[k].PRO_CATA_NO}" data-itemno=${tmpcontent[k].PRO_ITEM_NO}>${tmpcontent[k].PRO_ITEM_NAME}</span>
                                        <span data-count=${k}>1</span>
                                    </div>
                                    <div class="checkoutLeftSideMidItemBottom">
                                        <div class="checkoutLeftSideMidToppings" data-sec=${k}>
                                        ${ordtoppingReloadHTML}
                                        </div>
                                        <span class="checkOutPrice" data-itempr=${tmpcontent[k].PRO_ITEM_PRICE}>$${parseInt(tmpcontent[k].PRO_ITEM_PRICE)}</span>
                                    </div> 
                                </div>
                            `;
                checkoutLeftSideMidItemAll.innerHTML = ordHTML;


                // setTimeout(orderBlue,0);
            } else {

                ordHTML += `
                        <div class="checkoutLeftSideMidItem" color:#ccc">
                            <div class="checkoutLeftSideMidItemTop">
                                <span class="ordSele ${tmpcontent[k].PRO_CATA_NO}" data-itemno=${tmpcontent[k].PRO_ITEM_NO}>${tmpcontent[k].PRO_ITEM_NAME}</span>
                                <span>1</span>
                            </div>
                            <div class="checkoutLeftSideMidItemBottom">
                                <div class="checkoutLeftSideMidToppings" data-sec=${k}>
                                </div>
                                <span class="checkOutPrice" data-itempr=${tmpcontent[k].PRO_ITEM_PRICE}>$${tmpcontent[k].PRO_ITEM_PRICE}</span>
                            </div> 
                        </div>
                    `;
                checkoutLeftSideMidItemAll.innerHTML = ordHTML;

            };
        };

        // checkoutLeftSideMidItemAll.insertAdjacentHTML("beforeend", `${ordHTML}`)

    };

    // console.log(checkoutLeftSideMidItemTop);
    
    for(i=0;i<checkoutLeftSideMidItemTop.length;i++){
        checkoutLeftSideMidItemTop[i].addEventListener("click",function(){
            $(this).toggleClass("-toblue");
        });
    }
 
    
    //計算總金額
    function checkOutSum() {
        for (i = 0; i < checkOutPrice.length; i++) {
            checkOutTotalPrice = checkOutTotalPrice + parseInt(checkOutPrice[i].innerText.substring(1, checkOutPrice[i].innerText.length));
        }
        checkOutTotalPriceSendToDB = checkOutTotalPrice;
        checkoutGetCash.value = checkOutTotalPrice;
        checkoutTotal.innerHTML = `<span>總計：</span> <span>${checkOutTotalPrice}</span>`;
    }
    checkOutSum();

    // console.log(checkOutTotalPriceSendToDB);
    // 點擊訂單項目反藍



    //切換三種結帳模式
    checkoutDiscountBtn.addEventListener("click", function () {
        checkoutIfEachCheck.style.display = "none";
        checkoutIfDiscount.style.display = "initial";
        checkoutIfPoint.style.display = "none";
        checkoutLastBtn.style.display = "initial";
        checkoutSeparateBtn.style.display = "none";
    });
    checkoutPointBtn.addEventListener("click", function () {
        checkoutIfEachCheck.style.display = "none";
        checkoutIfDiscount.style.display = "none";
        checkoutIfPoint.style.display = "initial";
        checkoutLastBtn.style.display = "initial";
        checkoutSeparateBtn.style.display = "none";
    });
    checkoutEachCheckBtn.addEventListener("click", function () {
        checkoutIfEachCheck.style.display = "initial";
        checkoutIfDiscount.style.display = "none";
        checkoutIfPoint.style.display = "none";
        checkoutLastBtn.style.display = "none";
        checkoutSeparateBtn.style.display = "initial";
    });

    //送資料給後端程式同時
    checkoutLastBtn.addEventListener('click', function () {
        console.log(checkOutTotalPrice);
        console.log(checkoutDiscountTotalPrice);
        //訂單編號
        checkoutSendNo.innerText = checkoutOrderListNo.innerText;
        //付款方式(寫死)
        checkoutSendPayNo.innerText = "現金";
        //收款金額
        checkoutSendGetPrice.innerText = checkOutTotalPriceSendToDB;
        //折扣總計
        console.log(checkoutSendDiscount.innerText == "");
        typeof(checkoutDiscountTotalPrice) == "number" && isNaN(checkoutDiscountTotalPrice)? checkoutSendDiscount.innerText = 0 : document.getElementById('checkoutDiscountTotalPrice').innerText != ""?checkoutSendDiscount.innerText = document.getElementById('checkoutDiscountTotalPrice').innerText:checkoutSendDiscount.innerText=0;
     
        //紅利折抵
        typeof(checkoutGetPoint) == "number"?checkoutSendBonus.innerText = checkoutGetPoint.value : checkoutSendBonus.innerText = 0;

        //剩餘紅利
        // if(checkoutNowBouns.innerText == 0)
        // checkoutSendLastBonus.innerText = parseInt(checkoutNowBouns.innerText) - parseInt(checkoutGetPoint.value);
        //總計
        checkoutSendTotalPrice.innerText = checkOutTotalPriceSendToDB - checkoutSendDiscount.innerText - checkoutSendBonus.innerText;


        //訂單編號
        // checkoutOrderListNo.innerText

        //內用/外帶
        //checkoutOrderInOrOut.innerText

        // 紅利折抵名稱
        // bonusRule

        //顧客手機
        //cusPhoneNumber

        //PAY_NO
        //1

        //總金額
        //checkOutTotalPriceSendToDB

        //日期
        // console.log(ordlistTips.number);
        // console.log(tabReceiveJson[2].number);
        let newDate = new Date();
        let ThisDate = `${newDate.getFullYear()}-${(newDate.getMonth()+1)<10?0:''}${newDate.getMonth()+1}-${(newDate.getDate()+1)<10?0:''}${newDate.getDate()}`;

        //人數
        if (ordlistTips.ppl == undefined) {
            ppl = 0;
        } else {
            ppl = ordlistTips.ppl;
        }

        let tmpInOrOut;

        if (ordlistTips.inOrOut == "in") {
            tmpInOrOut = 0;
        } else {
            tmpInOrOut = 1;
        }
        console.log(typeof(cusPhoneNumber));
        sendDataToDB = {
            "ORDER_NO": ordlistTips.orderList,
            "CUS_PHONE": cusPhoneNumber,
            "PAY_NO": 1,
            "EMP_NO": 100003,
            "BONUS_NAME": bonusRule,
            "ORDER_TAX_ID": "",
            "ORDER_DEVICE_NO": "",
            "ORDER_INNOUT": tmpInOrOut,
            "ORDER_NUM": ppl,
            "ORDER_TTL_PRICE": checkOutTotalPriceSendToDB - checkoutSendDiscount.innerText - checkoutSendBonus.innerText,
            "ORDER_DATE": ThisDate
        }
        console.log(sendDataToDB);
        checkoutSaveDataToDB(JSON.stringify(sendDataToDB));
        //點過結帳按鈕bool
        ordCheckOutBool = true;
        //關閉出餐按鈕bool
        ordPostBool = false;
        localStorage.setItem("ordCheckOutBool", JSON.stringify(ordCheckOutBool));
        //  saveDataToLocal("ordCheckOutBool",ordCheckOutBool);
        localStorage.setItem('ordPostBool', ordPostBool);

    });

    checkOutDone.addEventListener('click', function () {

        console.log(tmpBackKitchenDone);
        console.log(tmpOrderManuDone);
        //刪除內用訂單
        for (i = 0; i < tabReceiveJson.length; i++) {

            if (tabReceiveJson[i].number == ordlistTips.number) {
                tabReceiveJson[i].basicInfo.inOrOut = "";
                tabReceiveJson[i].basicInfo.orderList = "";
                //將餐桌改為清潔中
                tabReceiveJson[i].bgc = tabCleanColor;
            }
        }
        localStorage.setItem("allData", JSON.stringify(tabReceiveJson));

        //刪除外帶訂單
        if (toGoArr == undefined) {

        } else {
            for (j = 0; j < toGoArr.length; j++) {
                if (toGoArr[j].orderList == ordlistTips.orderList) {
                    toGoArr.splice(j, 1);

                }
            }
            localStorage.setItem('toGoArr', JSON.stringify(toGoArr));

        }

        //刪除localstorage裡的done_訂單編號
        for (k = 0; k < tmpBackKitchenDone.length; k++) {
            let checktmpBack = tmpBackKitchenDone[k].substring(5, tmpBackKitchenDone[k].length);

            if (ordlistTips.orderList == checktmpBack) {
                localStorage.removeItem(`done_${checktmpBack}`);
            }
        }

        //刪除點餐暫存資料
        localStorage.removeItem(`ordSaveProdInCart_${ordlistTips.orderList}`);
        localStorage.removeItem(`ordSaveProdInTempCart_${ordlistTips.orderList}`);
        localStorage.removeItem(`ordSavePpl_${ordlistTips.orderList}`);
        localStorage.removeItem(`ordSaveProdInCartOnHist_${ordlistTips.orderList}`);
        localStorage.removeItem(`orderNo_${ordlistTips.orderList}`);


        location.replace('./posHomeTab.html');
    });

    //----- 拆帳 -----
    //拆帳刪除選擇的品項
    //從陣列後面開始刪除就可以排除index亂跑的問題
    checkoutSeparateBtn.addEventListener('click', function (e) {
        //拆單
        let checkOutSepratePrice = parseInt(0);

        for (i = checkoutLeftSideMidItemTop.length - 1; i >= 0; i--) {
            //品項是否有被點選
            if (checkoutLeftSideMidItemTop[i].className.match('-toblue') != null) {
                //子單加總
                checkOutSepratePrice = checkOutSepratePrice + parseInt(checkoutLeftSideMidItemTop[i].nextSibling.nextSibling.children[1].innerText.substring(1, checkoutLeftSideMidItemTop[i].nextSibling.nextSibling.children[1].innerText.length));
                console.log(checkOutSepratePrice);
                checkoutLeftSideMidItemTop[i].parentNode.parentNode.removeChild(checkoutLeftSideMidItemTop[i].parentNode);
            }
            checkoutLeftSideBottomTop.innerHTML = `<div></div><span>剩餘品項:${checkoutLeftSideMidItemTop.length}</span>`;
            if (checkoutLeftSideMidItemTop.length == 0) {
                checkoutLastBtn.style.display = "initial";
                checkoutSeparateBtn.style.display = "none";
            }
        }
        document.getElementById('checkoutEachTotal').innerHTML = `<span>拆單總計：</span><span>${checkOutSepratePrice}</span>`
        checkOutTotalPrice = checkOutTotalPrice - checkOutSepratePrice;
        checkoutTotal.innerHTML = `<span>總計：</span> <span>${checkOutTotalPrice}</span>`;
        //console.log(checkOutTotalPrice);
    });

    checkoutLeftSideBottomTop.innerHTML = `<div></div><span>剩餘品項:${checkoutLeftSideMidItemTop.length}</span>`;

    //----- 折扣 -----
    //單品項價錢

    checkOutDiscountInput.addEventListener('change', function () {
        //取得輸入的折扣%數
        var discount = checkOutDiscountInput.value;
        //清空總金額
        checkoutDiscountTotalPrice = parseInt(0);
        console.log(discount);
        let re = RegExp('^0.[0-9]{2}');
        console.log(re);
        re.test(discount) == false?discount = 1: discount = discount;
        console.log(discount);
        // console.log(discount);
        for (i = 0; i < checkOutPrice.length; i++) {
            var x = parseInt(checkOutPrice[i].innerText.substring(1, checkOutPrice[i].innerText.length));
            x = Math.round(x * discount);
            //折扣後品項加總
            checkoutDiscountTotalPrice += x;
            checkOutPrice[i].innerText = "$" + x;
        }
        //寫回折扣總價
        document.getElementById('checkoutDiscountTotalPrice').innerText = checkOutTotalPrice - checkoutDiscountTotalPrice;
        checkoutTotal.innerHTML = `<span>總計：</span> <span>${checkoutDiscountTotalPrice}</span>`;
        checkOutTotalPrice = checkoutDiscountTotalPrice;
        //只有在折扣或紅利時需修改checkOutTotalPriceSendToDB的值
        checkOutTotalPriceSendToDB = checkoutDiscountTotalPrice;
        //同步更新收款金額
        checkoutGetCash.value = checkOutTotalPrice;
    });

    //----- 紅利 -----
    //紅利折點

    checkoutGetPoint.addEventListener('change', function () {

        //欲折抵點數
        var getPoint = parseInt(checkoutGetPoint.value); //輸入的紅利點數(整數)
        var bonusPoint = cusPoint - getPoint;           //扣掉後剩餘的紅利點數(整數) -- 第一筆

        //取第一個品項的金額
        var firstItem = parseInt(checkOutPrice[0].innerText.substring(1, checkOutPrice[0].innerText.length));


        //會員有的紅利點數 - 會員逾兌換的紅利點數
        if (bonusPoint > 0) {   //可兌換
            //折抵流程
            //1. 輸入的紅利點數 / __點可換1元
            //console.log(parseInt(getPoint/bonusExchange)); //折抵金額
            console.log(getPoint % bonusExchange);           //折抵後剩餘的紅利點數 -- 第二筆

            //寫入折抵金額 與 折扣總計一致
            checkoutDiscountPrice.innerText = parseInt(getPoint / bonusExchange);
            //寫回折扣總計 與 折扣折抵金額
            document.getElementById('checkoutDiscountTotalPrice').innerText = parseInt(getPoint / bonusExchange);

            checkoutTotal.innerHTML = `<span>總計：</span> <span>${checkOutTotalPrice - parseInt(getPoint / bonusExchange)}</span>`;

            
            checkOutTotalPrice = checkOutTotalPrice - parseInt(getPoint / bonusExchange);
            //只有在折扣或紅利時需修改checkOutTotalPriceSendToDB的值
            checkOutTotalPriceSendToDB = checkOutTotalPrice;
            //紅利折抵金額 用第一筆品項去扣
            checkOutPrice[0].innerText = "$" + (firstItem - parseInt(getPoint / bonusExchange));
        }

    });

    checkoutLeftSideTopBtn.addEventListener('click', e => {
        e.preventDefault();


        let senddata = checkoutLeftSideTopBtn.parentElement.children[0].value;
        cusPhoneNumber = senddata;
        checkCustomer(senddata);

    });



});

