let mode = ["line"];

document.getElementById("draw_map").addEventListener('click', () => {
	$("#place_furnish_mode").css({"visibility":"hidden", "height": 0});
	$("#draw_map_mode").css({"visibility":"visible", "height": "100%"});
	$('#place_furnish').css({"opacity": 0.5});
	$('#draw_map').css({"opacity": 1});

});
document.getElementById("place_furnish").addEventListener('click', () => {
	picker.fadeOut();
	$("#draw_map_mode").css({"visibility":"hidden", "height": 0});
	$("#place_furnish_mode").css({"visibility":"visible", "height": "100%"});
	$('#place_furnish').css({"opacity": 1});
	$('#draw_map').css({"opacity": 0.5});
});
/*
document.getElementById("add_button").addEventListener('click', () => {
	if(mode==='line'){
		mode='rect';
	}
});*/
document.getElementById("pen_button").addEventListener('click', () => {
	if(mode[current_floor]==='rect'&& new_room[current_floor]!=1){
		mode[current_floor]='line';
		$('#pen').css('background-color', "transparent");
		picker.fadeOut();
	}
});


document.getElementById("undo_button").addEventListener('click', undo);
document.getElementById("delete").addEventListener('click', () => {
	if (!nowRoom) {
		deleteWall();
	} else {
		steps[current_floor].push([{
			operation: "delete",
			object: "room",
			index: rooms[current_floor].indexOf(nowRoom),
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

let current_floor=0;


let isNewRoom = [false];
var rooms = [[]];//rooms.push([]);
let previewedRoom = [[]];
let corners = [[]];
let walls = [[]];//console.log(walls);
let previewedWall = [[]];
let steps = [[]];
let current_color = ["#fff"];
let room_id=[1];
let room_counter=[2];
let tempCorner = {
	id: "",
	x: 0,
	y: 0
};
let nowCorner=[tempCorner];
let nowRoom = null;
let isEditing = [false];
let tempTarget = {
	x: 0,
	y: 0
};
let editTarget=[tempTarget];
let items = [[]];

let new_room=[1];
let circle_id;

$(document).on('click','.round',function(){
	mode[current_floor]='rect';
	new_room[current_floor]=0;
	picker.fadeOut();
	current_color[current_floor] = $(this).css("backgroundColor");
	$('#pen').css('background-color', current_color[current_floor]);
	mode[current_floor]="rect";

	circle_id=$(this).attr('id');
	room_id[current_floor]=parseInt(circle_id.slice(2,circle_id.length),10);
	event.stopPropagation();
	picker.fadeIn();
});
$(document).on('mousedown','#svg_canvas',function(){
	picker.fadeOut();
});

$(document).on('click','#add_floor_button',function(){
	d3.selectAll(".chosen").attr("class", "square").style("fill", "#f0f0f0")
	current_floor+=1;
	if(mode.length<=current_floor){//if it's new floor, append the data
		mode.push("line");
		rooms.push([]);
		previewedRoom.push([]);
		corners.push([]);
		walls.push([]);
		previewedWall.push([]);
		//console.log(previewedWall);
		steps.push([]);
		current_color.push("#fff");
		room_id.push(1);
		room_counter.push(2);
		isEditing.push(false);
		editTarget.push(tempTarget);
		nowCorner.push(tempCorner);
		items.push([]);
		new_room.push(1);
		render("line");
		render("previewedWall");
		//render("previewedRoom");
	}
	else{
		//recover floor
		render("line");
		render("previewedWall");
		recoverRoom(current_floor);
	}
	console.log(rooms);
});
$(document).on('click','#sub_floor_button',function(){

	if(current_floor>0){
		d3.selectAll(".chosen").attr("class", "square").style("fill", "#f0f0f0");
		current_floor-=1;
		//console.log(rooms);
		render("line");
		render("previewedWall");
		recoverRoom(current_floor);
		//render("previewedRoom");
	}
});
$(document).on('click','.color-item',function(e){
	mode[current_floor]='rect';
	var codeHex = $(this).css("backgroundColor");//.data('hex');
	current_color[current_floor]=codeHex;
	$('#pickcolor').val(codeHex);
	$('#pen').css('background-color', codeHex);
	picker.fadeOut();
	if(new_room[current_floor]===1){
		room_id[current_floor]=room_counter[current_floor];
		$('#color_list').append(`<li class=\"round \" id = \"c_${room_counter[current_floor]}\"style=\" background-color:${codeHex}\"><div class=\"input_container\"><input type=\"text\" id=\"text_in1\"class=\"awsome_input\" placeholder=\"room_${room_counter[current_floor]}\"/><span class=\"awsome_input_border\" id=\"b_${room_counter[current_floor]}\" style=\"background:${codeHex}\"/></div></li>`);
		updateScroll();
		room_counter[current_floor]+=1;
	}
	else{//change existed room color
		$('#'+circle_id).css('background-color', codeHex);
		$('#b_'+room_id[current_floor]).css('background',codeHex);
		room_id[current_floor]=parseInt(circle_id.slice(2,circle_id.length),10);
		//console.log('#room_'+room_id);
		d3.selectAll('.room_'+room_id[current_floor])
			.style("fill", codeHex)

		rooms[current_floor].forEach(room => {
			if(room.id==room_id[current_floor]){
				room.color=codeHex;
			}
		});
	}
});
function recoverRoom(f){
	rooms[f].forEach(room => {
		for (let i = Math.min(room.start.x, room.end.x); i <= Math.max(room.start.x, room.end.x) ; i+=gridSize) {
			for (let j = Math.min(room.start.y, room.end.y); j <= Math.max(room.start.y, room.end.y); j+=gridSize) {
				d3.selectAll("#"+'_'+i.toString(10)+'_'+j.toString(10)+':not(.chosen)')
					.style("fill", room.color)
					.classed('choosing', true)	// add class to recognize the chosen one
					.classed('chosen',true)
			}
		}
	});
}
function drawline(d, isDot, isLine) {

	document.getElementsByTagName("svg")[0].removeEventListener('mousemove', previewWall);
	//console.log(d);
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
	steps[current_floor].push(newStep);

	// update lines
	if (!(nowCorner[current_floor].x == 0 && nowCorner[current_floor].y == 0)) {
		let newWall = {
			width: 2,
			corner1: previewedWall[current_floor][0].corner1,
			corner2: newCorner
		};
		let isNewWall = true;

		walls[current_floor].forEach(wall => {
			if (((wall.corner1.x == newWall.corner1.x && wall.corner1.y == newWall.corner1.y) &&
				(wall.corner2.x == newWall.corner2.x && wall.corner2.y == newWall.corner2.y)) ||
				((wall.corner1.x == newWall.corner2.x && wall.corner1.y == newWall.corner2.y) &&
				(wall.corner2.x == newWall.corner1.x && wall.corner2.y == newWall.corner1.y))) {
				isNewWall = false;
			}
		});
		//console.log("add wall");
		if (newWall.corner1.x == newWall.corner2.x && newWall.corner1.y == newWall.corner2.y) isNewWall = false;
		if (isNewWall) {
			//console.log("add wall");
			walls[current_floor].push(Object.assign({}, newWall));
			newStep.push({
				operation: "new",
				object: "wall",
				target: newWall
			});
		}
	}

	walls[current_floor] = walls[current_floor].map(wall => {
		wall.width = 2;
		return wall;
	});

	// update dots
	let isNewCorner = true;
	corners[current_floor] = corners[current_floor].map(corner => {
		if (corner.x == newCorner.x && corner.y == newCorner.y) {
			if (corner.r == 4) {
				corner.r = 6;
				nowCorner[current_floor].id = corner.id;
				nowCorner[current_floor].x = corner.x;
				nowCorner[current_floor].y = corner.y;
				document.getElementsByTagName("svg")[0].addEventListener('mousemove', previewWall);
			} else {
				corner.r = 4;
				nowCorner[current_floor].id = "";
				nowCorner[current_floor].x = 0;
				nowCorner[current_floor].y = 0;
			}
			walls[current_floor][walls[current_floor].length-1].corner2.id = corner.id;
			isNewCorner = false;
		} else {
			corner.r = 4;
		}
		return corner;
	});
	if (isNewCorner) {
		document.getElementsByTagName("svg")[0].addEventListener('mousemove', previewWall);
		nowCorner[current_floor].id = newCorner.id;
		nowCorner[current_floor].x = newCorner.x;
		nowCorner[current_floor].y = newCorner.y;
		corners[current_floor].push(newCorner);
		newStep.push({
			operation: "new",
			object: "corner",
			target: newCorner
		});
	}

	if (newStep.length == 0) steps[current_floor].pop();
	render("line");
	previewWall(event);
	removeRoomHighlight();

}

function selectWall(d) {
	let index = walls[current_floor].indexOf(d);
	walls[current_floor] = walls[current_floor].map((wall, key) => {
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
	if (nowCorner[current_floor].x == 0 && nowCorner[current_floor].y == 0) {
		previewedWall[current_floor] = [];
	} else {
		previewedWall[current_floor] = [{
			width: 2,
			corner1: Object.assign({}, nowCorner[current_floor]),
			corner2: {
				x: event.layerX,
				y: event.layerY
			}
		}];
	}
	render("previewedWall");
}
//let area=0;
function drawrect(d) {
	isNewRoom[current_floor] = true;
	d3.selectAll(".square").style("fill", "#f0f0f0").attr("class","square");	// reset the class
	let color = current_color[current_floor];
	for (let i = Math.min(d.x, pre_x); i <= Math.max(d.x, pre_x) ; i+=gridSize) {
		for (let j = Math.min(d.y, pre_y); j <= Math.max(d.y, pre_y); j+=gridSize) {
			d3.selectAll("#"+'_'+i.toString(10)+'_'+j.toString(10)+':not(.chosen)')
				.style("fill", color)
				.classed('choosing', true)	// add class to recognize the chosen one

		}
	}
	//area=(Math.max(d.x, pre_x)-Math.min(d.x, pre_x))*(Math.max(d.x, pre_x)-Math.min(d.y, pre_y))
	//console.log(area);
}

function selectRoom(d) {
	removeHighlight();
	rooms[current_floor].forEach(room => {
		if (((room.start.x <= d.x && room.end.x >= d.x) || (room.start.x >= d.x && room.end.x <= d.x)) &&
			((room.start.y <= d.y && room.end.y >= d.y) || (room.start.y >= d.y && room.end.y <= d.y))) {
			nowRoom = room;
		}
	});
	let x1 = Math.min(nowRoom.start.x, nowRoom.end.x);
	let x2 = Math.max(nowRoom.start.x, nowRoom.end.x) + gridSize;
	let y1 = Math.min(nowRoom.start.y, nowRoom.end.y);
	let y2 = Math.max(nowRoom.start.y, nowRoom.end.y) + gridSize;
	if (previewedRoom[current_floor].length == 0) {
		previewRoom(x1, x2, y1, y2);
	} else {
		if (previewedRoom[current_floor][0].corner1.x == x1 && previewedRoom[current_floor][0].corner1.y == y1 &&
			previewedRoom[current_floor][2].corner1.x == x2 && previewedRoom[current_floor][2].corner1.y == y2) {
			removeRoomHighlight();
		} else {
			previewedRoom[current_floor] = [];
			previewRoom(x1, x2, y1, y2);
		}
	}
	render("previewedRoom");
}

function previewRoom(x1, x2, y1, y2) {
	previewedRoom[current_floor].push({
		corner1: {
			x: x1,
			y: y1
		},
		corner2: {
			x: x1,
			y: y2
		}
	});
	previewedRoom[current_floor].push({
		corner1: {
			x: x1,
			y: y1
		},
		corner2: {
			x: x2,
			y: y1
		}
	});
	previewedRoom[current_floor].push({
		corner1: {
			x: x2,
			y: y2
		},
		corner2: {
			x: x1,
			y: y2
		}
	});
	previewedRoom[current_floor].push({
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
			.data(corners[current_floor])
			.enter().append("circle")
			.attr("class", "corner")
			.attr("cx", (d) => { return d.x; })
			.attr("cy", (d) => { return d.y; })
			.attr("r", (d) => { return d.r; })
			.attr("stroke-width", 0)
			.attr("fill", "black")
			.on('click', (d) => {
				if (isEditing[current_floor]) {
					isEditing[current_floor] = false;
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
			.data(corners[current_floor])
			.attr("cx", (d) => { return d.x; })
			.attr("cy", (d) => { return d.y; })
			.attr("r", (d) => { return d.r; })
			.exit().remove();

		d3.select("#walls")
			.selectAll(".wall")
			.data(walls[current_floor])
			.enter().append("line")
			.attr("class", "wall")
			.attr("x1", (d) => { return d.corner1.x; })
			.attr("y1", (d) => { return d.corner1.y; })
			.attr("x2", (d) => { return d.corner2.x; })
			.attr("y2", (d) => { return d.corner2.y; })
			.attr("stroke", "black")
			.attr("stroke-width", 2)
			.on('click', (d) => {
				if (isEditing[current_floor]) {
					isEditing[current_floor] = false;
					return;
				}
				if (nowCorner[current_floor].x == 0 && nowCorner[current_floor].y == 0) {
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
			.data(walls[current_floor])
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
			.data(previewedWall[current_floor])
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
			.data(previewedWall[current_floor])
			.attr("x1", (d) => { return d.corner1.x; })
			.attr("y1", (d) => { return d.corner1.y; })
			.attr("x2", (d) => { return d.corner2.x; })
			.attr("y2", (d) => { return d.corner2.y; })
			.exit().remove();
	}
	if (type === "previewedRoom") {
		d3.select("#previewRoom")
			.selectAll(".border")
			.data(previewedRoom[current_floor])
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
			.data(previewedRoom[current_floor])
			.attr("x1", (d) => { return d.corner1.x; })
			.attr("y1", (d) => { return d.corner1.y; })
			.attr("x2", (d) => { return d.corner2.x; })
			.attr("y2", (d) => { return d.corner2.y; })
			.exit().remove();
	}
}

function undo() {
	let lastStep = steps[current_floor].pop();
	if (!lastStep) return;
	lastStep.forEach(step => {
		if (step.operation === "new") {
			if (step.object === "wall") {
				walls[current_floor].pop();
			}
			if (step.object === "corner") {
				corners[current_floor].pop();
			}
			if (step.object === "room") {
				deleteRoom(rooms[current_floor][rooms.length-1]);
			}
		}
		if (step.operation === "delete") {
			if (step.object === "wall") {
				walls[current_floor].splice(step.index, 0, step.target);
			}
			if (step.object === "corner") {
				corners[current_floor].splice(step.index, 0, step.target);
			}
			if (step.object === "room") {
				rooms[current_floor].splice(step.index, 0, step.value);
				resetRoomColor();
			}
		}
		if (step.operation === "edit") {
			if (step.object === "wall") {
				walls[current_floor][step.index].corner1.x = step.before.x1;
				walls[current_floor][step.index].corner1.y = step.before.y1;
				walls[current_floor][step.index].corner2.x = step.before.x2;
				walls[current_floor][step.index].corner2.y = step.before.y2;
			}
			if (step.object === "corner") {
				corners[current_floor][step.index].x = step.before.x;
				corners[current_floor][step.index].y = step.before.y;
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
	rooms[current_floor].forEach(room => {
		let x1 = Math.min(room.start.x, room.end.x);
		let x2 = Math.max(room.start.x, room.end.x);
		let y1 = Math.min(room.start.y, room.end.y);
		let y2 = Math.max(room.start.y, room.end.y);
		for (let i = x1; i <= x2; i += gridSize) {
			for (let j = y1; j <= y2; j += gridSize) {
				d3.select("#"+'_'+i.toString(10)+'_'+j.toString(10))
					.attr("class", "chosen room_"+room.id)
					.style("fill", room.color);
			}
		}
	});
}

function deleteWall() {
	let newStep = [];
	steps[current_floor].push(newStep);
	if (nowCorner[current_floor].x != 0 || nowCorner[current_floor].y != 0) {	// is dot
		let x = nowCorner[current_floor].x;
		let y = nowCorner[current_floor].y;
		nowCorner[current_floor].id = "";
		nowCorner[current_floor].x = 0;
		nowCorner[current_floor].y = 0;
		corners[current_floor] = corners[current_floor].map((corner, key) => {
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
		walls[current_floor] = walls[current_floor].map((wall, key) => {
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
		corners[current_floor] = corners[current_floor].filter(ele => {
			return ele;
		});
		render("line");
		previewedWall[current_floor] = [];
		render("previewedWall");
	} else {	// is line
		let checkedCorners = [];
		walls[current_floor] = walls[current_floor].map((wall, key) => {
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
		corners[current_floor] = corners[current_floor].filter(ele => {
			return ele;
		});
		render("line");
	}
	if (newStep.length == 0) steps[current_floor].pop();
}

function checkCornerNotConnected(target, stepRecorder) {
	let result = true;
	walls[current_floor].forEach(wall => {
		if ((wall.corner1.x == target.x && wall.corner1.y == target.y) ||
			(wall.corner2.x == target.x && wall.corner2.y == target.y)) {
			result = false;
		}
	});
	if (result) {
		corners[current_floor] = corners[current_floor].map((corner, key) => {
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
	steps[current_floor].push(newStep);
	let x = (Math.floor(event.layerX / gridSize) + ((event.layerX % gridSize) > (gridSize / 2))) * gridSize + 1;
	let y = (Math.floor(event.layerY / gridSize) + ((event.layerY % gridSize) > (gridSize / 2))) * gridSize + 1;
	let index = -1;
	corners[current_floor].forEach((corner, key) => {
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
		walls[current_floor].forEach((wall, key) => {
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
		editTarget[current_floor] = {
			x: x,
			y: y
		};
	}
}

function editWall() {
	isEditing[current_floor] = true;
	removeHighlight();
	removeRoomHighlight();
	let stepRecorder = steps[current_floor][steps[current_floor].length-1];
	let x = (Math.floor(event.layerX / gridSize) + ((event.layerX % gridSize) > (gridSize / 2))) * gridSize + 1;
	let y = (Math.floor(event.layerY / gridSize) + ((event.layerY % gridSize) > (gridSize / 2))) * gridSize + 1;
	stepRecorder.forEach(step => {
		if (step.operation === "edit") {
			if (step.object === "corner") {
				step.after.x = x;
				step.after.y = y;
				corners[current_floor][step.index].x = x;
				corners[current_floor][step.index].y = y;
			}
			if (step.object === "wall") {
				if (step.after.x1 == editTarget[current_floor].x && step.after.y1 == editTarget[current_floor].y) {
					step.after.x1 = x;
					step.after.y1 = y;
					walls[current_floor][step.index].corner1.x = x;
					walls[current_floor][step.index].corner1.y = y;
				} else {
					step.after.x2 = x;
					step.after.y2 = y;
					walls[current_floor][step.index].corner2.x = x;
					walls[current_floor][step.index].corner2.y = y;
				}
			}
		}
	});
	editTarget[current_floor].x = x;
	editTarget[current_floor].y = y;
	render("line");
}

function endEditWall() {
	let svg = document.getElementsByTagName("svg")[0];
	svg.removeEventListener('mousemove', editWall);
	svg.removeEventListener('mouseup', endEditWall);
	let stepRecorder = steps[current_floor][steps[current_floor].length-1];
	if (stepRecorder.length == 0 || JSON.stringify(stepRecorder[0].before) === JSON.stringify(stepRecorder[0].after)) {
		steps[current_floor].pop();
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
	rooms[current_floor].splice(rooms[current_floor].indexOf(room), 1);
	resetRoomColor();
	removeRoomHighlight();
}

function removeHighlight() {
	corners[current_floor] = corners[current_floor].map(corner => {
		corner.r = 4;
		return corner;
	});
	walls[current_floor] = walls[current_floor].map(wall => {
		wall.width = 2;
		return wall;
	});
	nowCorner[current_floor].id = "";
	nowCorner[current_floor].x = 0;
	nowCorner[current_floor].y = 0;
	previewedWall[current_floor] = [];
	render("line");
	render("previewedWall");
}

function removeRoomHighlight() {
	nowRoom = null;
	previewedRoom[current_floor] = [];
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
		.attr('id',"svg_canvas")
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

			if (mode[current_floor] === "line") {
				if (document.getElementById(`_${d.x}_${d.y}`).classList.contains("chosen")) {//room_*
					selectRoom(d);
				} else {
					//console.log(d);
					drawline(d, false, false);
				}
			}
		}).on('mousedown', function(d) {
			if (mode[current_floor] === "rect"){
				pre_x = (Math.floor(event.layerX / gridSize)) * gridSize + 1;
				pre_y = (Math.floor(event.layerY / gridSize)) * gridSize + 1;
				column.on('mousemove', drawrect);
			}
	   	})
		.on('mouseup',function(d){
			let grid_number=((Math.max(d.x, pre_x)-Math.min(d.x, pre_x))/20+1)*((Math.max(d.y, pre_y)-Math.min(d.y, pre_y))/20+1);
			let temp_chosen=d3.selectAll(".choosing");
			//console.log(temp_chosen._groups[0].length);
			if(temp_chosen._groups[0].length!=grid_number){
				console.log("overlapping!");
				temp_chosen.attr("class","square").style("fill", "#f0f0f0");
				column.on('mousemove', null);
				new_room[current_floor]=0;
				isNewRoom[current_floor] = false;
				//if(mode==='rect'&& new_room!=1){
			}else{
				if (mode[current_floor] === "rect"){
					column.on('mousemove', null);
					if (isNewRoom[current_floor]) {
						row.selectAll(".choosing")
							.attr("class", "room_"+room_id[current_floor])
							.classed('chosen',true)
						rooms[current_floor].push({
							color: current_color[current_floor],
							start: {
								x: pre_x,
								y: pre_y
							},
							end: {
								x: d.x,
								y: d.y
							},
							id:room_id[current_floor]
						});

						steps[current_floor].push([{
							operation: "new",
							object: "room",
							value: Object.assign({}, rooms[current_floor][rooms[current_floor].length-1])
						}]);
						isNewRoom[current_floor] = false;
					}
				}
			}

		});

	grid.append("g").attr("id", "corners");
	grid.append("g").attr("id", "walls");
	grid.append("g").attr("id", "previewWall");
	grid.append("g").attr("id", "previewRoom");

})();



var colorList = ['F1BA9C','F5A96B','F8C780','D4C793','C7DF93','669A7D','9ED5D2','7DBEDF','C4D5D9','A889AD','D788AD','A9A696',
								 'D57456','E0742D','EBAB4B','A1986E','81863A','365545','388185','0F4867','384851','715D75','4F3239','696758']
var picker = $('#color-picker');

for (var i = 0; i < colorList.length; i++ ) {
	picker.append('<li class="color-item" data-hex="' + '#' + colorList[i] + '" style="background-color:' + '#' + colorList[i] + ';"></li>');
}
/*
$('body').click(function () {
	picker.fadeOut();
});*/


$('#add_button').click(function(event) {
	new_room[current_floor]=1;
	event.stopPropagation();
	picker.fadeIn();
});

function updateScroll(){
    var element = document.getElementById("color");
    element.scrollTop = element.scrollHeight;
}

document.getElementById("submit").addEventListener('click', async () => {
	corners[current_floor].forEach(corner => {
		delete corner.r;
	});
	walls[current_floor].forEach(wall => {
		delete wall.width;
		delete wall.corner2.r;
	});
	let colors = document.getElementsByClassName("awsome_input_border");
	rooms[current_floor].forEach(room => {
		for (let iter = 0; iter < colors.length; ++iter) {
			function componentToHex(c) {
				let hex = c.toString(16);
				return hex.length == 1 ? "0" + hex : hex;
			}
			function rgbToHex(r, g, b) {
				return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
			}
			let color = room.color;
			if (color.startsWith("rgb")) {
				console.log(colors[iter].style["background-color"], color)
				if (colors[iter].style["background-color"] === color) {
					room.text = document.getElementsByClassName("awsome_input")[iter].value;
				}
			} else {
				let rgb = colors[iter].style["background-color"].match(/rgba?\((\d{1,3}), ?(\d{1,3}), ?(\d{1,3})\)?(?:, ?(\d(?:\.\d?))\))?/);
				if ((rgbToHex(parseInt(rgb[1]), parseInt(rgb[2]), parseInt(rgb[3]))).toUpperCase() === color) {
					room.text = document.getElementsByClassName("awsome_input")[iter].value;
				}
			}
		};
	});
	let result = {
		account: localStorage.getItem("account"),
		floorplan: {
			corners: corners[current_floor],
			walls: walls[current_floor],
			rooms: rooms[current_floor],
			items: items[current_floor]
		}
	};
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
    await $.get('./users/find/'+account, {}, (res) => {
        document.getElementById("UserImg").src = res.icon;
    });
}
