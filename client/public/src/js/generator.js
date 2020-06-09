(async function genPanel() {
    const gridSize = 20;
    var choose_region;
    var prevDiv = null;
    let data = await fetch('/readFloorplan', {
        body: JSON.stringify({ account: localStorage.getItem("account") }),
        headers: {
            "Content-Type": "application/json"
        },
        method: 'POST'
    }).then(res => {
        return res.json();
    });
    var data_point = [];
    var walls = data.floorplan.walls;
    var corners = data.floorplan.corners;


    var line = d3.svg.line()
        .x(function(d) {
            return d.x;
        })
        .y(function(d) {
            return d.y;
        })
        .interpolate('linear-closed');
    var svg = d3.select('#floorplan')
        .append('svg')
        .attr({
            'position': 'absolute',
            'width': "100%",
            'height': "100%"
        });
    data_point = []
    for (let i = 0; i < walls.length; ++i) {
        let corner1, corner2;
        corners.forEach(corner => {
            if (corner.id === walls[i].corner1.id) {
                corner1 = Object.assign({}, corner);
            };
            if (corner.id === walls[i].corner2.id) {
                corner2 = Object.assign({}, corner);
            }
        });
        data_point.push({
            x: corner1.x - 100,
            y: corner1.y
        });
        data_point.push({
            x: corner2.x - 100,
            y: corner2.y
        });
    }
    svg.append('path')
        .attr({
            'position': 'absolute',
            'd': line(data_point),
            'y': 0,
            'stroke': '#F7F6E4',
            'stroke-width': '5px',
            'fill': '#F7F6E4'
        });

    var rooms = data.floorplan.rooms;
    for (var i = 0; i < rooms.length; ++i) {
        svg.append('rect')
            .attr({
                'id': "room"+i,
                'fill': rooms[i].color,
                'width': Math.abs(rooms[i].start.x-rooms[i].end.x)+gridSize,
                'height': Math.abs(rooms[i].start.y-rooms[i].end.y)+gridSize,
                'x': Math.min(rooms[i].start.x, rooms[i].end.x) - 100,
                'y': Math.min(rooms[i].start.y, rooms[i].end.y),
                'rx': '5px'
            });
        svg.append('text')
            .attr({
                'x': Math.min(rooms[i].start.x, rooms[i].end.x) - 100 + 5,
                'y': Math.min(rooms[i].start.y, rooms[i].end.y) + 25,
                'fill': 'white'
            }).style({
                'font-size': '25px',
                'font-family': "GenJyuuGothic-Medium"
            }).text(rooms[i].text);
    }
    // var furnish = data.items;
    // for (var i = 0; i < furnish.length; ++i) {
    //     svg.append('image')
    //         .attr({
    //             'id': furnish[i].item_name,
    //             'position': 'absolute',
    //             'href': furnish[i].model_url,
    //             'x': furnish[i].xpos + 100,
    //             'y': furnish[i].ypos,
    //         });
    // }


    for (var i = 0; i < rooms.length; i++) {
        var temp = document.getElementById("room"+i);
        temp.classList.add('floor-item');
        temp.addEventListener('click', function(e) {
            choose_region = e.target.id;
            if (prevDiv != null && prevDiv[0].id == e.target.id) {
                prevDiv = null;
                $(this).removeClass('border');
                choose_region = null;
                $('.head').html('<i class="fa fa-map-marker" aria-hidden="true"></i>任務地點');
            } else {
                $(prevDiv).removeClass('border');
                $(this).addClass('border');
                prevDiv = $(this);
                var text = '#'+ choose_region+'text'
                $('.head').html('<i class="fa fa-map-marker" aria-hidden="true"></i>'+$(text).text())
            }
        })
    }
})();