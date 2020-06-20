class Panel {

	constructor() {

		this.mode = "line";
		this.width = 1100;
		this.height = 520;
		this.gridSize = 20;
		this.nowFloor = 0;
		this.floor = [new Floor()];
		this.previewedWall = null;
		this.steps = [];
		this.isEditing = false;
		(function genPanel(panel) {

			let data = new Array();
			let xpos = 0;
			let ypos = 0;
			
			for (let row = 0; row < panel.height / panel.gridSize; row++) {
				data.push(new Array());
				for (let column = 0; column < panel.width / panel.gridSize; column++) {
					data[row].push({
						x: xpos,
						y: ypos,
						width: panel.gridSize,
						height: panel.gridSize
					})
					xpos += panel.gridSize;
				}
				xpos = 0;
				ypos += panel.gridSize;
			}
		
			let grid = d3.select("#grid")
				.append("svg")
				.attr("width", panel.width+2)
				.attr("height", panel.height+2)
				.style("border-radius","30px");
		
			var row = grid.selectAll(".row")
				.data(data)
				.enter().append("g")
				.attr("class", "row");
		
			row.selectAll(".square")
				.data(function(d) { return d; })
				.enter().append("rect")
				.attr("class","square")
				.attr("x", function(d) { return d.x; })
				.attr("y", function(d) { return d.y; })
				.attr("width", function(d) { return d.width; })
				.attr("height", function(d) { return d.height; })
				.style("fill", "#f0f0f0")
				.style("stroke", "#B3AFAF")
				.style("stroke-width", 0.3)
				.on('click', function() { panel.onClick(); })
				.on('mousedown', function() { panel.onMouseDown(); });
		
			grid.append("g").attr("id", "previewRoom");
			grid.append("g").attr("id", "previewWall");
			grid.append("g").attr("id", "rooms");
			grid.append("g").attr("id", "walls");
			grid.append("g").attr("id", "corners");
		
		})(this);
		document.getElementById("undo_button").addEventListener('click', () => { this.undo(this); });
		document.getElementById("delete").addEventListener('click', () => { this.delete(this); });

	}

	onClick() {
		if (this.mode === "line") {
			this.drawWall();
		}
	}

	onMouseDown() {
		if (this.mode === "rect") {
			this.drawRoom(event);
		}
	}

	addFloor() {
		this.mode = "line";
		this.floor.push(new Floor());
		this.nowFloor = this.floor.length - 1;
		this.steps.push([{
			operation: "new",
			object: "floor",
			floor: this.nowFloor
		}]);
		this.render();
	}

	drawWall() {

		document.getElementsByTagName("svg")[0].removeEventListener('mousemove', () => { this.previewWall(event, this); });
		let x = (Math.floor(event.layerX / this.gridSize) + ((event.layerX % this.gridSize) > (this.gridSize / 2))) * this.gridSize;
		let y = (Math.floor(event.layerY / this.gridSize) + ((event.layerY % this.gridSize) > (this.gridSize / 2))) * this.gridSize;
		let floor = this.floor[this.nowFloor];
		let newStep = [];

		// update dots
		let isDrawPoint = true;
		floor.corners.forEach(corner => {
			if (corner.x == x && corner.y == y) isDrawPoint = false;
		});
		if (isDrawPoint) {
			let newCorner = new Point(x, y, 4);
			floor.corners.push(newCorner);
			newStep.push({
				operation: "new",
				object: "corner",
				floor: this.nowFloor
			});
		}
		floor.corners = floor.corners.map(corner => {
			if (corner.x == x && corner.y == y) {
				if (corner.isSelected) {
					corner.r = 4;
				} else {
					corner.r = 6;
					document.getElementsByTagName("svg")[0].addEventListener('mousemove', () => { this.previewWall(event, this); });
				}
				corner.isSelected = !corner.isSelected;
			} else {
				corner.r = 4;
				corner.isSelected = false;
			}
			return corner;
		});

		// update lines
		if (this.previewedWall) {
			let isDrawWall = true;
			floor.walls.forEach(wall => {
				if (((wall.corner1.x == this.previewedWall.corner1.x && wall.corner1.y == this.previewedWall.corner1.y) &&
					 (wall.corner2.x == x && wall.corner2.y == y)) ||
					((wall.corner2.x == this.previewedWall.corner1.x && wall.corner2.y == this.previewedWall.corner1.y) && 
					 (wall.corner1.x == x && wall.corner1.y == y))) {
					isDrawWall = false;
				}
			});
			if (this.previewedWall.corner1.x == x && this.previewedWall.corner1.y == y) isDrawWall = false;
			if (isDrawWall) {
				let newWall = new Line(this.previewedWall.corner1.x, this.previewedWall.corner1.y, x, y, 2);
				floor.walls.push(newWall);
				newStep.push({
					operation: "new",
					object: "wall",
					floor: this.nowFloor
				});
			}
		}
		floor.walls = floor.walls.map(wall => {
			wall.width = 2;
			wall.isSelected = false;
			return wall;
		});

		if (newStep.length != 0) this.steps.push(newStep);
		this.removeRoomHighlight();
		this.previewWall(event, this);

	}
	
	previewWall(event) {
		let isPreviewWall = false;
		let targetCorner;
		this.floor[this.nowFloor].corners.forEach(corner => {
			if (corner.isSelected) {
				isPreviewWall = true;
				targetCorner = corner;
			}
		});
		if (isPreviewWall) {
			let previewedWall = new Line(targetCorner.x, targetCorner.y, event.layerX, event.layerY, 2);
			this.previewedWall = previewedWall;
		} else {
			this.previewedWall = null;
		}
		this.render();
	}

	selectWall(d) {
		let index = this.floor[this.nowFloor].walls.indexOf(d);
		this.floor[this.nowFloor].walls = this.floor[this.nowFloor].walls.map((wall, key) => {
			if (key == index) {
				wall.select();
			} else {
				wall.width = 2;
				wall.isSelected = false;
			}
			return wall;
		});
		this.removeRoomHighlight();
		this.render();
	}

	drawRoom(event) {
		let floor = this.floor[this.nowFloor];
		let x = Math.floor(event.layerX / this.gridSize) * this.gridSize;
		let y = Math.floor(event.layerY / this.gridSize) * this.gridSize;
		let color = document.getElementById("pen").style["background-color"];
		floor.rooms.push(new Area(color, x, y, x + this.gridSize, y + this.gridSize, 1, nowColorIndex));
		this.render();

		let newStep = [{
			operation: "new",
			object: "room",
			floor: this.nowFloor
		}];
		this.steps.push(newStep);

		let svg = document.getElementsByTagName("svg")[0];
		let onMouseMove = (event) => {
			this.previewRoom(event);
		};
		let onMouseUp = () => {
			svg.removeEventListener('mousemove', onMouseMove);
			svg.removeEventListener('mouseup', onMouseUp);
			for (let iter = 0; iter < floor.rooms.length - 1; ++iter) {
				if (((floor.rooms[iter].corner1.x == floor.rooms[floor.rooms.length-1].corner1.x && floor.rooms[iter].corner1.y == floor.rooms[floor.rooms.length-1].corner1.y) &&
					 (floor.rooms[iter].corner2.x == floor.rooms[floor.rooms.length-1].corner2.x && floor.rooms[iter].corner2.y == floor.rooms[floor.rooms.length-1].corner2.y)) ||
					((floor.rooms[iter].corner1.x == floor.rooms[floor.rooms.length-1].corner2.x && floor.rooms[iter].corner1.y == floor.rooms[floor.rooms.length-1].corner2.y) &&
					 (floor.rooms[iter].corner2.x == floor.rooms[floor.rooms.length-1].corner1.x && floor.rooms[iter].corner2.y == floor.rooms[floor.rooms.length-1].corner1.y))) {
					floor.rooms.pop();
					this.steps.pop();
					break;
				}
			}
		}
		svg.addEventListener('mousemove', onMouseMove);
		svg.addEventListener('mouseup', onMouseUp);
	}

	previewRoom(event) {
		let floor = this.floor[this.nowFloor];
		let room = floor.rooms.pop();
		let x = Math.floor(event.layerX / this.gridSize) * this.gridSize;
		let y = Math.floor(event.layerY / this.gridSize) * this.gridSize;
		if (x >= room.corner1.x) x += this.gridSize;
		if (y >= room.corner1.y) y += this.gridSize;
		room.corner2.x = x;
		room.corner2.y = y;
		floor.rooms.push(room);
		this.render();
	}

	selectRoom(d) {
		let floor = this.floor[this.nowFloor];
		floor.rooms.forEach(room => {
			if (room === d) {
				room.select();
			} else {
				room.width = 1;
				room.isSelected = false;
			}
		});
		this.removeWallHighlight();
		this.render();
	}

	delete() {
		let newStep = [];
		let floor = this.floor[this.nowFloor];
		let type = [false, false, false];
		let target;
		["corners", "walls", "rooms"].forEach((group, key) => {
			floor[group].forEach(ele => {
				if (ele.isSelected) {
					type[key] = true;
					target = ele;
				}
			});
		});
		if (type[0]) {	// is dot
			floor.corners = floor.corners.map((corner, key) => {
				if (corner.x == target.x && corner.y == target.y) {
					corner.r = 4;
					newStep.push({
						operation: "delete",
						object: "corner",
						floor: this.nowFloor,
						target: corner,
						index: key
					});
					return false;
				} else {
					return corner;
				}
			});
			let checkedCorners = [];
			floor.walls = floor.walls.map((wall, key) => {
				if (wall.corner1.x == target.x && wall.corner1.y == target.y) {
					checkedCorners.push(wall.corner2);
					newStep.push({
						operation: "delete",
						object: "wall",
						floor: this.nowFloor,
						target: wall,
						index: key
					});
					return false;
				} else if (wall.corner2.x == target.x && wall.corner2.y == target.y) {
					checkedCorners.push(wall.corner1);
					newStep.push({
						operation: "delete",
						object: "wall",
						floor: this.nowFloor,
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
				checkCornerNotConnected(corner, newStep, this);
			});
			floor.corners = floor.corners.filter(ele => {
				return ele;
			});
			this.previewedWall = null;
		}
		if (type[1]) {	// is line
			let checkedCorners = [];
			floor.walls = floor.walls.map((wall, key) => {
				if (wall.isSelected) {
					checkedCorners.push(wall.corner1);
					checkedCorners.push(wall.corner2);
					wall.width = 2;
					newStep.push({
						operation: "delete",
						object: "wall",
						floor: this.nowFloor,
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
				checkCornerNotConnected(corner, newStep, this);
			});
			floor.corners = floor.corners.filter(ele => {
				return ele;
			});
		}
		if (type[2]) {	// is area
			floor.rooms = floor.rooms.map((room, key) => {
				if (room.isSelected) {
					room.width = 1;
					newStep.push({
						operation: "delete",
						object: "room",
						floor: this.nowFloor,
						target: room,
						index: key
					});
					return false;
				} else {
					return room;
				}
			}).filter(ele => {
				return ele;
			});
		}
		if (newStep.length != 0) this.steps.push(newStep);
		this.render();

		function checkCornerNotConnected(target, stepRecorder, panel) {
			let result = true;
			panel.floor[panel.nowFloor].walls.forEach(wall => {
				if ((wall.corner1.x == target.x && wall.corner1.y == target.y) ||
					(wall.corner2.x == target.x && wall.corner2.y == target.y)) {
					result = false;
				}
			});
			if (result) {
				panel.floor[panel.nowFloor].corners = panel.floor[panel.nowFloor].corners.map((corner, key) => {
					if (corner.x == target.x && corner.y == target.y) {
						stepRecorder.push({
							operation: "delete",
							object: "corner",
							floor: panel.nowFloor,
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
	}

	undo() {
		let lastStep = this.steps.pop();
		if (!lastStep) return;
		lastStep.forEach(step => {
			this.nowFloor = step.floor;
			if (step.operation === "new") {
				if (step.object === "wall") {
					this.floor[step.floor].walls.pop();
				}
				if (step.object === "corner") {
					this.floor[step.floor].corners.pop();
				}
				if (step.object === "room") {
					this.floor[step.floor].rooms.pop();
				}
				if (step.object === "floor") {
					this.floor.pop();
					this.nowFloor--;
					document.getElementsByClassName("floor")[document.getElementsByClassName("floor").length-1].remove();
				}
			}
			if (step.operation === "delete") {
				if (step.object === "wall") {
					this.floor[step.floor].walls.splice(step.index, 0, step.target);
				}
				if (step.object === "corner") {
					this.floor[step.floor].corners.splice(step.index, 0, step.target);
				}
				if (step.object === "room") {
					this.floor[step.floor].rooms.splice(step.index, 0, step.target);
				}
			}
			if (step.operation === "edit") {
				if (step.object === "wall") {
					this.floor[step.floor].walls[step.index].corner1.x = step.before.x1;
					this.floor[step.floor].walls[step.index].corner1.y = step.before.y1;
					this.floor[step.floor].walls[step.index].corner2.x = step.before.x2;
					this.floor[step.floor].walls[step.index].corner2.y = step.before.y2;
				}
				if (step.object === "corner") {
					this.floor[step.floor].corners[step.index].x = step.before.x;
					this.floor[step.floor].corners[step.index].y = step.before.y;
				}
				if (step.object === "room") {
					// TODO
				}
			}
		});
		this.removeWallHighlight();
		this.removeRoomHighlight();
		this.render();
	}

	removeWallHighlight() {
		this.floor[this.nowFloor].corners = this.floor[this.nowFloor].corners.map(corner => {
			corner.r = 4;
			corner.isSelected = false;
			return corner;
		});
		this.floor[this.nowFloor].walls = this.floor[this.nowFloor].walls.map(wall => {
			wall.width = 2;
			wall.isSelected = false;
			return wall;
		});
		this.previewedWall = null;
	}

	removeRoomHighlight() {
		this.floor[this.nowFloor].rooms = this.floor[this.nowFloor].rooms.map(room => {
			room.width = 1;
			room.isSelected = false;
			return room;
		});
	}

	render() {

		let floor = this.floor[this.nowFloor];

		// corners
		d3.select("#corners")
			.selectAll(".corner")
			.data(floor.corners)
			.enter().append("circle")
			.attr("class", "corner")
			.attr("cx", (d) => { return d.x; })
			.attr("cy", (d) => { return d.y; })
			.attr("r", (d) => { return d.r; })
			.attr("stroke-width", 0)
			.attr("fill", "black")
			.on('click', () => {
				if (this.isEditing) {
					this.isEditing = false;
					return;
				}
				this.drawWall(event, this);
			})
			.on('mousedown', (d) => {
				let target;
				floor.corners.forEach(corner => {
					if (corner.x == d.x && corner.y == d.y) target = corner;
				});
				target.startEditWall(this);
				let svg = document.getElementsByTagName("svg")[0];
				let onMouseMove = () => {
					this.isEditing = true;
					target.editWall(this);
				};
				let onMouseUp = () => {
					target.endEditWall(this);
					svg.removeEventListener('mousemove', onMouseMove);
					svg.removeEventListener('mouseup', onMouseUp);
				};
				svg.addEventListener('mousemove', onMouseMove);
				svg.addEventListener('mouseup', onMouseUp);
			});
		d3.select("#corners")
			.selectAll("circle")
			.data(floor.corners)
			.attr("cx", (d) => { return d.x; })
			.attr("cy", (d) => { return d.y; })
			.attr("r", (d) => { return d.r; })
			.exit().remove();

		// walls
		d3.select("#walls")
			.selectAll(".wall")
			.data(floor.walls)
			.enter().append("line")
			.attr("class", "wall")
			.attr("x1", (d) => { return d.corner1.x; })
			.attr("y1", (d) => { return d.corner1.y; })
			.attr("x2", (d) => { return d.corner2.x; })
			.attr("y2", (d) => { return d.corner2.y; })
			.attr("stroke", "black")
			.attr("stroke-width", 2)
			.on('click', (d) => {
				if (this.isEditing) {
					this.isEditing = false;
					return;
				}
				let isDrawLine = false;
				floor.corners.forEach(corner => {
					if (corner.isSelected) isDrawLine = true;
				});
				if (isDrawLine) {
					this.drawWall(event, this);
				} else {
					this.selectWall(d);
				}
			});
		d3.select("#walls")
			.selectAll("line")
			.data(floor.walls)
			.attr("x1", (d) => { return d.corner1.x; })
			.attr("y1", (d) => { return d.corner1.y; })
			.attr("x2", (d) => { return d.corner2.x; })
			.attr("y2", (d) => { return d.corner2.y; })
			.attr("stroke-width", (d) => { return d.width; })
			.exit().remove();
		
		// previewedWall
		d3.select("#previewWall")
			.selectAll(".wall")
			.data(this.previewedWall? [this.previewedWall]: [])
			.enter().append("line")
			.attr("class", "wall")
			.attr("x1", (d) => { return d.corner1.x; })
			.attr("y1", (d) => { return d.corner1.y; })
			.attr("x2", (d) => { return d.corner2.x; })
			.attr("y2", (d) => { return d.corner2.y; })
			.attr("stroke", "black")
			.attr("stroke-width", 2)
			.style("z-index", 0)
			.style("opacity", 0.5)
			.on('click', () => { this.drawWall(event, this); });
		d3.select("#previewWall")
			.selectAll(".wall")
			.data(this.previewedWall? [this.previewedWall]: [])
			.attr("x1", (d) => { return d.corner1.x; })
			.attr("y1", (d) => { return d.corner1.y; })
			.attr("x2", (d) => { return d.corner2.x; })
			.attr("y2", (d) => { return d.corner2.y; })
			.exit().remove();

		// rooms
		d3.select("#rooms")
			.selectAll(".room")
			.data(floor.rooms)
			.enter().append("rect")
			.attr("class", "room")
			.attr("x", (d) => { return Math.min(d.corner1.x, d.corner2.x); })
			.attr("y", (d) => { return Math.min(d.corner1.y, d.corner2.y); })
			.attr("width", (d) => { return Math.abs(d.corner1.x - d.corner2.x); })
			.attr("height", (d) => { return Math.abs(d.corner1.y - d.corner2.y); })
			.attr("fill", (d) => { return d.color; })
			.attr("stroke", "black")
			.attr("stroke-width", 1)
			.on('click', (d) => { if (this.mode === "line") this.selectRoom(d, this); })
			.on('mousedown', () => { if (this.mode === "rect") this.drawRoom(event, this); });
		d3.select("#rooms")
			.selectAll(".room")
			.data(floor.rooms)
			.attr("x", (d) => { return Math.min(d.corner1.x, d.corner2.x); })
			.attr("y", (d) => { return Math.min(d.corner1.y, d.corner2.y); })
			.attr("width", (d) => { return Math.abs(d.corner1.x - d.corner2.x); })
			.attr("height", (d) => { return Math.abs(d.corner1.y - d.corner2.y); })
			.attr("fill", (d) => { return d.color; })
			.attr("stroke-width", (d) => { return d.width; })
			.exit().remove();

	}

}

class Floor {

	constructor() {
		this.corners = [];
		this.walls = [];
		this.rooms = [];
		this.colors = ["#F1BA9C"];
		this.render();
	}

	addColor(color) {
		this.colors.push(color);
		this.render();
	}

	render() {
		let result = "";
		for (let iter = 1; iter <= this.colors.length; ++iter) {
			result += `
				<li class="round" id = "c_${iter}" style="background-color: ${this.colors[iter-1]}">
					<div class="input_container">
						<input type="text" id="text_in${iter}" class="awsome_input" placeholder="room_${iter}"/>
						<span class="awsome_input_border" id="b_${iter}" style="background-color: ${this.colors[iter-1]}"/>
					</div>
				</li>
			`;
		}
		document.getElementById("color_list").innerHTML = result;
	}

}

class Component {
	constructor() {
		this.isSelected = false;
	}
}

class Point extends Component {

	constructor(x, y, r) {
		super();
		this.x = x;
		this.y = y;
		this.r = r;
	}

	startEditWall(panel) {
		let newStep = [];
		panel.steps.push(newStep);

		let index = -1;
		panel.floor[panel.nowFloor].corners.forEach((corner, key) => {
			if (corner.x == this.x && corner.y == this.y && corner.r != 6) {
				index = key;
			}
		});

		if (index != -1) {
			newStep.push({
				operation: "edit",
				object: "corner",
				floor: panel.nowFloor,
				before: {
					x: this.x,
					y: this.y
				},
				after: {
					x: this.x,
					y: this.y
				},
				index: index
			});
			panel.floor[panel.nowFloor].walls.forEach((wall, key) => {
				if ((wall.corner1.x == this.x && wall.corner1.y == this.y) ||
					(wall.corner2.x == this.x && wall.corner2.y == this.y)) {
					newStep.push({
						operation: "edit",
						object: "wall",
						floor: panel.nowFloor,
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
		}
	}

	editWall(panel) {
		panel.removeWallHighlight();
		panel.removeRoomHighlight();
		let floor = panel.floor[panel.nowFloor];
		let stepRecorder = panel.steps[panel.steps.length-1];
		let x = (Math.floor(event.layerX / panel.gridSize) + ((event.layerX % panel.gridSize) > (panel.gridSize / 2))) * panel.gridSize;
		let y = (Math.floor(event.layerY / panel.gridSize) + ((event.layerY % panel.gridSize) > (panel.gridSize / 2))) * panel.gridSize;
		let editTarget;
		stepRecorder.forEach(step => {
			if (step.operation === "edit") {
				if (step.object === "corner") {
					editTarget = {
						x: step.after.x,
						y: step.after.y
					};
					step.after.x = x;
					step.after.y = y;
					floor.corners[step.index].x = x;
					floor.corners[step.index].y = y;
				}
				if (step.object === "wall") {
					if (step.after.x1 == editTarget.x && step.after.y1 == editTarget.y) {
						step.after.x1 = x;
						step.after.y1 = y;
						floor.walls[step.index].corner1.x = x;
						floor.walls[step.index].corner1.y = y;
					} else {
						step.after.x2 = x;
						step.after.y2 = y;
						floor.walls[step.index].corner2.x = x;
						floor.walls[step.index].corner2.y = y;
					}
				}
			}
		});
		panel.render();
	}

	endEditWall(panel) {
		let stepRecorder = panel.steps[panel.steps.length-1];
		if (stepRecorder.length == 0 || JSON.stringify(stepRecorder[0].before) === JSON.stringify(stepRecorder[0].after)) {
			panel.steps.pop();
		}
	}

}

class Line extends Component {

	constructor(x1, y1, x2, y2, width) {
		super();
		this.corner1 = {
			x: x1,
			y: y1
		};
		this.corner2 = {
			x: x2,
			y: y2
		};
		this.width = width;
	}

	select() {
		if (this.isSelected) {
			this.width = 2;
		} else {
			this.width = 4;
		}
		this.isSelected = !this.isSelected;
	}

}

class Area extends Component {

	constructor(color, x1, y1, x2, y2, width, index) {
		super();
		this.color = color;
		this.corner1 = {
			x: x1,
			y: y1
		};
		this.corner2 = {
			x: x2,
			y: y2
		};
		this.width = width;
		this.colorIndex = index;
	}

	select() {
		if (this.isSelected) {
			this.width = 1;
		} else {
			this.width = 2;
		}
		this.isSelected = !this.isSelected;
	}

}

const panel = new Panel();


document.getElementById("draw_map").addEventListener('click', () => {
	$("#place_furnish_mode").css({"visibility": "hidden", "height": 0});
	$("#draw_map_mode").css({"visibility": "visible", "height": "100%"});
	$('#place_furnish').css({"opacity": 0.5});
	$('#draw_map').css({"opacity": 1});

});
document.getElementById("place_furnish").addEventListener('click', () => {
	$("#draw_map_mode").css({"visibility": "hidden", "height": 0});
	$("#place_furnish_mode").css({"visibility": "visible", "height": "100%"});
	$('#place_furnish').css({"opacity": 1});
	$('#draw_map').css({"opacity": 0.5});
});

const colorList = ['F1BA9C','F5A96B','F8C780','D4C793','C7DF93','669A7D','9ED5D2','7DBEDF','C4D5D9','A889AD','D788AD','A9A696',
				   'D57456','E0742D','EBAB4B','A1986E','81863A','365545','388185','0F4867','384851','715D75','4F3239','696758'];
const picker = $('#color-picker');
for (let iter = 0; iter < colorList.length; iter++) {
	picker.append(`<li class="color-item" data-hex="#${colorList[iter]}" style="background-color: #${colorList[iter]}"></li>`);
}
let isPickerDisplay = false;
let nowColorIndex = 0;

document.getElementById("add_button").addEventListener('click', () => {
	if (!isPickerDisplay) {
		picker.fadeIn();
	}
	isPickerDisplay = !isPickerDisplay;
});

document.getElementById("pen_button").addEventListener('click', () => {
	if(panel.mode === "rect"){
		panel.mode = "line";
		document.getElementById("pen").style["background-color"] = "transparent";
	}
});

$(document).on('click','.round', () => {
	panel.mode = "rect";

	let colorChoices = document.getElementsByClassName("round");
	for (let iter = 0; iter < colorChoices.length; ++iter) {
		if (colorChoices[iter].children[0] === event.target) {
			nowColorIndex = iter;
			break;
		}
	}

	if (event.target.children.length) {
		$('#pen').css('background-color', event.target.children[1].style["background-color"]);
	}
});

$(document).on('click', '.color-item', () => {
	panel.mode = "rect";

	let color = event.target.style["background-color"];
	$('#pickcolor').val(color);
	$('#pen').css('background-color', color);
	
	panel.floor[panel.nowFloor].addColor(color);
});

document.addEventListener('mousedown', () => {
	picker.fadeOut();
	isPickerDisplay = false;
});


$(document).on('click', '#add_floor', function () {
	panel.addFloor();
	$('#pen').css('background-color', "transparent");
	$("#floor").append(`<div id="floor_animate${panel.floor.length-1}" class="floor" style="position:absolute;z-index:${100-(panel.floor.length-1)}; margin-top:-${12*(panel.floor.length-1)}px"> <img src="./img/floor_1.png"> </div>`)
});

// let open=0;
// $("#floor").hover(function(){
// 	console.log("hello")
// 	for(let i=0;i<=current_floor;i+=1){
// 		$("#floor_animate"+i).animate({"top":30*current_floor-30*i+"px"},500);
// 	}
// });

$(document).on('click', '#add_floor_button', function () {
	if (panel.floor[panel.nowFloor+1]) {
		panel.nowFloor++;
	}
	panel.render();
});

$(document).on('click', '#sub_floor_button', function () {
	if (panel.floor[panel.nowFloor-1]) {
		panel.nowFloor--;
	}
	panel.render();
});

// function updateScroll(){
//     var element = document.getElementById("color");
//     element.scrollTop = element.scrollHeight;
// }

document.getElementById("submit").addEventListener('click', async () => {
	let floorplan = [];
	panel.floor.forEach(floor => {
		let newFloor = {
			corners: [],
			walls: [],
			rooms: [],
			items: []
		};
		floor.corners.forEach(corner => {
			let target = Object.assign({}, corner);
			delete target.r;
			delete target.isSelected;
			newFloor.corners.push(target);
		});
		floor.walls.forEach(wall => {
			let target = Object.assign({}, wall)
			delete target.width;
			delete target.isSelected;
			newFloor.walls.push(target);
		});
		floor.rooms.forEach(room => {
			let target = Object({}, room);
			let text = document.getElementsByClassName("input_container")[room.colorIndex].children[0];
			target.text = text.value? text.value: text.placeholder;
			delete target.colorIndex;
			newFloor.rooms.push(target);
		});
		floorplan.push(newFloor);
	});
	/*
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
	*/
	let result = {
		account: localStorage.getItem("account"),
		floorplan: floorplan
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
});

async function getUser() {
    var account = localStorage.getItem("account");
    await $.get('./users/find/'+account, {}, (res) => {
        document.getElementById("UserImg").src = res.icon;
    });
}
