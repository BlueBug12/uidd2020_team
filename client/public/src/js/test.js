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

let activate = false;
let corners = [];
let walls = [];
let nowCorner = "";

function drawline(d) {
	console.log(d);

	let newCorner = {
		id: Math.random().toString(36).slice(-8),
		x: d.x,
		y: d.y,
		r: 5
	};
	corners = corners.map(corner => {
		if (corner.x == newCorner.x && corner.y == newCorner.y) {
			return false;
		} else {
			corner.r = 4;
			return corner;
		}
	}).filter(ele => {
		return ele;
	});
	corners.push(newCorner);
	nowCorner = newCorner.id;

	if (!activate) {
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
			.exit().remove();
		d3.select("#corners")
			.selectAll("circle")
			.data(corners)
			.attr("cx", (d) => { return d.x; })
			.attr("cy", (d) => { return d.y; })
			.attr("r", (d) => { return d.r; })
			.exit().remove();
		// activate = true;
	} else {

	}
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
		var width = 20;
		var height = 20;
		
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
		.attr("width", panel.width+10)
		.attr("height", panel.height+10);
		
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
		});

	grid.append("g").attr("id", "corners");
	grid.append("g").attr("id", "walls");

})();
