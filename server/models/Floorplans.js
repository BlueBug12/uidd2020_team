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
            corner1: { id: String },
            corner2: { id: String }
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

        }]
    }]
});

mongoose.model('Floorplan', FloorplanSchema);