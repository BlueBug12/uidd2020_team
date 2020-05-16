let mode = "line";
let switchmode = document.getElementById("switch");
switchmode.addEventListener('click', () => {
	if (mode === "line") {
		mode = "rect";
		document.getElementById("color_canvas").style.visibility = "visible";
	} else {
		mode = "line";
		document.getElementById("color_canvas").style.visibility = "hidden";
	}
});
document.getElementById("undo").addEventListener('click', undo);

let panel = {
    width: 1000,
    height: 600
};
let gridSize = 20;
let pre_x=1;
let pre_y=1;
let room_counter=0;
let corners = [];
let walls = [];
let previewedWall = [];
let wall_stack = [];
var room_stack = [];
let nowCorner = {
	id: "",
	x: 0,
	y: 0
};

function drawline(d, isDot, isLine) {

	document.getElementsByTagName("svg")[0].removeEventListener('mousemove', previewWall);

	// calculate dot position
	let x, y;
	if (isDot) {
		x = d.x;
		y = d.y;
	} else if (isLine) {
		x = (Math.floor(d.corner2.x / gridSize) + ((d.corner2.x % gridSize) > (gridSize / 2))) * gridSize + 1;
		y = (Math.floor(d.corner2.y / gridSize) + ((d.corner2.y % gridSize) > (gridSize / 2))) * gridSize + 1;
	} else {
		x = ((event.layerX % gridSize) > (gridSize / 2) || (event.layerX % gridSize) <= 0) * gridSize + d.x;
		y = ((event.layerY % gridSize) > (gridSize / 2) || (event.layerY % gridSize) <= 0) * gridSize + d.y;
		if (event.layerX - d.x == gridSize) x = event.layerX;
		if (event.layerY - d.y == gridSize) y = event.layerY;
	}
	let newCorner = {
		id: Math.random().toString(36).slice(-8),
		x: x,
		y: y,
		r: 6
	};

	// update dots
	corners = corners.map(corner => {
		if (corner.x == newCorner.x && corner.y == newCorner.y) {
			newCorner.id = corner.id;
			return false;
		} else {
			corner.r = 4;
			return corner;
		}
	}).filter(ele => {
		return ele;
	});
	if (nowCorner.x == newCorner.x && nowCorner.y == newCorner.y) {
		newCorner.r = 4;
		nowCorner.id = "";
		nowCorner.x = 0;
		nowCorner.y = 0;
	} else {
		document.getElementsByTagName("svg")[0].addEventListener('mousemove', previewWall);

		// calculate line position
		if (!(nowCorner.x == 0 && nowCorner.y == 0)) {
			let newWall = {
				corner1: previewedWall[0].corner1,
				corner2: newCorner
			};
			walls = walls.map(wall => {
				if ((wall.corner1.x == newWall.corner1.x && wall.corner1.y == newWall.corner1.y) &&
					(wall.corner2.x == newWall.corner2.x && wall.corner2.y == newWall.corner2.y)) {
					return false;
				} else if ((wall.corner1.x == newWall.corner2.x && wall.corner1.y == newWall.corner2.y) &&
						   (wall.corner2.x == newWall.corner1.x && wall.corner2.y == newWall.corner1.y)) {
					return false;
				} else {
					return wall;
				}
			}).filter(ele => {
				return ele;
			});
			walls.push(Object.assign({}, newWall));
		}

		nowCorner.id = newCorner.id;
		nowCorner.x = newCorner.x;
		nowCorner.y = newCorner.y;
	}
	corners.push(newCorner);

	render("line");
	previewWall(event);
	
}

function previewWall(event) {
	if (nowCorner.x == 0 && nowCorner.y == 0) {
		previewedWall = [];
	} else {
		previewedWall = [{
			corner1: Object.assign({}, nowCorner),
			corner2: {
				x: event.layerX,
				y: event.layerY
			}
		}];
	}
	render("previewedWall");
}

function drawrect(d) {
	d3.selectAll(".square").style("fill", "#f0f0f0").attr("class","square")	// reset the class
	let color = document.getElementById("color_canvas").value;
	for (let i = Math.min(d.x, pre_x); i <= Math.max(d.x, pre_x) ; i+=gridSize) {
		for (let j = Math.min(d.y, pre_y); j <= Math.max(d.y, pre_y); j+=gridSize) {
			d3.select("#"+'_'+i.toString(10)+'_'+j.toString(10))
				.style("fill", "#"+color)
				.classed('choosing', true)	// add class to recognize the chosen one
		}
	}
}

function render(type) {
	if (type === "line") {
		d3.select("#corners")
			.selectAll(".corner")
			.data(corners)
			.enter().append("circle")
			.attr("class", "corner")
			.attr("cx", (d) => { return d.x; })
			.attr("cy", (d) => { return d.y; })
			.attr("r", (d) => { return d.r; })
			.attr("stroke-width", 0)
			.attr("fill", "blue")
			.on('click', (d) => { drawline(d, true, false); });
		d3.select("#corners")
			.selectAll("circle")
			.data(corners)
			.attr("cx", (d) => { return d.x; })
			.attr("cy", (d) => { return d.y; })
			.attr("r", (d) => { return d.r; })
			.exit().remove();

		d3.select("#walls")
			.selectAll(".wall")
			.data(walls)
			.enter().append("line")
			.attr("class", "wall")
			.attr("x1", (d) => { return d.corner1.x; })
			.attr("y1", (d) => { return d.corner1.y; })
			.attr("x2", (d) => { return d.corner2.x; })
			.attr("y2", (d) => { return d.corner2.y; })
			.attr("stroke", "blue")
			.attr("stroke-width", 2);
	}
	if (type === "previewedWall") {
		d3.select("#previewWall")
			.selectAll(".wall")
			.data(previewedWall)
			.enter().append("line")
			.attr("class", "wall")
			.attr("x1", (d) => { return d.corner1.x; })
			.attr("y1", (d) => { return d.corner1.y; })
			.attr("x2", (d) => { return d.corner2.x; })
			.attr("y2", (d) => { return d.corner2.y; })
			.attr("stroke", "blue")
			.attr("stroke-width", 2)
			.style("opacity", 0.5)
			.on('click', (d) => { drawline(d, false, true); });
		d3.select("#previewWall")
			.selectAll(".wall")
			.data(previewedWall)
			.attr("x1", (d) => { return d.corner1.x; })
			.attr("y1", (d) => { return d.corner1.y; })
			.attr("x2", (d) => { return d.corner2.x; })
			.attr("y2", (d) => { return d.corner2.y; })
			.exit().remove();
	}
}

function undo() {
	if (mode === "line") {
		// TODO
	}
	if (mode === "rect") {
		let class_name=room_stack.pop()
		if(class_name) {
			d3.selectAll("."+class_name).attr("class","square").style("fill", "#f0f0f0");
			room_counter-=1;
		}
	}
}



// api, basically no need to modify
(function genPanel() {
	function gridData() {
		var data = new Array();
		var xpos = 1; //starting xpos and ypos at 1 so the stroke will show when we make the grid below
		var ypos = 1;
		var width = gridSize;
		var height = gridSize;

		// iterate for rows
		for (var row = 0; row < panel.height / height; row++) {
			data.push( new Array() );

			// iterate for cells/columns inside rows
			for (var column = 0; column < panel.width / width; column++) {
				data[row].push({
					x: xpos,
					y: ypos,
					width: width,
					height: height
				})
				// increment the x position. I.e. move it over by 50 (width variable)
				xpos += width;
			}
			// reset the x position after a row is complete
			xpos = 1;
			// increment the y position for the next row. Move it down 50 (height variable)
			ypos += height;
		}
		return data;
	}

	var gridData = gridData();

	var grid = d3.select("#grid")
		.append("svg")
		.attr("width", panel.width+gridSize)
		.attr("height", panel.height+gridSize);

	var row = grid.selectAll(".row")
		.data(gridData)
		.enter().append("g")
		.attr("class", "row");
	
	var column = row.selectAll(".square")
		.data(function(d) { return d; })
		.enter().append("rect")
		.attr("class","square")
		.attr("x", function(d) { return d.x; })
		.attr("y", function(d) { return d.y; })
		.attr("width", function(d) { return d.width; })
		.attr("height", function(d) { return d.height; })
		.attr("id", function(d) { return '_'+d.x.toString(10)+'_'+d.y.toString(10); })
		.style("fill", "#f0f0f0")
		.style("stroke", "#222")
		.style("stroke-width", 0.3)
		.on('click', function(d) {
			if (mode === "line") {
				drawline(d, false, false);
			}
		}).on('mousedown', function(d) {
			if (mode === "rect"){
				var m = d3.mouse(this);
				pre_x=Math.floor(m[0]/gridSize)*gridSize+1;
				pre_y=Math.floor(m[1]/gridSize)*gridSize+1;
				column.on('mousemove', drawrect);
			}
	   	})
		.on('mouseup',function(d){
			if (mode === "rect"){
				console.log("end")
				room_counter+=1;
				column.on('mousemove', null);
				row.selectAll(".choosing")
					.attr("class","room_"+room_counter.toString(10))
					.classed('chosen',true)
				room_stack.push("room_"+room_counter.toString(10));
			}
		});

	grid.append("g").attr("id", "corners");
	grid.append("g").attr("id", "walls");
	grid.append("g").attr("id", "previewWall");

})();
