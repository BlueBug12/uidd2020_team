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
        id: String,
        state:Number
    }],
    participate:[{
        id: String,
        state: Number,
        icon:String
    }],
    expired:{
        type:Number
    },
    point:{
        type:Number
    },
    verify:[{
        id: String,
        state: Number,
        icon:String
    }],
    region_content:{
        type:String
    }
    
},{collection: 'Tasks'});

module.exports = mongoose.model('Tasks',TaskSchema);