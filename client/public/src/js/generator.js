const gridSize = 20;
let floorplan;
let floor_span = 0;
let current_floor = 0;
let choose_region = null;
prevDiv = null;
let room_position;
var timer
var monster = document.createElement("img");
monster.src = "./img/gif/exercise.gif";
monster.style.width = "150px";
monster.style.height = "250px";
monster.display = "inline";
monster.id = 'monster'
var container = document.getElementsByClassName('container-fluid');
console.log(container)
container[0].appendChild(monster)

let onMouseEnterFloor = () => {
    for (let iter = 0; iter < floorplan.length; ++iter) {
        $(`#floor_animate${iter}`).css({ transition: "0.5s" });
        $(`#floor_animate${iter}`).css({ top: `calc(${30*(floorplan.length-iter-1)}px + 50vh)` });
    }
    floor_span = 1;
};
let onMouseLeaveFloor = () => {
    for (let iter = 0; iter < floorplan.length; ++iter) {
        $(`#floor_animate${iter}`).css({ transition: "0.5s" });
        $(`#floor_animate${iter}`).css({ top: "50vh" });
    }
    if (floor_span) {
        floor_span = 0;
        genPanel(current_floor,1);
    }
};
document.getElementById("floors").addEventListener('mouseenter', onMouseEnterFloor);
document.getElementById("floors").addEventListener('mouseleave', onMouseLeaveFloor);
(async () => {

    await (async function getFloorplan() {
        let data = await fetch('/readFloorplan', {
            body: JSON.stringify({ account: localStorage.getItem("account") }),
            headers: {
                "Content-Type": "application/json"
            },
            method: 'POST'
        }).then(res => {
            return res.json();
        });
        floorplan = data.floorplan;
    })();
    
    genPanel(current_floor,1);
    
})();



function genPanel(floor,buttonenable) {
    clearInterval(timer)
    document.getElementById('monster').style.display = "none";
    if (!floor_span) {
        let floors = document.getElementById("floors");
        let content = "";
        for (let iter = 0; iter < floorplan.length; ++iter) {
            content += `
                <div
                    id="floor_animate${iter}"
                    class="diamond"
                    style="
                        top: 50vh;
                        z-index: ${(iter == floor)? 100: (iter+1)};
                        margin-top: -${12*iter}px;
                        background: ${(iter == floor)? "#799FB4": "#C4D5D9"}
                    "
                >
                    <div>${iter+1}F</div>
                </div>
            `;
        }
        floors.innerHTML = content;
        for (let iter = 0; iter < floorplan.length; ++iter) {
            $(document).on('mouseenter', `#floor_animate${iter}`, function () {
                if (floor_span) {
                    genPanel(iter,1);
                    $(`#floor_animate${iter}`).css({
                        transition: "0s",
                        background: "#799FB4"
                    });
                }
            }).on('click', `#floor_animate${iter}`, function () {
                floor_span = 0;
                current_floor = iter;
                for (let i = 0; i < floorplan.length; ++i) {
                    $(`#floor_animate${i}`).css({
                        transition: "0s",
                        "z-index": i+1
                    });
                }
                $(`#floor_animate${iter}`).css({
                    transition: "0s",
                    "z-index": 100
                });
                onMouseLeaveFloor();
            });
        }
    } else {
        for (let iter = 0; iter < floorplan.length; ++iter) {
            $(`#floor_animate${iter}`).css({
                transition: "0s",
                background: "#C4D5D9"
            });
        }
    }

    let data_point = [];
    let walls = floorplan[floor].walls;
    let corners = floorplan[floor].corners;
    walls = walls? walls: [];
    corners = corners? corners: [];

    document.getElementById("floorplan").innerHTML = "";
    let line = d3.svg.line()
        .x(function(d) {
            return d.x;
        })
        .y(function(d) {
            return d.y;
        })
        .interpolate('linear-closed');
    let svg = d3.select("#floorplan")
        .append("svg")
        .attr({
            position: "absolute",
            width: "100%",
            height: "100%"
        });
        
    walls.forEach(wall => {
        data_point.push({
            x: wall.corner1.x - 100,
            y: wall.corner1.y
        });
        data_point.push({
            x: wall.corner2.x - 100,
            y: wall.corner2.y
        });
    });
    svg.append("path")
        .attr({
            position: "absolute",
            d: line(data_point),
            y: 0,
            stroke: "#F7F6E4",
            "stroke-width": "5px",
            fill: "#F7F6E4"
        });

    let rooms = floorplan[floor].rooms;
    let room_attr_arr = []
    let room_attr={};
    rooms = rooms? rooms: [];
    rooms.forEach((room, key) => {
        svg.append("rect")
            .attr({
                id: `${floor+1}room${key}`,
                fill: room.color,
                width: Math.abs(room.corner1.x - room.corner2.x) + gridSize,
                height: Math.abs(room.corner1.y - room.corner2.y) + gridSize,
                x: Math.min(room.corner1.x, room.corner2.x) - 100,
                y: Math.min(room.corner1.y, room.corner2.y),
                rx: "5px",
                class:'floor-item'
            });
        svg.append("text")
            .attr({
                x: Math.min(room.corner1.x, room.corner2.x) - 100 + 5,
                y: Math.min(room.corner1.y, room.corner2.y) + 25,
                fill: "white",
                id: `${floor+1}room${key}text`,
            }).style({
                "font-size": "25px",
                "font-family": "GenJyuuGothic-Medium"
            }).text(room.text);
        var width = Math.abs(room.corner1.x - room.corner2.x) + gridSize;
        var height = Math.abs(room.corner1.y - room.corner2.y) + gridSize;
        var x =  Math.min(room.corner1.x, room.corner2.x) - 100;
        var y = Math.min(room.corner1.y, room.corner2.y);
        room_attr = {
            width:width,
            height:height,
            pos_x:(x+(width)/2),
            pos_y:(y+(height)/2)
        }
        room_attr_arr.push(room_attr)
        room_attr = {}
    });
    room_position={floor:floor,attr:room_attr_arr}
    document.getElementById('monster').src = "./img/gif/exercise.gif";
    timer = setInterval(jump, 10000, room_position);
    let items = floorplan[floor].items;
    items = items? items: [];
    items.forEach(item => {
        svg.append("image")
            .attr({
                href: `./img/furnish/item/${item.name}.svg`,
                width: item.width,
                height: item.height,
                x: item.x - 300,
                y: item.y - 240
            });
    });

    if(buttonenable){
        if(choose_region){
            if(choose_region[0]==(floor+1)){
                $(`#${choose_region}`).addClass('border')
            }
        }
        for (var i = 0; i < rooms.length; i++) {
            var temp = document.getElementById(floor+1+"room"+i);
            temp.addEventListener('click', function(e) {
                choose_region = e.target.id;
                console.log(choose_region)
                var j = 0;

                while(temp = document.getElementById(floor+1+"room"+j)){ 
                    if(temp.classList.contains('border')){
                        prevDiv = (floor+1)+"room"+j
                    }
                    j = j+1;
                }

                if(prevDiv == null){
                    document.getElementById(choose_region).classList.add('border')
                    prevDiv = choose_region    
                    var text = '#'+ choose_region+'text'
                    $('.head').html('<i class="fa fa-map-marker" aria-hidden="true"></i>'+(floor+1)+'樓:'+$(text).text())           
                }
                else if(choose_region == prevDiv ){
                    document.getElementById(choose_region).classList.remove('border')
                    prevDiv = null;
                    choose_region = null;
                    $('.head').html('<i class="fa fa-map-marker" aria-hidden="true"></i>任務地點');
                }
                else{
                    if(prevDiv){
                        if(prevDiv[0]==floor+1){
                            document.getElementById(prevDiv).classList.remove('border')
                            document.getElementById(choose_region).classList.add('border') 
                            prevDiv = choose_region
                        }
                        else{
                            document.getElementById(choose_region).classList.add('border')
                            prevDiv = choose_region
                        }
                    }
                    else{
                        document.getElementById(choose_region).classList.add('border')
                        prevDiv = choose_region  
                    }
                    var text = '#'+ choose_region+'text'
                    $('.head').html('<i class="fa fa-map-marker" aria-hidden="true"></i>'+(floor+1)+'樓:'+$(text).text())     
                }
            })
        }
    }
    else{
        for (var i = 0; i < rooms.length; i++) {
           $('#'+(floor+1)+"room"+i).css({cursor:'default'});
        }
        if(choose_region){
            if(choose_region[0]==(floor+1)){
                $(`#${choose_region}`).removeClass('border')
            }
        }
    }
}



async function jump(room_position){
    await new Promise(resolve => {
        setTimeout(() => {
            document.getElementById('monster').style.display = "inline"
            index = Math.floor(Math.random() * room_position.attr.length)
            var monster = document.getElementById('monster');
            monster.style.position = "absolute"
            monster.style.left = room_position.attr[index].pos_x+'px'
            monster.style.top = room_position.attr[index].pos_y+'px';
            console.log()
            resolve("exer");
        }, 1000);
    });
    await new Promise(resolve => {
        setTimeout(() => {
            document.getElementById('monster').src = "./img/gif/drop.gif";
            resolve();
        }, 2000);
    });
    let gif = new SuperGif({
        gif: document.getElementById("monster"),
        draw_while_loading: false,
        show_progress_bar: false
    });
    
    gif.load(async function(){
        gif.move_to(gif.get_length()-1);
        for (let iter = 0; iter < gif.get_length(); ++iter) {
            await new Promise(resolve => {
                setTimeout(() => {
                    gif.move_to(gif.get_length()-1-iter);
                    resolve();
                }, 30);
            });
        }
    });
}


