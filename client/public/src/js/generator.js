(async function genPanel(floor) {
    const gridSize = 20;
    let data = await fetch('/readFloorplan', {
        body: JSON.stringify({ account: localStorage.getItem("account") }),
        headers: {
            "Content-Type": "application/json"
        },
        method: 'POST'
    }).then(res => {
        return res.json();
    });

    let data_point = [];
    let walls = data.floorplan[floor].walls;
    let corners = data.floorplan[floor].corners;
    walls = walls? walls: [];
    corners = corners? corners: [];

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

    let rooms = data.floorplan[floor].rooms;
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
        
    let items = data.floorplan[floor].items;
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
    
})(0);
