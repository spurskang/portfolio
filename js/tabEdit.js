var shapeText = document.querySelector('option').innerText;
//var shape = document.querySelector('option').innerText; //ok
var tabShapeSelect = document.querySelector('#tabShapeSelect');
tabShapeSelect.addEventListener('change', (e) => {
  shapeText = e.target.value;
});

//產生餐桌按鈕
let tabAddBtn = document.getElementById('tabAddBtn');
//儲存按鈕
let tabSaveBtn = document.getElementById('tabSaveBtn');
let tabContainer = document.getElementById('resize-tabContainer');
//編輯空桌/預約餐桌/關閉餐桌/清潔餐桌/餐桌用餐中
let tabEditColor;
//  = document.getElementById('tabEditColor');
let tabResColor;
//  = document.getElementById('tabResColor');
let tabCloseColor;
//  = document.getElementById('tabCloseColor');
let tabEatColor;
//  = document.getElementById('tabEatColor');
let tabCleanColor;
//  = document.getElementById('tabCleanColor');
//餐桌編號
let tabNumber = document.getElementById('tabNumber');
let tbN = "";

let TestArr;
//計數按幾次
var count = 0;
var positionArr = [];

let tabToolTipBtn = document.getElementById('tabToolTipBtn')
let tabEditToolTip = document.getElementById('tabEditToolTip')


$('#tabToolTipBtn').on('click', function () {
  $('#tabEditToolTip').toggle()
})
$('#tabAddBtn').on('click', function () {
  $('#tabEditToolTip').toggle()
})

window.addEventListener('load', e => {
  loadTabStatus();
  getTabStatusColor(TestArr);
  // console.log("test",TestArr);
  editTabRender();

});

function loadTabStatus() {
  let xhr = new XMLHttpRequest();

  xhr.onload = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {

      let result = JSON.parse(xhr.responseText);
      TestArr = result;
      // console.log("1",TestArr);

    }

  }
  xhr.open("post", "./php/loadTabStatusColor.php", false);
  xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
  xhr.send(null);
}

function getTabStatusColor(data) {
  for (i = 0; i < data.length; i++) {
    switch (data[i].TAB_NAME) {
      case "空桌":
        tabEditColor = data[i].TAB_SHOW;

        break;

      case "清潔中":
        tabCleanColor = data[i].TAB_SHOW;

        break;

      case "桌位預約":
        tabResColor = data[i].TAB_SHOW;

        break;

      case "桌位不開放":
        tabCloseColor = data[i].TAB_SHOW;

        break;

      case "用餐中":
        tabEatColor = data[i].TAB_SHOW;

        break;
    }
  }
}

function editTabRender() {
  if (localStorage.getItem('allData') == undefined) {

  } else {
    var tabReceiveJson = (JSON.parse(localStorage.getItem("allData")));
    for (i = 0; i < tabReceiveJson.length; i++) {
      let tabElement = document.createElement('li');
      tabElement.id = tabReceiveJson[i].id;
      tabElement.style.width = tabReceiveJson[i].width;
      tabElement.style.height = tabReceiveJson[i].height;
      tabElement.style.backgroundColor = tabEditColor;
      tabElement.style.borderRadius = tabReceiveJson[i].borderRadius;
      tabElement.style.position = "absolute";
      tabElement.style.transform = `translate(${tabReceiveJson[i].x + 319}px,${tabReceiveJson[i].y + 147}px)`;
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
      tabElement.className = tabReceiveJson[i].shape + " tabragobj" + " tabPosition";
      tabContainer.appendChild(tabElement);
    }
  }
}

//interactjs
//要讓不同形狀都可移動就是讓他們共用一個css樣式
interact(".tabragobj")

//限制餐桌只能在限制範圍內裡移動
interact(".tabragobj").draggable({
  modifiers: [
    interact.modifiers.restrictRect({
      restriction: 'parent'
    })
  ]
})

  .draggable({
    onmove: window.dragMoveListener
  })
  .resizable({
    preserveAspectRatio: false,
    edges: { left: false, right: false, bottom: false, top: false }
  })
  .on('resizemove', function (event) {
    var target = event.target,
      x = (parseFloat(target.getAttribute('data-x')) || 0),
      y = (parseFloat(target.getAttribute('data-y')) || 0);


    // update the element's style
    target.style.width = event.rect.width + 'px';
    target.style.height = event.rect.height + 'px';

    // translate when resizing from top or left edges
    x += event.deltaRect.left;
    y += event.deltaRect.top;

    target.style.webkitTransform = target.style.transform =
      'translate(' + x + 'px,' + y + 'px)';

    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
    //target.textContent = event.rect.width + '×' + event.rect.height;

  });

function dragMoveListener(event) {
  var target = event.target,
    // keep the dragged position in the data-x/data-y attributes
    x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
    y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

  // translate the element
  target.style.webkitTransform =
    target.style.transform =
    'translate(' + x + 'px, ' + y + 'px)';

  // update the posiion attributes
  target.setAttribute('data-x', x);
  target.setAttribute('data-y', y);
}

//刪除餐桌
interact('.dropzone')
  .dropzone({
    ondragenter: function (event) {
      //var draggableElement = event.relatedTarget
      var draggableElement = event.relatedTarget.parentNode
      var dropzoneElement = event.target

      // feedback the possibility of a drop
      dropzoneElement.classList.add('drop-target')
      // draggableElement.classList.add('hidden')
      draggableElement.removeChild(event.relatedTarget)

    }
  })


function saveAllDataToJson(data) {
  localStorage.setItem("allData", JSON.stringify(data));
}

tabSaveBtn.addEventListener('click', function () {

  // console.log(tabContainer.childElementCount);
  if (tabContainer.childElementCount == 0) {
    alert('至少要有一個位置才能儲存');
  } else {
    var positionArr = [];
    // console.log(tabContainer.childElementCount);
    for (i = 0; i < tabContainer.childElementCount; i++) {
      var tabShapeName = tabContainer.childNodes[i].getAttribute('class');
      console.log(tabShapeName);
      positionArr.push(
        {
          id: tabContainer.childNodes[i].getAttribute('id'),
          x: parseFloat(tabContainer.childNodes[i].getAttribute('data-x')) - 319.0,
          y: parseFloat(tabContainer.childNodes[i].getAttribute('data-y')) - 147.0,
          test: tabContainer.childNodes[i].getAttribute('style'),
          top: window.getComputedStyle(tabContainer.childNodes[i]).getPropertyValue('top'),
          left: window.getComputedStyle(tabContainer.childNodes[i]).getPropertyValue('left'),
          shape: tabShapeName.substring(0, tabShapeName.indexOf(' ')),
          bgc: window.getComputedStyle(tabContainer.childNodes[i]).getPropertyValue('background-color'),
          height: window.getComputedStyle(tabContainer.childNodes[i]).getPropertyValue('height'),
          width: window.getComputedStyle(tabContainer.childNodes[i]).getPropertyValue('width'),
          borderRadius: window.getComputedStyle(tabContainer.childNodes[i]).getPropertyValue('border-radius'),
          // ==> 空桌/預約/關閉/清潔中/用餐中
          selectEmptyColor: tabEditColor,
          // .value,
          selectResColor: tabResColor,
          // .value,
          selectCloseColor: tabCloseColor,
          // .value,
          selectCleanColor: tabCleanColor,
          // .value,
          selectEatColor: tabEatColor,
          // .value,
          //判斷預約餐桌/關閉餐桌/餐桌點餐
          tabChangeCheckClose: true, //關閉餐桌boolean
          tabChangeCheckRes: true,   //預約餐桌boolean
          tabChangeCheckOrd: true,   //餐桌點餐boolean
          //餐桌狀態，一開始預設為空桌
          tabStatus: 0,
          //-----------------------0703---------------
          //餐桌綁訂單
          tabOrdList: ' ',
          //餐桌有無點擊出餐
          tabClickOrder: false,
          //餐桌有無點擊結帳
          tabClickCheckOut: false,
          basicInfo: {
            orderList: "",
            inOrOut: "",
            number: tabContainer.childNodes[i].innerText
          },
          //-----------------------0704---------------
          number: tabContainer.childNodes[i].innerText

        }
      );

    }
    // console.log(positionArr);
    saveAllDataToJson(positionArr);
    tabEditSave(JSON.stringify(positionArr));

    alert("儲存成功")
  }

});

tabNumber.addEventListener('keyup', e => {
  tbN = tabNumber.value;

});

tabAddBtn.addEventListener('click', function () {

  count++;
  //appendchild
  let tabItem = document.createElement('li');
  //餐桌編號
  // tabItem.textContent = `A${count}`;
  tabItem.innerText = tbN;

  tabItem.className = shapeText + " tabragobj" + " tabPosition";

  tabItem.id = `A${count}`;

  tabItem.style.setProperty('background-color', tabEditColor);

  tabContainer.appendChild(tabItem);

  // console.log(window.getComputedStyle(tabItem).getPropertyValue('background-color'));
});

function tabEditSave(tabData) {

  let xhr = new XMLHttpRequest();

  xhr.onload = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {

      //確認資料是否正確存入資料庫
      let result = xhr.responseText;

    }

  }
  xhr.open("post", "./php/tabSpecSaveToDB.php", true);
  xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
  // xhr.send("tabData=" + tabData);
  xhr.send(`tabData=${tabData}`);

}

