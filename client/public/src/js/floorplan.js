let mode = "line";
document.getElementById("add_button").addEventListener('click', () => {
	if (mode === "line") {
		mode = "rect";
		//document.getElementById("color_canvas").style.visibility = "visible";
	} else
	if (mode === "rect") {
		mode = "line";
		//document.getElementById("color_canvas").style.visibility = "hidden";
	}
});
document.getElementById("undo_button").addEventListener('click', undo);
document.getElementById("delete").addEventListener('click', () => {
	if (mode === "line") {
		deleteWall();
	}
	if (mode === "rect") {
		deleteRoom();
	}
});
$('#add_button').click(function(event) {
  let ccccc = document.getElementsByTagName("input")[0].value;
	console.log(ccccc);
});
let panel = {
    width: 1000,
    height: 500
};
let gridSize = 20;
let pre_x=1;
let pre_y=1;
let isNewRoom = false;
var rooms = [];
let corners = [];
let walls = [];
let previewedWall = [];
let steps = [];
let nowCorner = {
	id: "",
	x: 0,
	y: 0
};
let isEditing = false;
let editTarget = {
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
		x = (Math.floor(event.layerX / gridSize) + ((event.layerX % gridSize) > (gridSize / 2))) * gridSize + 1;
		y = (Math.floor(event.layerY / gridSize) + ((event.layerY % gridSize) > (gridSize / 2))) * gridSize + 1;
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
	let newStep = [];
	steps.push(newStep);

	// update lines
	if (!(nowCorner.x == 0 && nowCorner.y == 0)) {
		let newWall = {
			width: 2,
			corner1: previewedWall[0].corner1,
			corner2: newCorner
		};
		let isNewWall = true;
		walls.forEach(wall => {
			if (((wall.corner1.x == newWall.corner1.x && wall.corner1.y == newWall.corner1.y) &&
				(wall.corner2.x == newWall.corner2.x && wall.corner2.y == newWall.corner2.y)) ||
				((wall.corner1.x == newWall.corner2.x && wall.corner1.y == newWall.corner2.y) &&
				(wall.corner2.x == newWall.corner1.x && wall.corner2.y == newWall.corner1.y))) {
				isNewWall = false;
			}
		});
		if (newWall.corner1.x == newWall.corner2.x && newWall.corner1.y == newWall.corner2.y) isNewWall = false;
		if (isNewWall) {
			walls.push(Object.assign({}, newWall));
			newStep.push({
				operation: "new",
				object: "wall",
				target: newWall
			});
		}
	}
	walls = walls.map(wall => {
		wall.width = 2;
		return wall;
	});

	// update dots
	let isNewCorner = true;
	corners = corners.map(corner => {
		if (corner.x == newCorner.x && corner.y == newCorner.y) {
			if (corner.r == 4) {
				corner.r = 6;
				nowCorner.id = corner.id;
				nowCorner.x = corner.x;
				nowCorner.y = corner.y;
				document.getElementsByTagName("svg")[0].addEventListener('mousemove', previewWall);
			} else {
				corner.r = 4;
				nowCorner.id = "";
				nowCorner.x = 0;
				nowCorner.y = 0;
			}
			isNewCorner = false;
		} else {
			corner.r = 4;
		}
		return corner;
	});
	if (isNewCorner) {
		document.getElementsByTagName("svg")[0].addEventListener('mousemove', previewWall);
		nowCorner.id = newCorner.id;
		nowCorner.x = newCorner.x;
		nowCorner.y = newCorner.y;
		corners.push(newCorner);
		newStep.push({
			operation: "new",
			object: "corner",
			target: newCorner
		});
	}

	if (newStep.length == 0) steps.pop();
	render("line");
	previewWall(event);

}

function selectWall(d) {
	let index = walls.indexOf(d);
	walls = walls.map((wall, key) => {
		if (key == index) {
			if (wall.width == 4) {
				wall.width = 2;
			} else {
				wall.width = 4;
			}
		} else {
			wall.width = 2;
		}
		return wall;
	});
	render("line");
}

function previewWall(event) {
	if (nowCorner.x == 0 && nowCorner.y == 0) {
		previewedWall = [];
	} else {
		previewedWall = [{
			width: 2,
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
	isNewRoom = true;
	d3.selectAll(".square").style("fill", "#f0f0f0").attr("class","square")	// reset the class
	let color = document.getElementsByTagName("input")[0].value;
	for (let i = Math.min(d.x, pre_x); i <= Math.max(d.x, pre_x) ; i+=gridSize) {
		for (let j = Math.min(d.y, pre_y); j <= Math.max(d.y, pre_y); j+=gridSize) {
			d3.select("#"+'_'+i.toString(10)+'_'+j.toString(10))
				.style("fill", color)
				.classed('choosing', true)	// add class to recognize the chosen one
		}
	}
}

function selectRect() {
	// TODO
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
			.attr("fill", "black")
			.on('click', (d) => {
				if (isEditing) {
					isEditing = false;
					return;
				}
				drawline(d, true, false);
			})
			.on('mousedown', () => {
				startEditWall();
				let svg = document.getElementsByTagName("svg")[0];
				svg.addEventListener('mousemove', editWall);
				svg.addEventListener('mouseup', endEditWall);
			});
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
			.attr("stroke", "black")
			.attr("stroke-width", 2)
			.on('click', (d) => {
				if (isEditing) {
					isEditing = false;
					return;
				}
				if (nowCorner.x == 0 && nowCorner.y == 0) {
					selectWall(d);
				} else {
					drawline(d, false, true);
				}
			})
			.on('mousedown', () => {
				startEditWall();
				let svg = document.getElementsByTagName("svg")[0];
				svg.addEventListener('mousemove', editWall);
				svg.addEventListener('mouseup', endEditWall);
			});
		d3.select("#walls")
			.selectAll("line")
			.data(walls)
			.attr("x1", (d) => { return d.corner1.x; })
			.attr("y1", (d) => { return d.corner1.y; })
			.attr("x2", (d) => { return d.corner2.x; })
			.attr("y2", (d) => { return d.corner2.y; })
			.attr("stroke-width", (d) => { return d.width; })
			.exit().remove();
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
			.attr("stroke", "black")
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
	let lastStep = steps.pop();
	if (!lastStep) return;
	lastStep.forEach(step => {
		if (step.operation === "new") {
			if (step.object === "wall") {
				walls.pop();
			}
			if (step.object === "corner") {
				corners.pop();
			}
			if (step.object === "room") {
				deleteRoom(rooms[rooms.length-1]);
				resetRoomColor();
			}
		}
		if (step.operation === "delete") {
			if (step.object === "wall") {
				walls.splice(step.index, 0, step.target);
			}
			if (step.object === "corner") {
				corners.splice(step.index, 0, step.target);
			}
			if (step.object === "room") {
				// TODO
			}
		}
		if (step.operation === "edit") {
			if (step.object === "wall") {
				walls[step.index].corner1.x = step.before.x1;
				walls[step.index].corner1.y = step.before.y1;
				walls[step.index].corner2.x = step.before.x2;
				walls[step.index].corner2.y = step.before.y2;
			}
			if (step.object === "corner") {
				corners[step.index].x = step.before.x;
				corners[step.index].y = step.before.y;
			}
			if (step.object === "room") {
				// TODO
			}
		}
	});
	removeHighlight();
}

function resetRoomColor() {
	rooms.forEach(room => {
		let x1 = Math.min(room.start.x, room.end.x);
		let x2 = Math.max(room.start.x, room.end.x);
		let y1 = Math.min(room.start.y, room.end.y);
		let y2 = Math.max(room.start.y, room.end.y);
		for (let i = x1; i <= x2; i += gridSize) {
			for (let j = y1; j <= y2; j += gridSize) {
				d3.select("#"+'_'+i.toString(10)+'_'+j.toString(10))
					.style("fill", room.color)
			}
		}
	});
}

function deleteWall() {
	let newStep = [];
	steps.push(newStep);
	if (nowCorner.x != 0 || nowCorner.y != 0) {	// is dot
		let x = nowCorner.x;
		let y = nowCorner.y;
		nowCorner.id = "";
		nowCorner.x = 0;
		nowCorner.y = 0;
		corners = corners.map((corner, key) => {
			if (corner.x == x && corner.y == y) {
				newStep.push({
					operation: "delete",
					object: "corner",
					target: corner,
					index: key
				});
				return false;
			} else {
				return corner;
			}
		});
		let checkedCorners = [];
		walls = walls.map((wall, key) => {
			if (wall.corner1.x == x && wall.corner1.y == y) {
				checkedCorners.push(wall.corner2);
				newStep.push({
					operation: "delete",
					object: "wall",
					target: wall,
					index: key
				});
				return false;
			} else if (wall.corner2.x == x && wall.corner2.y == y) {
				checkedCorners.push(wall.corner1);
				newStep.push({
					operation: "delete",
					object: "wall",
					target: wall,
					index: key
				});
				return false;
			} else {
				return wall;
			}
		}).filter(ele => {
			return ele;
		});
		checkedCorners.forEach(corner => {
			checkCornerNotConnected(corner, newStep);
		});
		corners = corners.filter(ele => {
			return ele;
		});
		render("line");
		previewedWall = [];
		render("previewedWall");
	} else {	// is line
		let checkedCorners = [];
		walls = walls.map((wall, key) => {
			if (wall.width == 4) {
				checkedCorners.push(wall.corner1);
				checkedCorners.push(wall.corner2);
				newStep.push({
					operation: "delete",
					object: "wall",
					target: wall,
					index: key
				});
				return false;
			} else {
				return wall
			}
		}).filter(ele => {
			return ele;
		});
		checkedCorners.forEach(corner => {
			checkCornerNotConnected(corner, newStep);
		});
		corners = corners.filter(ele => {
			return ele;
		});
		render("line");
	}
	if (newStep.length == 0) steps.pop();
}

function checkCornerNotConnected(target, stepRecorder) {
	let result = true;
	walls.forEach(wall => {
		if ((wall.corner1.x == target.x && wall.corner1.y == target.y) ||
			(wall.corner2.x == target.x && wall.corner2.y == target.y)) {
			result = false;
		}
	});
	if (result) {
		corners = corners.map((corner, key) => {
			if (corner.x == target.x && corner.y == target.y) {
				stepRecorder.push({
					operation: "delete",
					object: "corner",
					target: corner,
					index: key
				});
				if (stepRecorder[0].object === "corner" && stepRecorder[0].index > key) {
					stepRecorder[0].index--;
				}
				return false;
			} else {
				return corner;
			}
		});
	}
}

function startEditWall() {
	let newStep = [];
	steps.push(newStep);
	let x = (Math.floor(event.layerX / gridSize) + ((event.layerX % gridSize) > (gridSize / 2))) * gridSize + 1;
	let y = (Math.floor(event.layerY / gridSize) + ((event.layerY % gridSize) > (gridSize / 2))) * gridSize + 1;
	let index = -1;
	corners.forEach((corner, key) => {
		if (corner.x == x && corner.y == y && corner.r != 6) {
			if (event.target.className.baseVal === "wall") {
				if ((event.target.x1.baseVal.value == x && event.target.y1.baseVal.value == y) ||
					(event.target.x2.baseVal.value == x && event.target.y2.baseVal.value == y)) {
					index = key;
				}
			} else {
				index = key;
			}
		}
	});
	if (index != -1) {
		newStep.push({
			operation: "edit",
			object: "corner",
			before: {
				x: x,
				y: y
			},
			after: {
				x: x,
				y: y
			},
			index: index
		});
		walls.forEach((wall, key) => {
			if ((wall.corner1.x == x && wall.corner1.y == y) ||
				(wall.corner2.x == x && wall.corner2.y == y)) {
				newStep.push({
					operation: "edit",
					object: "wall",
					before: {
						x1: wall.corner1.x,
						y1: wall.corner1.y,
						x2: wall.corner2.x,
						y2: wall.corner2.y
					},
					after: {
						x1: wall.corner1.x,
						y1: wall.corner1.y,
						x2: wall.corner2.x,
						y2: wall.corner2.y
					},
					index: key
				});
			}
		});
		editTarget = {
			x: x,
			y: y
		};
	}
}

function editWall() {
	isEditing = true;
	removeHighlight();
	let stepRecorder = steps[steps.length-1];
	let x = (Math.floor(event.layerX / gridSize) + ((event.layerX % gridSize) > (gridSize / 2))) * gridSize + 1;
	let y = (Math.floor(event.layerY / gridSize) + ((event.layerY % gridSize) > (gridSize / 2))) * gridSize + 1;
	stepRecorder.forEach(step => {
		if (step.operation === "edit") {
			if (step.object === "corner") {
				step.after.x = x;
				step.after.y = y;
				corners[step.index].x = x;
				corners[step.index].y = y;
			}
			if (step.object === "wall") {
				if (step.after.x1 == editTarget.x && step.after.y1 == editTarget.y) {
					step.after.x1 = x;
					step.after.y1 = y;
					walls[step.index].corner1.x = x;
					walls[step.index].corner1.y = y;
				} else {
					step.after.x2 = x;
					step.after.y2 = y;
					walls[step.index].corner2.x = x;
					walls[step.index].corner2.y = y;
				}
			}
		}
	});
	editTarget.x = x;
	editTarget.y = y;
	render("line");
}

function endEditWall() {
	let svg = document.getElementsByTagName("svg")[0];
	svg.removeEventListener('mousemove', editWall);
	svg.removeEventListener('mouseup', endEditWall);
	let stepRecorder = steps[steps.length-1];
	if (stepRecorder.length == 0 || JSON.stringify(stepRecorder[0].before) === JSON.stringify(stepRecorder[0].after)) {
		steps.pop();
	} else {
		removeHighlight();
	}
}

function deleteRoom(room) {
	let x1 = Math.min(room.start.x, room.end.x);
	let x2 = Math.max(room.start.x, room.end.x);
	let y1 = Math.min(room.start.y, room.end.y);
	let y2 = Math.max(room.start.y, room.end.y);
	for (let i = x1; i <= x2; i += gridSize) {
		for (let j = y1; j <= y2; j += gridSize) {
			d3.select("#"+'_'+i.toString(10)+'_'+j.toString(10))
				.attr("class", "square")
				.style("fill", "#f0f0f0")
		}
	}
	rooms.splice(rooms.indexOf(room), 1);
	console.log(rooms)
}

function removeHighlight() {
	corners = corners.map(corner => {
		corner.r = 4;
		return corner;
	});
	walls = walls.map(wall => {
		wall.width = 2;
		return wall;
	});
	nowCorner.id = "";
	nowCorner.x = 0;
	nowCorner.y = 0;
	previewedWall = [];
	render("line");
	render("previewedWall");
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
		.attr("width", panel.width+2)
		.style("border-radius","30px")
		.attr("height", panel.height+2);

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
		.style("stroke", "#B3AFAF")
		.style("stroke-width", 0.3)
		.on('click', function(d) {
			if (mode === "line") {
				drawline(d, false, false);
			}
		}).on('mousedown', function(d) {
			if (mode === "rect"){
				pre_x = (Math.floor(event.layerX / gridSize)) * gridSize + 1;
				pre_y = (Math.floor(event.layerY / gridSize)) * gridSize + 1;
				column.on('mousemove', drawrect);
			}
	   	})
		.on('mouseup',function(d){
			if (mode === "rect"){
				column.on('mousemove', null);
				if (isNewRoom) {
					row.selectAll(".choosing")
						.attr("class", "room")
						.classed('chosen',true)
					rooms.push({
						color: document.getElementsByTagName("input")[0].value,
						start: {
							x: pre_x,
							y: pre_y
						},
						end: {
							x: d.x,
							y: d.y
						}
					});
					steps.push([{
						operation: "new",
						object: "room",
						value: Object.assign({}, rooms[rooms.length-1])
					}]);
					isNewRoom = false;
				}
			}
		});

	grid.append("g").attr("id", "corners");
	grid.append("g").attr("id", "walls");
	grid.append("g").attr("id", "previewWall");

})();
