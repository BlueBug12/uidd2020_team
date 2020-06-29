const gridSize = 20;
let floorplan;
let floor_span = 0;
let current_floor = 0;
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
    
    genPanel(current_floor);
    
})();

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
        genPanel(current_floor);
    }
};
document.getElementById("floors").addEventListener('mouseenter', onMouseEnterFloor);
document.getElementById("floors").addEventListener('mouseleave', onMouseLeaveFloor);

function genPanel(floor) {

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
                    genPanel(iter);
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
    rooms = rooms? rooms: [];
    rooms.forEach((room, key) => {
        svg.append("rect")
            .attr({
                id: `room${key}`,
                fill: room.color,
                width: Math.abs(room.corner1.x - room.corner2.x) + gridSize,
                height: Math.abs(room.corner1.y - room.corner2.y) + gridSize,
                x: Math.min(room.corner1.x, room.corner2.x) - 100,
                y: Math.min(room.corner1.y, room.corner2.y),
                rx: "5px"
            });
        svg.append("text")
            .attr({
                x: Math.min(room.corner1.x, room.corner2.x) - 100 + 5,
                y: Math.min(room.corner1.y, room.corner2.y) + 25,
                fill: "white",
                id: `room${key + room.text}`,
            }).style({
                "font-size": "25px",
                "font-family": "GenJyuuGothic-Medium"
            }).text(room.text);
    });
        
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

    for (var i = 0; i < rooms.length; i++) {
        var temp = document.getElementById("room"+i);
        temp.classList.add('floor-item');
        temp.addEventListener('click', function(e) {
            choose_region = e.target.id;
            var j = 0;
            prevDiv = null
            while(temp = document.getElementById("room"+j)){
                if(temp.classList.contains('border')){
                    prevDiv = "room"+j
                }
                j = j+1;
            }

            if(choose_region == prevDiv){
                document.getElementById(choose_region).classList.remove('border')
                $('.head').html('<i class="fa fa-map-marker" aria-hidden="true"></i>任務地點');
            }
            else if(prevDiv == null){
                document.getElementById(choose_region).classList.add('border')
                var text = '#'+ choose_region+'text'
                $('.head').html('<i class="fa fa-map-marker" aria-hidden="true"></i>'+$(text).text())
            }
            else{
                document.getElementById(prevDiv).classList.remove('border')
                document.getElementById(choose_region).classList.add('border')
                var text = '#'+ choose_region+'text'
                $('.head').html('<i class="fa fa-map-marker" aria-hidden="true"></i>'+$(text).text())
            }
        })
    }
    
}