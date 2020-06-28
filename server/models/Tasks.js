const mongoose = require('mongoose');

const TaskSchema = mongoose.Schema({
    contnt:{ 
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
        id: String,
        state: Number
    }],
    expired:{
        type:Number
    },
    point:{
        type:Number
    },
    housework:{
        type:String
    }
},{collection: 'Tasks'});

module.exports = mongoose.model('Tasks',TaskSchema);