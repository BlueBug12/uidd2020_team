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
    gender:{
        type:String,
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
    },
    birthday:{
        type:String,
        require:true
    },
    mail:{
        type:String,
        require:true
    },
    point:{
        type:Number,
        require:true
    }
},{collection: 'Users'});

module.exports = mongoose.model('Users',UserSchema);