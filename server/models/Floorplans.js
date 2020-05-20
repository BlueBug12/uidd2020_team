const mongoose = require('mongoose');
const { Schema } = mongoose;

const FloorplanSchema = new Schema({
    account: String,
    floorplan: {
        corners: [{
            id: String,
            x: Number,
            y: Number
        }],
        walls: [{
            corner1: String,
            corner2: String
        }],
        rooms: [{
            text: String,
            color: String,
            start: {
                x: Number,
                y: Number
            },
            end: {
                x: Number,
                y: Number
            }
        }],
        items: [{

        }]
    }
});

mongoose.model('Floorplan', FloorplanSchema);