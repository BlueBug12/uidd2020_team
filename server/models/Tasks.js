const mongoose = require('mongoose');

const TaskSchema = mongoose.Schema({
    content:{ 
        type: String,
    },
    advise:{
        type:String
    },
    date:{
        type:String
    },
    time:{
        type:String
    },
    author:{
        type:String
    },
    classcode:{
        type:String
    },
    icon:{
        type:String
    },
    region:{
        type:String
    },
    invite:[{
        type: String,
    }],
    participate:[{
        type: String,
    }],
    expired:{
        type:Number
    },
    point:{
        type:Number
    }

},{collection: 'Tasks'});

module.exports = mongoose.model('Tasks',TaskSchema);