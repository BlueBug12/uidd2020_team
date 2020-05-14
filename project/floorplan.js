var choose_region;
var prevDiv = null;
$.getJSON("floorplan.json", function(json) {
    data = json;
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
                //'background-color':'blue'
        });
    data_point = []
    for (var i = 0; i < walls.length; ++i) {
        data_point.push({ x: corners[walls[i]["corner1"]].x / 1.3 + 220, y: corners[walls[i]["corner1"]].y / 1.3 + 650 });
        data_point.push({ x: corners[walls[i]["corner2"]].x / 1.3 + 220, y: corners[walls[i]["corner2"]].y / 1.3 + 650 });
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

    var rooms = data.rooms;
    for (var i = 0; i < rooms.length; ++i) {
        svg.append('rect')
            .attr({
                'id': rooms[i].id,
                'fill': rooms[i].color,
                'width': rooms[i].width,
                'height': rooms[i].height,
                'x': rooms[i].x + 100,
                'y': rooms[i].y,
                'rx': '5px'
            });
        svg.append('text')
            .attr({
                'x': rooms[i].x + 100 + 5,
                'y': rooms[i].y + 20,
                'fill': 'white'
            }).style({
                'font-size': '20px'

            }).text(rooms[i].text);
    }
    var furnish = data.items;
    for (var i = 0; i < furnish.length; ++i) {
        svg.append('image')
            .attr({
                'id': furnish[i].item_name,
                'position': 'absolute',
                'href': furnish[i].model_url,
                'x': furnish[i].xpos + 100,
                'y': furnish[i].ypos,
            });
    }


    for (var i = 0; i < rooms.length; i++) {
        var temp = document.getElementById("room_" + (i + 1));
        temp.classList.add('floor-item');
        temp.addEventListener('click', function(e) {
            choose_region = e.target.id;
            if (prevDiv != null && prevDiv[0].id == e.target.id) {
                prevDiv = null;
                $(this).removeClass('border');
                choose_region = null;
            } else {
                $(prevDiv).removeClass('border');
                $(this).addClass('border');
                prevDiv = $(this);
            }
        })
    }
});