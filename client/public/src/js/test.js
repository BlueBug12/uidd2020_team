let mode = "line";
let switchmode = document.getElementById("button");
switchmode.addEventListener('click', () => {
	if (mode === "line") {
		mode = "rect";
	} else {
		mode = "line";
	}
	console.log("switch mode to " + mode);
});

let panel = {
    width: 1000,
    height: 600
};
let gridSize = 20;

let corners = [];
let walls = [];
let previewedWall = [];
let nowCorner = {
	id: "",
	x: 0,
	y: 0
};

function drawline(d) {

	// document.getElementsByTagName("svg")[0].removeEventListener('mousemove', previewWall);

	let x = ((event.clientX % gridSize) > (gridSize / 2) || (event.clientX % gridSize) <= 0) * gridSize + d.x;
	let y = ((event.clientY % gridSize) > (gridSize / 2) || (event.clientY % gridSize) <= 0) * gridSize + d.y;
	if (event.clientX - d.x == gridSize) x = event.clientX;
	if (event.clientY - d.y == gridSize) y = event.clientY;
	let newCorner = {
		id: Math.random().toString(36).slice(-8),
		x: x,
		y: y,
		r: 5
	};
	corners = corners.map(corner => {
		if (corner.x == newCorner.x && corner.y == newCorner.y) {
			return false;
		} else {
			corner.r = 3;
			return corner;
		}
	}).filter(ele => {
		return ele;
	});
	if (nowCorner.x == newCorner.x && nowCorner.y == newCorner.y) {
		newCorner.r = 3;
		nowCorner.id = "";
		nowCorner.x = 0;
		nowCorner.y = 0;
		// previewedWall = [];
		// d3.select("#previewWall")
		// 	.selectAll(".wall")
		// 	.data(previewedWall)
		// 	.attr("x1", (d) => { return d.corner1.x; })
		// 	.attr("y1", (d) => { return d.corner1.y; })
		// 	.attr("x2", (d) => { return d.corner2.x; })
		// 	.attr("y2", (d) => { return d.corner2.y; })
		// 	.exit().remove();
	} else {
		// document.getElementsByTagName("svg")[0].addEventListener('mousemove', previewWall);
		// if (!(nowCorner.x == 0 && nowCorner.y == 0)) {
		// 	// walls.push({
		// 	// 	corner1: previewedWall[0].corner1,
		// 	// 	corner2: nowCorner
		// 	// });
		// }
		nowCorner.id = newCorner.id;
		nowCorner.x = newCorner.x;
		nowCorner.y = newCorner.y;
	}
	corners.push(newCorner);

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
		.on('click', (d) => { drawline(d); });
	d3.select("#corners")
		.selectAll("circle")
		.data(corners)
		.attr("cx", (d) => { return d.x; })
		.attr("cy", (d) => { return d.y; })
		.attr("r", (d) => { return d.r; })
		.exit().remove();

	// d3.select("#walls")
	// 	.selectAll(".wall")
	// 	.data(walls)
	// 	.enter().append("line")
	// 	.attr("class", "wall")
	// 	.attr("x1", (d) => { return d.corner1.x; })
	// 	.attr("y1", (d) => { return d.corner1.y; })
	// 	.attr("x2", (d) => { return d.corner2.x; })
	// 	.attr("y2", (d) => { return d.corner2.y; })
	// 	.attr("stroke", "blue")
	// 	.attr("stroke-width", 3);

}

function previewWall() {
	// previewedWall = [{
	// 	corner1: nowCorner,
	// 	corner2: {
	// 		x: event.clientX,
	// 		y: event.clientY
	// 	}
	// }];
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
		.style("opacity", 0.5);
	d3.select("#previewWall")
		.selectAll(".wall")
		.data(previewedWall)
		.attr("x1", (d) => { return d.corner1.x; })
		.attr("y1", (d) => { return d.corner1.y; })
		.attr("x2", (d) => { return d.corner2.x; })
		.attr("y2", (d) => { return d.corner2.y; })
		.exit().remove();
}

function drawrect(d) {
	console.log(d);
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
		.style("fill", "#f0f0f0")
		.style("stroke", "#222")
		.style("stroke-width", 0.3)
		.on('click', function(d) {
			if (mode === "line") {
				drawline(d);
			} else {
				drawrect(d);
			}
		})
		.on('dbclick', () => {
			console.log("db");
		});

	grid.append("g").attr("id", "corners");
	grid.append("g").attr("id", "walls");
	grid.append("g").attr("id", "previewWall");

})();
