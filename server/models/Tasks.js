const mongoose = require('mongoose');

const TaskSchema = mongoose.Schema({
    content:{ 
        type: String,
        require:true
    },
    advise:{
        type:String,
        require:true
    },
    date:{
        type:String,
        require:true
    },
    time:{
        type:String,
        require:true
    },
    author:{
        type:String,
        require:true
    },
    classcode:{
        type:String,
        require:true
    },
    icon:{
        type:String,
        require:true
    },
    region:{
        type:String,
        require:true
    }

},{collection: 'Tasks'});

module.exports = mongoose.model('Tasks',TaskSchema);