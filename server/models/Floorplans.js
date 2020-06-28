const mongoose = require('mongoose');
const { Schema } = mongoose;

const FloorplanSchema = new Schema({
    class: String,
    floorplan: [{
        corners: [{
            id: String,
            x: Number,
            y: Number
        }],
        walls: [{
            corner1: {
                x: Number,
                y: Number
            },
            corner2: {
                x: Number,
                y: Number
            }
        }],
        rooms: [{
            text: String,
            color: String,
            corner1: {
                x: Number,
                y: Number
            },
            corner2: {
                x: Number,
                y: Number
            }
        }],
        items: [{
            name: String,
            x: Number,
            y: Number,
            width: Number,
            height: Number,
            rotation: Number
        }]
    }]
});

mongoose.model('Floorplan', FloorplanSchema);
