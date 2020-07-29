// let el = document.querySelector('.date');
// let Today = new Date();
// el.textContent = Today.getFullYear() + " / " + (Today.getMonth() + 1) + " / " + Today.getDate();

// let dt = document.querySelector('.clock');

// TodayHours = Today.getHours() < 10 ? '0' + Today.getHours() : Today.getHours();
// TodayMinutes = Today.getMinutes() < 10 ? '0' + Today.getMinutes() : Today.getMinutes();
// dt.textContent = TodayHours + " : " + TodayMinutes;
let newDate = new Date();
let ThisDate = `${newDate.getFullYear()}-${(newDate.getMonth()+1)<10?0:''}${newDate.getMonth()+1}-${(newDate.getDate()+1)<10?0:''}${newDate.getDate()}`;

var orderNo = [];
var orderNoDone = [];
var orderNoDoneFinal = [];
var el2 = document.getElementsByClassName('kPageContainer')[0];
var content = "";

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

let tmpRenderList = [];

function getOrderData() {
    for (var i = 0; i < localStorage.length; i++) {
        orderNo.push(localStorage.key(i));
    }

    for (j = 0; j < orderNo.length; j++) {
        if (orderNo[j].includes('orderNo_')) {
            orderNoDone.push(orderNo[j]);
        }
    }

    for (k = 0; k < orderNoDone.length; k++) {
        orderNoDoneFinal.push(JSON.parse(localStorage.getItem(`${orderNoDone[k]}`)));
    }

}

//渲染出餐訂單        

window.addEventListener('load', function () {
    getOrderData();

    for(i=0;i<orderNoDoneFinal.length;i++){
        for(j=1;j<orderNoDoneFinal[i].length;j++){
            orderNoDoneFinal[i][j].status == 1 && orderNoDoneFinal[i][j].state == 0 ? tmpRenderList.push(i) : tmpRenderList;
        }
    }
    let resultQ = [...(new Set(tmpRenderList))];

    rederOrdListIf(resultQ);
    
    //按下完成後，該單消失
    $('.kButton').on('click', function () {
        $(this).parent('.kContainer').css('display', 'none');
    })
});



function rederOrdListIf(data) {
    
    for (let i = 0; i < data.length; i++) {
        
        //最外層html
        content += '<div class="kContainer" id="kOrder"><div class="kpin"><i class="fa fa-thumb-tack" aria-hidden="true"></i></div><div class="kHead"><div class="kHeadItem">';
        //取得餐點(第2層loop)
        for (let j = 0; j < orderNoDoneFinal[i].length; j++) {
            //取得配菜陣列
            if (j > 0) { //餐點
                var item = orderNoDoneFinal[i][j]["topping"];
                var topping = "";
                //將配菜塞入html(第3層loop)
                for (k = 0; k < item.length; k++) {
                    topping += item[k].substring(0, item[k].indexOf(" ")) + ' ';
                }
                //底下菜項目名稱
                let myClolor;
                if (orderNoDoneFinal[i][j].state == 1 && orderNoDoneFinal[i][j].status == 1) {
                    myClolor = `style ="color:grey"`;

                }
                if (orderNoDoneFinal[i][j].status == 2) {

                } else {
                    content += ` <li ${myClolor}><div class="kFoodTitle"><h1 class="kFoodValue"> ` + orderNoDoneFinal[i][j]["PRO_ITEM_NAME"] + '</h1><span class="kFoodValueTopping"> ' + topping + '</span></div><div class="kFoodNum">X1</div><div class="kFoodStatus"><i class="fa fa-check" aria-hidden="true"></i></div></li>';
                }


            } else {//j==0
                //整張訂單基本資料
                content += '<h1>訂單:<span>' + orderNoDoneFinal[i][j]["orderList"] + '</span></h1><span>' + ThisDate + '</span></div>';
                content += ' <div class="kHeadItem"><h1>外帶/內用：' + orderNoDoneFinal[i][0]["inOrOut"] + '</h1><span>人數:' + ordlistTips.ppl + '</span><span>店員：Lily</span></div></div>'
                content += ' <div class="kFood"><div class="kFoodBar">項 目</div><div class="resScrollbar" id="resScrollstyle"><div class="resOverflow"><ul class="kFoodItem">';
            }

        }
        content += '</ul></div></div></div>';
        content += '<button type="button" class="kButton" onclick="foodDone(this);">訂單完成</button></div>';
    }

    
    //渲染 status = 1, state = 0的在廚房待做訂單上
    for (i = 0; i < data.length; i++) {
        for (j = 0; j < orderNoDoneFinal[i].length; j++) {
            let status = orderNoDoneFinal[i][j].status;
            let state = orderNoDoneFinal[i][j].state;
            if (status == 1 && state == 0) {
                el2.innerHTML = content;
            }
        }
    }
}

//取得訂單(第1層loop)



function foodDone(obj,event) {

    let orderNo = obj.parentNode.querySelector('.kHeadItem h1 span').innerHTML;
    //state改值:1
    for (i = 0; i < orderNoDoneFinal.length; i++) {
        // orderNoDoneFinal[i][0]是訂單基本資料
        if (orderNoDoneFinal[i][0].orderList == orderNo) {//如果是這一張單
            for (j = 1; j < orderNoDoneFinal[i].length; j++) { //從1才是所訂的餐點
                let status = orderNoDoneFinal[i][j].status;
                let state = orderNoDoneFinal[i][j].state;
                if (status == 1 && state == 0) {
                    orderNoDoneFinal[i][j].state = 1;
                    localStorage.setItem(`orderNo_${orderNoDoneFinal[i][0].orderList}`,JSON.stringify(orderNoDoneFinal[i]));
                }
            }
            localStorage.setItem(`done_${orderNo}`, orderNo);
            // localStorage.setItem("data", JSON.stringify(data));
        }

    }


    // var newdata = JSON.stringify(newVal);
    // localStorage.setItem('ordSaveProdInCartOnHist' , newdata);

    $(".light > .fa-circle").fadeOut(250).fadeIn(250).fadeOut(250).fadeIn(250).fadeOut(250).fadeIn(250).fadeOut(250).fadeIn(250);
}


