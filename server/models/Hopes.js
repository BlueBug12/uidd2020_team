const mongoose = require('mongoose');
const { Schema } = mongoose;

const HopeSchema = new Schema({
    class: String,
    hope: [{
        name: String,
        hope: String
    }]
});

mongoose.model('Hope', HopeSchema);
