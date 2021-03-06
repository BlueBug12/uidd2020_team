
window.fbAsyncInit = function() {
    FB.init({
        appId: myAppId,
        xfbml: true,
        version: 'v7.0'
    });
    FB.AppEvents.logPageView();
};
// Load the SDK asynchronously
(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) { return; }
    js = d.createElement(s);
    js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));
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
		this.isDrawing = false;
		this.isDeleting = false;
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
		for (let iter = 0; iter < 3; ++iter) {
			if (iter == 0) {
				document.getElementsByClassName("pen")[0].addEventListener('click', () => {
					this.isDrawing = !this.isDrawing;
					if (this.isDrawing) {
						document.getElementsByClassName("pen")[0].style["background-color"] = "#9E9E9E";
						document.getElementsByClassName("delete")[iter].style["background-color"] = "";
						this.isDeleting = false;
					} else {
						removeHighlight();
						document.getElementsByClassName("pen")[0].style["background-color"] = "";
					}
				});
			}
			document.getElementsByClassName("undo")[iter].addEventListener('click', () => { this.undo(this); });
			document.getElementsByClassName("delete")[iter].addEventListener('click', () => {
				this.isDeleting = !this.isDeleting;
				if (this.isDeleting) {
					removeHighlight();
					document.getElementsByClassName("delete")[iter].style["background-color"] = "#9E9E9E";
					if (iter == 0) document.getElementsByClassName("pen")[0].style["background-color"] = "";
					if (iter == 1) {
						if (nowColorIndex != -1) {
							document.getElementsByClassName("input_container")[nowColorIndex].style["background-color"] = "transparent";
							document.getElementsByClassName("input_container")[nowColorIndex].style["opacity"] = 1;
						}
					}
					this.mode = "line";
					this.isDrawing = false;
				} else {
					document.getElementsByClassName("delete")[iter].style["background-color"] = "";
				}
			});
		}

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
		$("#floor").append(`
			<div
				id="floor_animate${this.floor.length-1}"
				class="diamond"
				style="
					top: 100px;
					z-index: ${this.floor.length};
					margin-top: -${12*(this.floor.length-1)}px;
				"
			>
				<div>${this.floor.length}F</div>
			</div>
		`);
		addFloorListener(this.floor.length - 1)
		this.switchFloor(this.floor.length - 1);
		this.steps.push([{
			operation: "new",
			object: "floor",
			floor: this.floor.length-2
		}]);
	}

	switchFloor(floorNum) {
		panel.removeRoomHighlight();
		panel.removeWallHighlight();
		this.floor[this.nowFloor].recordText();
		$(`#floor_animate${this.nowFloor}`).css({
			"z-index": this.nowFloor+1,
			background: "#F4DF62",
			transition: "0s"
		});
		$(`#floor_animate${floorNum}`).css({
			"z-index": 100,
			background: "#799FB4",
			transition: "0s"
		});
		this.nowFloor = floorNum;
		this.floor[this.nowFloor].render();
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
		if (this.isDrawing || this.isDeleting) {
			if (isDrawPoint && !this.isDeleting) {
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
		}

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
		if (this.isDeleting) this.delete();
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
		if (this.isDeleting) this.delete();
		this.removeRoomHighlight();
		this.render();
	}

	drawRoom(event) {
		let floor = this.floor[this.nowFloor];
		let x = Math.floor(event.layerX / this.gridSize) * this.gridSize;
		let y = Math.floor(event.layerY / this.gridSize) * this.gridSize;
		let color = nowColor;
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
					this.render();
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
		if (this.isDeleting) this.delete();
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
			if (this.nowFloor != step.floor) {
				this.switchFloor(step.floor);
			}
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
				if (step.object === "item") {
					this.floor[step.floor].items.pop();
				}
				if (step.object === "floor") {
					this.floor.pop();
					document.getElementsByClassName("diamond")[document.getElementsByClassName("diamond").length-1].remove();
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
				if (step.object === "item") {
					this.floor[step.floor].items.splice(step.index, 0, step.target);
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
				if (step.object === "item") {
					if (step.type === "position") {
						this.floor[this.nowFloor].items[step.index].x = step.before.x;
						this.floor[this.nowFloor].items[step.index].y = step.before.y;
					}
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
			.attr("width", (d) => {
				return (d.corner1.x < d.corner2.x)
					? Math.abs(d.corner1.x - d.corner2.x)
					: (Math.abs(d.corner1.x - d.corner2.x) + this.gridSize);
			})
			.attr("height", (d) => {
				return (d.corner1.y < d.corner2.y)
					? Math.abs(d.corner1.y - d.corner2.y)
					: (Math.abs(d.corner1.y - d.corner2.y) + this.gridSize);
			})
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
			.attr("width", (d) => {
				return (d.corner1.x < d.corner2.x)
					? Math.abs(d.corner1.x - d.corner2.x)
					: (Math.abs(d.corner1.x - d.corner2.x) + this.gridSize);
			})
			.attr("height", (d) => {
				return (d.corner1.y < d.corner2.y)
					? Math.abs(d.corner1.y - d.corner2.y)
					: (Math.abs(d.corner1.y - d.corner2.y) + this.gridSize);
			})
			.attr("fill", (d) => { return d.color; })
			.attr("stroke-width", (d) => { return d.width; })
			.exit().remove();

		// items
		let onMouseDownItem = () => {
			let index = parseInt(event.target.id.slice(4));
			let target = this.floor[this.nowFloor].items[index];
			if (this.isDeleting) {
				target.delete(index);
				this.steps.push([{
					operation: "delete",
					object: "item",
					floor: panel.nowFloor,
					target: target,
					index: index
				}]);
			} else {
				let onMouseMove = () => {
					target.move(event.clientX, event.clientY, 1);
					removeSelection();
				};
				let onMouseUp = () => {
					document.removeEventListener('mousemove', onMouseMove);
					document.removeEventListener('mouseup', onMouseUp);
					target.checkPosition(event.clientX, event.clientY, 1);
				}
				document.addEventListener('mousemove', onMouseMove);
				document.addEventListener('mouseup', onMouseUp);
				this.steps.push([{
					operation: "edit",
					object: "item",
					floor: panel.nowFloor,
					type: "position",
					before: {
						x: target.x,
						y: target.y
					},
					index: index
				}]);
			}
		};
		let items = document.getElementsByClassName("item");
		for (let iter = 0; iter < items.length; ++iter) {
			items[iter].removeEventListener('mousedown', onMouseDownItem);
		}
		let itemsContent = "";
		for (let iter = 0; iter < floor.items.length; ++iter) {
			let item = floor.items[iter];
			itemsContent += `
				<img
					class="item"
					id="item${iter}"
					src="./img/furnish/item/${item.name}.svg"
					width="${item.width}"
					height="${item.height}"
					style="
						position: absolute;
						top: calc(${item.y}px - 1vh);
						left: calc(${item.x}px - 1vw);
						transform: rotate(${item.rotation}deg);
					"
					draggable="false"
				/>
			`;
		}
		document.getElementById("items").innerHTML = itemsContent;
		items = document.getElementsByClassName("item");
		for (let iter = 0; iter < items.length; ++iter) {
			items[iter].addEventListener('mousedown', onMouseDownItem);
		}

	}

}

class Floor {

	constructor() {
		this.corners = [];
		this.walls = [];
		this.rooms = [];
		this.colors = ["#F1BA9C"];
		this.text = [];
		this.items = [];
	}

	addColor(color) {
		this.colors.push(color);
		this.render();
	}

	removeColor(index) {
		this.colors.splice(index, 1);
		if (this.text.length != 0) {
			this.text.splice(index, 1);
		}
		// check rooms
		this.render();
	}

	recordText() {
		let input = document.getElementsByClassName("input_container");
		for (let iter = 0; iter < input.length; ++iter) {
			let value = input[iter].children[0].value;
			this.text[iter] = value;
		}
	}

	addItem(item) {
		this.items.push(item);
		panel.render();
	}

	render() {
		let result = "";
		for (let iter = 1; iter <= this.colors.length; ++iter) {
			result += `
				<li class="round" id = "c_${iter}" style="background-color: ${this.colors[iter-1]}">
					<div class="input_container" style="height: 6vh">
						<input type="text" id="text_in${iter}" class="awsome_input" placeholder="room_${iter}" value="${this.text[iter-1]? this.text[iter-1]: ""}"/>
						<span class="awsome_input_border" id="b_${iter}" style="background-color: ${this.colors[iter-1]}"/>
						<img class="removeColor" src="./img/editor_icon/plus.png" />
					</div>
				</li>
			`;
		}
		document.getElementById("color_list").innerHTML = result;
		let colorChoices = document.getElementsByClassName("input_container");
		for (let iter = 0; iter < colorChoices.length; ++iter) {
			colorChoices[iter].addEventListener('mouseenter', () => {
				document.getElementsByClassName("removeColor")[iter].style.opacity = 1;
			});
			colorChoices[iter].addEventListener('mouseleave', () => {
				document.getElementsByClassName("removeColor")[iter].style.opacity = 0;
			});
			document.getElementsByClassName("removeColor")[iter].addEventListener('click', () => {
				this.removeColor(iter);
			});
		}
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

class Item extends Component {

	constructor(name, x, y, width= 30, height = 30) {
		super();
		this.name = name;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.rotation = 0;
		this.boundary = {
			x1: Math.round(parseInt(window.innerHeight)*0.2),
			x2: Math.round(parseInt(window.innerHeight)*0.2)+1100-30,
			y1: Math.round(parseInt(window.innerHeight)*0.96)-520,
			y2: Math.round(parseInt(window.innerHeight)*0.96)-15
		};
	}

	move(x, y, isEditting = 0) {
		this.x = x;
		this.y = y;
		if (isEditting) {
			if (this.x < this.boundary.x1) {
				this.x = this.boundary.x1;
			}
			if (this.x > this.boundary.x2) {
				this.x = this.boundary.x2;
			}
			if (this.y < this.boundary.y1) {
				this.y = this.boundary.y1;
			}
			if (this.y > this.boundary.y2) {
				this.y = this.boundary.y2;
			}
		}
		panel.render();
	}

	checkPosition(x, y, isEditting = 0) {
		let isOutside = false;
		if (x < this.boundary.x1 || x > this.boundary.x2 || y < this.boundary.y1 || y > this.boundary.y2) {
			isOutside = true;
		}
		if (isEditting) {
			if (x == panel.steps[panel.steps.length-1].before.x && y == panel.steps[panel.steps.length-1].before.y) {
				panel.steps.pop();
				panel.render();
			}
		} else {
			if (isOutside) {
				panel.floor[panel.nowFloor].items.pop();
				panel.render();
			} else {
				panel.steps.push([{
					operation: "new",
					object: "item",
					floor: panel.nowFloor
				}]);
			}
		}
	}

	delete(index) {
		panel.floor[panel.nowFloor].items.splice(index, 1);
		panel.render();
	}

}

const panel = new Panel();
panel.floor[0].render();


document.getElementById("draw_boundary").addEventListener('click', () => {
	$("#draw_boundary_mode").css({"visibility": "visible", "height": "100%"});
	$("#draw_room_mode").css({"visibility": "hidden", "height": 0});
	$("#place_furnish_mode").css({"visibility": "hidden", "height": 0});
	$('#draw_boundary').css({"opacity": 1});
	$('#draw_room').css({"opacity": 0.5});
	$('#place_furnish').css({"opacity": 0.5});
	$('#editor').css({ "height": "8vh", "margin-top": "20vh" });
	$('.list-inline-item').css({ "padding-left": "1vw", "margin-top": "1vh" });
	$('#submit').css({ display: "none" });
	panel.mode = "line";
	panel.isDrawing = false;
	panel.isDeleting = false;
	document.getElementsByClassName("pen")[0].style["background-color"] = "";
	document.getElementsByClassName("delete")[0].style["background-color"] = "";
});
document.getElementById("draw_room").addEventListener('click', () => {
	$("#draw_boundary_mode").css({"visibility": "hidden", "height": 0});
	$("#draw_room_mode").css({"visibility": "visible", "height": "100%"});
	$("#place_furnish_mode").css({"visibility": "hidden", "height": 0});
	$('#draw_boundary').css({"opacity": 0.5});
	$('#draw_room').css({"opacity": 1});
	$('#place_furnish').css({"opacity": 0.5});
	$('#editor').css({ "height": "60vh", "margin-top": 0 });
	$('.list-inline-item').css({ "padding-left": "1vw", "margin-top": "1vh" });
	$('#submit').css({ display: "none" });
	panel.isDrawing = false;
	panel.isDeleting = false;
	document.getElementsByClassName("delete")[1].style["background-color"] = "";
});
document.getElementById("place_furnish").addEventListener('click', () => {
	$("#draw_boundary_mode").css({"visibility": "hidden", "height": 0});
	$("#draw_room_mode").css({"visibility": "hidden", "height": 0});
	$("#place_furnish_mode").css({"visibility": "visible", "height": "100%"});
	$('#draw_boundary').css({"opacity": 0.5});
	$('#draw_room').css({"opacity": 0.5});
	$('#place_furnish').css({"opacity": 1});
	$('#editor').css({ "height": "60vh", "margin-top": 0 });
	$('.list-inline-item').css({ "padding-left": "2.5vw", "margin-top": 0 });
	$('#submit').css({ display: "block" });
	panel.mode = "line";
	panel.isDrawing = false;
	panel.isDeleting = false;
	document.getElementsByClassName("delete")[2].style["background-color"] = "";
});


const colorList = ['F1BA9C','F5A96B','F8C780','D4C793','C7DF93','669A7D','9ED5D2','7DBEDF','C4D5D9','A889AD','D788AD','A9A696',
				   'D57456','E0742D','EBAB4B','A1986E','81863A','365545','388185','0F4867','384851','715D75','4F3239','696758'];
const picker = $('#color-picker');
for (let iter = 0; iter < colorList.length; iter++) {
	picker.append(`<li class="color-item" data-hex="#${colorList[iter]}" style="background-color: #${colorList[iter]}"></li>`);
}
let hasPickerDisplay = false;
let isPickerDisplay = false;
let isAddingColor = false;
let isChangingColor = false;
let nowColorIndex = -1;
let nowColor;

document.getElementsByClassName("add")[0].addEventListener('click', () => {
	removeHighlight();
	isAddingColor = true;
	isChangingColor = false;
	if (!hasPickerDisplay) {
		isPickerDisplay = true;
		panel.floor[panel.nowFloor].recordText();
	}
});

$(document).on('click', '.color-item', () => {
	panel.mode = "rect";

	let color = event.target.style["background-color"];
	$('#pickcolor').val(color);
	nowColor = color;

	if (isChangingColor) {
		panel.floor[panel.nowFloor].colors[nowColorIndex] = color;
		panel.floor[panel.nowFloor].render();
		panel.floor[panel.nowFloor].rooms.forEach(room => {
			if (room.colorIndex == nowColorIndex) {
				room.color = color;
			}
		});
		panel.render();
	} else {
		isChangingColor = true;
		nowColorIndex = document.getElementsByClassName("round").length;
		panel.floor[panel.nowFloor].addColor(color);
	}
	document.getElementsByClassName("input_container")[nowColorIndex].style["background-color"] = color;
	document.getElementsByClassName("input_container")[nowColorIndex].style["opacity"] = 0.5;
});

document.getElementById("color-picker").addEventListener('click', () => {
	isPickerDisplay = true;
}, true);

document.addEventListener('click', () => {
	if (isPickerDisplay) {
		picker.fadeIn();
		hasPickerDisplay = true;
	} else {
		picker.fadeOut();
		hasPickerDisplay = false;
		isAddingColor = false;
		isChangingColor = false;
	}
	isPickerDisplay = false;
});

$(document).on('click', '.round', () => {
	let colorChoices = document.getElementsByClassName("round");
	let switchColor = () => {
		removeHighlight();
		panel.mode = "rect";
		for (let iter = 0; iter < colorChoices.length; ++iter) {
			if (colorChoices[iter].children[0].children[0] === event.target || colorChoices[iter].children[0] === event.target) {
				if (nowColorIndex != -1) {
					document.getElementsByClassName("input_container")[nowColorIndex].style["background-color"] = "transparent";
					document.getElementsByClassName("input_container")[nowColorIndex].style["opacity"] = 1;
				}
				nowColorIndex = iter;
				isPickerDisplay = true;
				isAddingColor = false;
				isChangingColor = true;
				nowColor = colorChoices[iter].children[0].children[1].style["background-color"];
				document.getElementsByClassName("input_container")[iter].style["background-color"] = colorChoices[iter].children[0].children[1].style["background-color"];
				document.getElementsByClassName("input_container")[iter].style["opacity"] = 0.5;
				document.getElementsByClassName("delete")[1].style["background-color"] = "";
				panel.isDeleting = false;
				panel.isDrawing = true;
				break;
			}
		}
	};
	let clearColor = () => {
		panel.mode = "line";
		document.getElementsByClassName("input_container")[nowColorIndex].style["background-color"] = "transparent";
		document.getElementsByClassName("input_container")[nowColorIndex].style["opacity"] = 1;
		nowColorIndex = -1;
		isPickerDisplay = false;
		isAddingColor = false;
		isChangingColor = false;
		nowColor = null;
		panel.isDrawing = false;
	};
	if (panel.mode === "line") {
		switchColor();
	} else {
		if (colorChoices[nowColorIndex].children[0] === event.target) {
			clearColor();
		} else {
			switchColor();
		}
	}
});


$(document).on('click', "#add_floor", function () {
	panel.addFloor();
	$("#pen").css("background-color", "transparent");
});

let floor_span = 0;
let current_floor = 0;
let onMouseEnterFloor = () => {
	for (let iter = 0; iter < panel.floor.length; ++iter) {
		$(`#floor_animate${iter}`).css({ transition: "0.5s" });
		$(`#floor_animate${iter}`).css({ top: (30*(panel.floor.length-iter-1)+100)+"px" });
	}
	floor_span = 1;
	current_floor = panel.nowFloor;
};
let onMouseLeaveFloor = () => {
	if (floor_span) {
		panel.switchFloor(current_floor);
		floor_span = 0;
	}
	for (let iter = 0; iter < panel.floor.length; ++iter) {
		$(`#floor_animate${iter}`).css({ transition: "0.5s" });
		$(`#floor_animate${iter}`).css({ top: "100px" });
	}
};
document.getElementById("floor").addEventListener('mouseenter', onMouseEnterFloor);
document.getElementById("floor").addEventListener('mouseleave', onMouseLeaveFloor);

function addFloorListener(floor) {
	$(document).on('mouseenter', `#floor_animate${floor}`, function () {
		if (floor_span) panel.switchFloor(floor);
	}).on('click', `#floor_animate${floor}`, function () {
		floor_span = 0;
		onMouseLeaveFloor();
	});
}
addFloorListener(0);


let furnishPanel = document.getElementsByClassName("column_2")[0];
let furnish = ["bed", "chair", "chair2", "desk", "oven", "sink", "sink2", "sink3", "sink4", "sink5",
			   "sofa", "table", "toilet"];
furnish.forEach(ele => {
	furnishPanel.innerHTML += (`
		<li class="item_margin">
			<img src="./img/furnish/icon/${ele}_icon.svg" id="${ele}" draggable="false">
		</li>
	`);
});

let icon = document.getElementsByClassName("item_margin");
/*
var size_list = {
	'bed':50,
	'chair':30,
	'chair2':30,
	'desk':50,
	'oven':30,
	'sink':40,
	'sink2':40,
	'sink3':40,
	'sink4':40,
	'sink5':40,
	'sofa':60,
	'table':60,
	'toilet':50};*/

for (let iter = 0; iter < icon.length; ++iter) {
	icon[iter].addEventListener('mousedown', () => {
		panel.floor[panel.nowFloor].addItem(new Item(event.target.id, event.clientX, event.clientY));
		let onMouseMove = () => {
			let floor = panel.floor[panel.nowFloor];
			floor.items[floor.items.length-1].move(event.clientX, event.clientY);
			removeSelection();
		};
		let onMouseUp = () => {
			document.removeEventListener('mousemove', onMouseMove);
			document.removeEventListener('mouseup', onMouseUp);
			let floor = panel.floor[panel.nowFloor];
			floor.items[floor.items.length-1].checkPosition(event.clientX, event.clientY);
		};
		document.addEventListener('mousemove', onMouseMove);
		document.addEventListener('mouseup', onMouseUp);
	});
}

document.getElementById("submit").addEventListener('click', async () => {
	panel.floor[panel.nowFloor].recordText();
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
			let target = Object.assign({}, wall);
			delete target.width;
			delete target.isSelected;
			newFloor.walls.push(target);
		});
		floor.rooms.forEach(room => {
			let target = Object.assign({}, room);
			target.text = floor.text[target.colorIndex]? floor.text[target.colorIndex]: `room_${target.colorIndex+1}`;
			delete target.colorIndex;
			delete target.width;
			delete target.isSelected;
			newFloor.rooms.push(target);
		});
		floor.items.forEach(item => {
			let target = Object.assign({}, item);
			delete target.boundary;
			delete target.isSelected;
			newFloor.items.push(target);
		});
		floorplan.push(newFloor);
	});
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

function removeHighlight() {
	panel.removeRoomHighlight();
	panel.removeWallHighlight();
	panel.render();
}

function removeSelection() {
	if (document.selection) {
	  	document.selection.empty();
	} else {
	  	window.getSelection().removeAllRanges();
	}
}

async function getUser() {
    var account = localStorage.getItem("account");
    await $.get('./users/find/'+account, {}, (res) => {
        document.getElementById("UserImg").src = res.icon;
    });
}
$(document).on('click',"#bar1",function(){
    FB.getLoginStatus(function(response) {
        if (response.status === 'connected') {
            FB.logout(function(response) {
                // this part just clears the $_SESSION var
                // replace with your own code
                console.log(response)
                location.href='./index.html'
            });
        }
        else{
            localStorage.clear();
            location.href='./index.html'
        }
    });
});

(async function getFloorplan() {
	let response = await fetch('/readFloorplan', {
		body: JSON.stringify({ account: localStorage.getItem("account") }),
		headers: {
			"Content-Type": "application/json"
		},
		method: 'POST'
	}).then(res => {
		return res.json();
	});
	response = response.floorplan;
	if (response) {
		response.forEach((res, key) => {
			let corners = res.corners;
			corners.forEach(corner => {
				panel.floor[key].corners.push(new Point(corner.x, corner.y, 4));
			});
			let walls = res.walls;
			walls.forEach(wall => {
				panel.floor[key].walls.push(new Line(wall.corner1.x, wall.corner1.y, wall.corner2.x, wall.corner2.y, 2));
			});
			let rooms = res.rooms;
			panel.floor[key].colors.pop();
			rooms.forEach((room, index) => {
				panel.floor[key].text.push(room.text);
				panel.floor[key].colors.push(room.color);
				panel.floor[key].rooms.push(new Area(room.color, room.corner1.x, room.corner1.y, room.corner2.x, room.corner2.y, 1, index));
			});
			panel.floor[key].render();
			let items = res.items;
			items.forEach(item => {
				panel.floor[key].items.push(new Item(item.name, item.x, item.y));
			});
			panel.render();
		});
	}
})();
