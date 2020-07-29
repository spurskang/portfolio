var tmpBackKitchen = [];
//確認是否有後廚完成訂單，有渲染內用外帶訂單
var tmpBackKitchenDone = [];
let kitchenRowData = [];

let orderNo = [];
let orderNoDone = [];
let orderNoDoneQ = [];
let orderNoDoneFinal = [];

let newDate = new Date();
let ThisDate = `${newDate.getFullYear()}-${(newDate.getMonth()+1)<10?0:''}${newDate.getMonth()+1}-${(newDate.getDate()+1)<10?0:''}${newDate.getDate()}`;


console.log(ThisDate);

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
// var done_${orderNo} = [];

// get 廚師做好的key, 如果localstorage沒有值就return
// function load(){
//     if(!localStorage.getItem('done_${orderNo}')) return 
//     done_${orderNo} = [JSON.parse(localStorage.getItem('done_${orderNo}'))]
// }
// load()
function getOrderData() {
    for (var i = 0; i < localStorage.length; i++) {
        orderNo.push(localStorage.key(i));
    }

    for (j = 0; j < orderNo.length; j++) {
        if (orderNo[j].includes('orderNo_')) {
            orderNoDone.push(orderNo[j]);
        }
    }


    for (r = 0; r < orderNoDone.length; r++) {
        orderNoDoneQ.push(parseInt(orderNoDone[r].substring(orderNoDone[r].indexOf('_') + 1)));
    }

    orderNoDoneQ.sort(function (a, b) {
        return a - b;
    });


    for (k = 0; k < orderNoDone.length; k++) {
        orderNoDoneFinal.push(JSON.parse(localStorage.getItem(`orderNo_${orderNoDoneQ[k]}`)));
    }


}



function backdoor() {
    for (var i = 0; i < localStorage.length; i++) {
        tmpBackKitchen.push(localStorage.key(i));
    } //取到所有的key值
    for (j = 0; j < tmpBackKitchen.length; j++) {
        if (tmpBackKitchen[j].includes('done_')) {
            tmpBackKitchenDone.push(localStorage.getItem(tmpBackKitchen[j]));
            // for(i=0;i<tmpBackKitchenDone.length;i++){
            //     tmpBackKitchenDone[i] = parseInt(tmpBackKitchenDone[i]);
            // }
        }
    } //篩選done key值


}


function getrenderdata() {
    for (i = 0; i < orderNoDoneFinal.length; i++) {
        kitchenRowData.push(orderNoDoneFinal[i][0].orderList);
    }

}

function getArrEqual(arr1, arr2) {
    let newArr = [];
    for (let i = 0; i < arr2.length; i++) {
        for (let j = 0; j < arr1.length; j++) {
            if (parseInt(arr1[j]) === parseInt(arr2[i])) {
                newArr.push(arr1[j]);
            }
        }
    }
    return newArr;
}

window.addEventListener('load', function () {
    backdoor();
    getOrderData();
    getrenderdata();



    //由小到大排序
    var rendertest = getArrEqual(kitchenRowData, tmpBackKitchenDone);
    rendertest.sort(function (a, b) {
        return a - b;
    });
   

    for (i = 0; i < orderNoDoneFinal.length; i++) {


        var el3 = document.getElementById('resTable');
        var content3 = "";
        var content = "";
        var kHead = document.getElementById('kOrder');

        //test 
        //先找出幾張單子
        for (let j = 0; j < rendertest.length; j++) {
            let index = kitchenRowData.indexOf(rendertest[j]);
            content3 += '<tr class="clicktr">';
            var item = orderNoDoneFinal[index][0];
            content3 += '<td>' + ThisDate + '</td><td>' + orderNoDoneFinal[index][0]["orderList"] + ' </td><td>' +
                orderNoDoneFinal[index][0]["inOrOut"] + '</td><td>' + ordlistTips.ppl + '</td><td>Lily</td>';
            content3 += '</tr>'
        }

        el3.innerHTML = content3;

        //宣告點擊的該tr

        var clicktr = document.getElementsByClassName('clicktr');
        var test = document.getElementById('myForm');

        el3.addEventListener('click', e => {
            const li = e.target.closest('tr');
            // console.log(Array.from(li.parentNode.children).indexOf(li));
            const thisindex = Array.prototype.indexOf.call(li.parentNode.children, li);
            content = '';
            e.preventDefault();
            e.stopImmediatePropagation();

            // console.log(thisindex);
            // for (let i = 0; i < orderNoDoneFinal.length; i++) {

            //最外層html
            // content += '<div class="kContainer" id="kOrder"><div class="kpin"><i class="fa fa-thumb-tack" aria-hidden="true"></i></div><div class="kHead"><div class="kHeadItem">';
            //取得餐點(第2層loop)
            var tmpindex = rendertest[thisindex] - 1;
            // console.log(tmpindex);
            // console.log(orderNoDoneFinal[0].length);
            // console.log(orderNoDoneFinal[thisindex][1]["topping"]);
            for (let j = 0; j < orderNoDoneFinal[thisindex].length; j++) {


                //取得配菜陣列
                if (j > 0) {
                    
                    var item = orderNoDoneFinal[thisindex][j]["topping"];
                    var topping = "";
                    
                    //將配菜塞入html(第3層loop)
                    for (k = 0; k < item.length; k++) {
                        topping += item[k].substring(0, item[k].indexOf(" ")) + ' ';
                    }

                    //底下菜項目名稱
                    content += ' <li><div class="kFoodTitle"><h1 class="kFoodValue"> ' + orderNoDoneFinal[thisindex][j]["PRO_ITEM_NAME"] +
                        '</h1><span class="kFoodValueTopping"> ' + topping +
                        '</span></div><div class="kFoodNum">X1</div><div class="kFoodStatus"><i class="fa fa-check" aria-hidden="true"></i></div></li>';

                } else {
                    
                    let tmp = orderNoDoneFinal[thisindex][j]["inOrOut"];
                    if(tmp == "in"){
                        tmp = "內用";
                    }else{
                        tmp = "外帶"
                    }
                    //整張訂單
                    content +=
                        '<div class="kpin"><i class="fa fa-thumb-tack" aria-hidden="true"></i></div><div class="kHead"><div class="kHeadItem"><h1>訂單：' +
                        orderNoDoneFinal[thisindex][j]["orderList"] + ' </h1><span>' + ThisDate + '</span></div>';
                    content +=
                        `<div class="kHeadItem"><h1>${tmp}</h1><span>人數：${ordlistTips.ppl}</span><span>店員：Lily</span></div></div>`;
                    content +=
                        ' <div class="kFood"><div class="kFoodBar">項 目</div><ul class="kFoodItem">';
                }

            }
            content += '</ul></div>';

            // content += '<button class="kButton" onclick="foodDone();">訂單完成</button></div>';
            // }
            kOrder.innerHTML = content;
            
        });


    }



});