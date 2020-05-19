const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    account:{ 
        type: String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    phone:{
        type:Number,
        require:true
    },
    classcode:{
        type:String,
        require:true
    },
    nickname:{
        type:String,
        require:true
    },
    icon:{
        type:String,
        require:true
    }
},{collection: 'Users'});

module.exports = mongoose.model('Users',UserSchema);