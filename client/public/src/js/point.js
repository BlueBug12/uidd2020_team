let types = document.getElementsByClassName("type");
for (let iter = 0; iter < types.length; ++iter) {
    types[iter].addEventListener('click', () => {
        classNum = iter;
        showItems(iter);
    });
}

const type = ["food", "leisure", "self", "advan", "new"];
const price = [
    ["想吃甜甜圈!", "想吃大餐!", "想吃PIZZA!", "想喝下午茶!", "想吃早午餐!", "想吃章魚燒!", "想吃冰淇淋!", "想吃烤肉!"],
    ["一起看電影!", "家庭電影院!", "一起打桌球!", "一起去游泳!", "一起玩桌遊!", "去水上樂園!", "家庭KTV!", "想要喝酒!"],
    ["幫我敷面膜!", "幫我塗指甲油!", "今天不......!", "換人煮飯!", "為我唱一首歌!", "想買新衣服!", "徵求市場小幫手!", "徵求烘焙小幫手!"],
    ["體驗露營!", "玩沒玩過的球類!", "一起看星星!", "一起小旅行!", "一起做實驗!", "家庭選秀比賽!", "嘗試做新菜!", "一起去釣魚!"],
    ["一起學唱一首歌!", "種一棵植物!", "買奇怪的玩具!", "一起做衣服!", "玩交換禮物!", "一起拍影片!", "來玩保齡球!", "家庭遊戲大賽"]
];
const point = [
    [60, 300, 120, 120, 100, 60, 60, 300],
    [200, 60, 60, 60, 60, 300, 60, 1000],
    [80, 80, 200, 60, 20, 250, 20, 20],
    [300, 60, 200, 300, 100, 60, 60, 300],
    [60, 60, 100, 100, 100, 100, 100, 100]
];

function showItems(classNo) {
    
    for (let iter = 0; iter < types.length; ++iter) {
        types[iter].style["background-color"] = (iter == classNo)? "#9E9E9E": "#FCFFE3";
    }

    let result = "";
    for (let iter = 0; iter < 8; ++iter) {
        result += `
            <div class="item">
                <div class="content">${price[classNo][iter]}</div>
                <img src="./img/price/${type[classNo]}-${iter+1}.png" class="image" />
                <div class="point">${point[classNo][iter]}P</div>
            </div>
        `;
    }
    document.getElementById("items").innerHTML = result;

    let items = document.getElementsByClassName("item");
    for (let iter = 0; iter < items.length; ++iter) {
        items[iter].addEventListener('click', () => {

            document.getElementById("box-container").innerHTML += `
                <div class="box-item">
                    <div class="box">
                        <div class="box-content">${price[classNum][iter]}</div>
                        <img src="./img/price/${type[classNum]}-${iter+1}.png" class="box-image ${type[classNo]}-${iter+1}" />
                    </div>
                    <div class="box-point">${point[classNum][iter]}P</div>
                    <div class="remove">
                        <img src="./img/process/no.png" class="removeImg"/>
                    </div>
                </div>
            `;
            document.getElementById("box-container").scrollTo(document.getElementById("box-container").scrollWidth, 0);

            addRemoveListener();

            let nowTotalPoint = document.getElementById("totalPoint").innerText;
            nowTotalPoint = parseInt(nowTotalPoint.slice(0, nowTotalPoint.length-1)) + point[classNum][iter] + "P";
            document.getElementById("totalPoint").innerText = nowTotalPoint;
            
        });
    }

}

function addRemoveListener() {
    document.getElementById("box-container").innerHTML = document.getElementById("box-container").innerHTML;
    let removeBtns = document.getElementsByClassName("remove");
    for (let i = 0; i < removeBtns.length; ++i) {
        removeBtns[i].addEventListener('click', () => {
            let nowItemPoint = document.getElementsByClassName("box-item")[i].children[1].innerText;
            let nowTotalPoint = document.getElementById("totalPoint").innerText;
            nowTotalPoint = parseInt(nowTotalPoint.slice(0, nowTotalPoint.length-1)) - parseInt(nowItemPoint.slice(0, nowItemPoint.length-1)) + "P";
            document.getElementById("totalPoint").innerText = nowTotalPoint;
            document.getElementsByClassName("box-item")[i].remove();
            addRemoveListener();
        });
    }
}

let classNum = 0;
showItems(classNum);

document.getElementById("buy").addEventListener('click', () => {
    let nowItems = document.getElementsByClassName("box-content");
    let nowTotalPoint = document.getElementById("totalPoint").innerText;
    let nowOwnedPoint = document.getElementById("current-point").innerText;
    nowTotalPoint = parseInt(nowTotalPoint.slice(0, nowTotalPoint.length-1));
    nowOwnedPoint = parseInt(nowOwnedPoint.slice(0, nowOwnedPoint.length-1));
    if (nowTotalPoint > nowOwnedPoint) {
        return;
    } else {
        for (let iter = 0; iter < nowItems.length; ++iter) {
            document.getElementById("down").innerHTML += `
                <div class="hope-item">
                    <input type="checkbox" />
                    <label for="" class="labeltext">${nowItems[iter].innerText}</label>
                </div>
            `;
        }
        document.getElementById("totalPoint").innerText = "0P";
        document.getElementById("box-container").innerHTML = "";
        document.getElementById("current-point").innerText = nowOwnedPoint - nowTotalPoint + "P";
    }
});