let mode = "line";

document.getElementById("draw_map").addEventListener('click', () => {
	$("#place_furnish_mode").css({"visibility":"hidden", "height": 0});
	$("#draw_map_mode").css({"visibility":"visible", "height": "100%"});
	$('#place_furnish').css({"opacity": 0.5});
	$('#draw_map').css({"opacity": 1});

});
document.getElementById("place_furnish").addEventListener('click', () => {
	$("#draw_map_mode").css({"visibility":"hidden", "height": 0});
	$("#place_furnish_mode").css({"visibility":"visible", "height": "100%"});
	$('#place_furnish').css({"opacity": 1});
	$('#draw_map').css({"opacity": 0.5});
});

document.getElementById("add_button").addEventListener('click', () => {
	if(mode==='line'){
		mode='rect';
	}
});
document.getElementById("pen_button").addEventListener('click', () => {
	if(mode==='rect'){
		mode='line';
		$('#pen').css('background-color', "transparent");
	}
});
document.getElementById("undo_button").addEventListener('click', undo);
document.getElementById("delete").addEventListener('click', () => {
	if (!nowRoom) {
		deleteWall();
	} else {
		steps.push([{
			operation: "delete",
			object: "room",
			index: rooms.indexOf(nowRoom),
			value: Object.assign({}, nowRoom)
		}]);
		deleteRoom(nowRoom);
	}
});

// let furnishIcons = document.getElementsByClassName("item_margin");
// for (let iter = 0; iter < furnishIcons.length; ++iter) {
// 	furnishIcons[iter].addEventListener('mousedown', () => {
// 		isAddingFurnish = true;
// 		document.addEventListener('mouseup', endMoveFurnish);
// 	});
// };
// document.addEventListener('mousemove', () => {
// 	if (isAddingFurnish) {
// 		moveFurnish();
// 	}
// });

let panel = {
    width: 1100,
    height: 520
};
let gridSize = 20;
let pre_x=1;
let pre_y=1;
let isNewRoom = false;
var rooms = [];
let previewedRoom = [];
let corners = [];
let walls = [];
let previewedWall = [];
let steps = [];
let current_color;
let room_counter=2;
let nowCorner = {
	id: "",
	x: 0,
	y: 0
};
let nowRoom = null;
let isEditing = false;
let editTarget = {
	x: 0,
	y: 0
};
let items = [];

var circles=document.getElementsByClassName("round");
for(let i=0;i<circles.length;++i){
	circles[i].addEventListener('click', () => {
		let color=window.getComputedStyle(circles[i], null).getPropertyValue("background-color");
		console.log(color);
		$('#pen').css('background-color', color);
		mode="rect";
		current_color=color;
	});
}

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
			walls[walls.length-1].corner2.id = corner.id;
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
	removeRoomHighlight();

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
	removeRoomHighlight();
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
	d3.selectAll(".square").style("fill", "#f0f0f0").attr("class","square");	// reset the class
	let color = current_color;
	for (let i = Math.min(d.x, pre_x); i <= Math.max(d.x, pre_x) ; i+=gridSize) {
		for (let j = Math.min(d.y, pre_y); j <= Math.max(d.y, pre_y); j+=gridSize) {
			d3.select("#"+'_'+i.toString(10)+'_'+j.toString(10))
				.style("fill", color)
				.classed('choosing', true)	// add class to recognize the chosen one
		}
	}
}

function selectRoom(d) {
	removeHighlight();
	rooms.forEach(room => {
		if (((room.start.x <= d.x && room.end.x >= d.x) || (room.start.x >= d.x && room.end.x <= d.x)) &&
			((room.start.y <= d.y && room.end.y >= d.y) || (room.start.y >= d.y && room.end.y <= d.y))) {
			nowRoom = room;
		}
	});
	let x1 = Math.min(nowRoom.start.x, nowRoom.end.x);
	let x2 = Math.max(nowRoom.start.x, nowRoom.end.x) + gridSize;
	let y1 = Math.min(nowRoom.start.y, nowRoom.end.y);
	let y2 = Math.max(nowRoom.start.y, nowRoom.end.y) + gridSize;
	if (previewedRoom.length == 0) {
		previewRoom(x1, x2, y1, y2);
	} else {
		if (previewedRoom[0].corner1.x == x1 && previewedRoom[0].corner1.y == y1 &&
			previewedRoom[2].corner1.x == x2 && previewedRoom[2].corner1.y == y2) {
			removeRoomHighlight();
		} else {
			previewedRoom = [];
			previewRoom(x1, x2, y1, y2);
		}
	}
	render("previewedRoom");
}

function previewRoom(x1, x2, y1, y2) {
	previewedRoom.push({
		corner1: {
			x: x1,
			y: y1
		},
		corner2: {
			x: x1,
			y: y2
		}
	});
	previewedRoom.push({
		corner1: {
			x: x1,
			y: y1
		},
		corner2: {
			x: x2,
			y: y1
		}
	});
	previewedRoom.push({
		corner1: {
			x: x2,
			y: y2
		},
		corner2: {
			x: x1,
			y: y2
		}
	});
	previewedRoom.push({
		corner1: {
			x: x2,
			y: y2
		},
		corner2: {
			x: x2,
			y: y1
		}
	});
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
	if (type === "previewedRoom") {
		d3.select("#previewRoom")
			.selectAll(".border")
			.data(previewedRoom)
			.enter().append("line")
			.attr("class", "border")
			.attr("x1", (d) => { return d.corner1.x; })
			.attr("y1", (d) => { return d.corner1.y; })
			.attr("x2", (d) => { return d.corner2.x; })
			.attr("y2", (d) => { return d.corner2.y; })
			.attr("stroke", "blue")
			.attr("stroke-width", 2);
		d3.select("#previewRoom")
			.selectAll(".border")
			.data(previewedRoom)
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
				rooms.splice(step.index, 0, step.value);
				resetRoomColor();
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
	removeRoomHighlight();
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
					.attr("class", "room")
					.style("fill", room.color);
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
	removeRoomHighlight();
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
		removeRoomHighlight();
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
	resetRoomColor();
	removeRoomHighlight();
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

function removeRoomHighlight() {
	nowRoom = null;
	previewedRoom = [];
	render("previewedRoom");
}

function moveFurnish() {

}

function endMoveFurnish() {
	isAddingFurnish = false;
	document.removeEventListener('mouseup', endMoveFurnish);
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
				if (document.getElementById(`_${d.x}_${d.y}`).classList.contains("room")) {
					selectRoom(d);
				} else {
					drawline(d, false, false);
				}
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
						color: current_color,
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
	grid.append("g").attr("id", "previewRoom");

})();



var colorList = [ '000000', '993300', '333300', '003300', '003366', '000066', '333399', '333333',
'660000', 'FF6633', '666633', '336633', '336666', '0066FF', '666699', '666666', 'CC3333', 'FF9933', '99CC33', '669966', '66CCCC', '3366FF', '663366', '999999', 'CC66FF', 'FFCC33', 'FFFF66', '99FF66', '99CCCC', '66CCFF', '993366', 'CCCCCC', 'FF99CC', 'FFCC99', 'FFFF99', 'CCffCC', 'CCFFff', '99CCFF', 'CC99FF', 'FFFFFF' ];
var picker = $('#color-picker');

for (var i = 0; i < colorList.length; i++ ) {
	picker.append('<li class="color-item" data-hex="' + '#' + colorList[i] + '" style="background-color:' + '#' + colorList[i] + ';"></li>');
}
/*
$('body').click(function () {
	picker.fadeOut();
});*/

$('#add_button').click(function(event) {

	event.stopPropagation();
	picker.fadeIn();

	picker.children('li').click(function(e) {
		var codeHex = $(this).data('hex');

		//$('.color-holder').css('background-color', codeHex);
		$('#pickcolor').val(codeHex);
		$('#pen').css('background-color', codeHex);
		current_color=codeHex;
		picker.fadeOut();
		e.stopImmediatePropagation();
		e.preventDefault();
		$('#color_list').append(`<li class=\"round \" style=\" background-color:${codeHex}\"><div class=\"input_container\"><input type=\"text\" id=\"text_in1\"class=\"awsome_input\" placeholder=\"room_${room_counter}\"/><span class=\"awsome_input_border\"/></div></li>`);
		updateScroll();
		room_counter+=1;
		var circles=document.getElementsByClassName("round");
		for(let i=0;i<circles.length;++i){
			circles[i].addEventListener('click', () => {
				let color=window.getComputedStyle(circles[i], null).getPropertyValue("background-color");
				console.log(color);
				$('#pen').css('background-color', color);
				mode="rect";
				current_color=color;
			});
		}

	});
});
//
function updateScroll(){
    var element = document.getElementById("color");
    element.scrollTop = element.scrollHeight;
}

/*
$('#add_button').click(function(event) {
let ccccc = document.getElementsByTagName("input")[0].value;
});
*/

document.getElementById("submit").addEventListener('click', async () => {
	corners.forEach(corner => {
		delete corner.r;
	});
	walls.forEach(wall => {
		delete wall.width;
		delete wall.corner2.r;
	});
	let result = {
		account: "test",
		// account: localStorage.getItem("account"),
		floorplan: {
			corners: corners,
			walls: walls,
			rooms: rooms,
			items: items
		}
	};
	console.log(result)
	let response = await fetch('/saveFloorplan', {
		body: JSON.stringify(result),
		headers: {
			"Content-Type": "application/json"
		},
		method: 'POST'
	}).then(res => {
		return res.json();
	});
	if (response.isSuccess) {
		location.href = './game.html';
	}
})

async function getUser() {
    var account = localStorage.getItem("account");
    await $.get('./users/'+account, {}, (res) => {
        document.getElementById("UserImg").src = res.icon;
    });
}
