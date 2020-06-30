const express = require('express');
const router = express.Router();
const Users = require('../models/Users');
const mongoose = require('mongoose');
const Tasks = require('../models/Tasks');
var mongo = require('mongodb').MongoClient;
var obejct_id = require('mongodb').ObjectId;

router.get('/', async (req,res) => {
    try {
        const tasks = await Tasks.find();
        res.json(tasks);
    }catch(err){
        res.json({message:err});
    }

});

//get whether mission has been accepted
router.get('/isaccepted',async(req,resup) => {
    var temp;
    try {
        await Tasks.findOne({ "_id":req.query.id}).exec(async (err, res) => {
            if (err) {
                console.log('fail to query:', err)
                return;
            }
            else{           
                temp = (res.participate==null)  ? false : true
                resup.status(200).send({ isaccepted: temp });
            }
        });
    }catch(err){
        resup.json({message:err});
    }
});

//get specific classcode data
router.get('/:classcode',async(req,res) => {
    var tasks = [];
    var users = [];
    try {
        await Tasks.find({ "classcode":req.params.classcode ,"expired":0}).exec(async (err, res2) => {
            if (err) {
                console.log('fail to query:', err)
                return;
            }
            else{
                if(res2 == null){
                    res.send("null");   
                }
                else{
                    res2.forEach(async function(item){
                        await Users.find({ "account":item.author}).exec( (err1, build) => {
                            if (err1) {
                                console.log('fail to query:', err1)
                                return;
                            }
                            else{
                                item.icon = build[0].icon;
                            } 
                        });
                        if(item.participate == null)
                        {
                            item._id = item._id.toString();
                            tasks.push(item);
                        }
                    });
                    await Users.find({ "classcode":req.params.classcode}).exec((err2, member) => {
                        if (err2) {
                            console.log('fail to query:', err2)
                            return;
                        }
                        else{
                            if(member == null){
                                res.send("null");   
                            }
                            else{
                                member.forEach(function(item){
                                    users.push({_id:item._id.toString(),icon:item.icon,account:item.account});
                                  });
                                  res.send({
                                    task: tasks,
                                    user: users
                                  });
                            }
                        }
                    });
                    
                }
            }
        });
    }catch(err){
        res.json({message:err});
    }
});

//save task data
router.post('/',async(req,res) => {
    const tasks = new Tasks({
        content:req.body.content,
        advise:req.body.advise,
        date:req.body.date,
        time:req.body.time,
        author:req.body.author,
        classcode:req.body.classcode,
        icon:req.body.icon,
        region:req.body.region,
        expired:0,
        point:req.body.point,
        participate:null,
        region_content:req.body.region_content
    });
    try {
        const savePost = await tasks.save();
        res.json(savePost);
    }catch(err){
        res.json({message:err});
    }

});
router.post('/expired',(req,res) => {
    var id = mongoose.Types.ObjectId(req.body.id);
    Tasks.findOneAndUpdate({ _id:id}, { expired: 1 }, err => {
        console.log(err);
        if (!err) {
            res.status(200).send({ isSuccess: true });
        } else {
            res.status(503).send({ isSuccess: false });
        }
    });
});

router.post('/changestate',(req,res) => {
    Tasks.findOneAndUpdate({ "participate._id":req.body.id}, { "$set": { "participate.$.state" : 2 } }, err => {
        if (!err) {
            res.status(200).send({ isSuccess: true });
        } else {
            res.status(503).send({ isSuccess: false });
        }
    });
});

router.post('/participate',async(req,res) => {
    try {
        await Tasks.findOne({ "_id":req.body.id}).exec(async (err, res) => {
            if (err) {
                console.log('fail to query:', err)
                return;
            }
            else{

                res.invite = req.body.invite;
                res.participate = req.body.participate;
                res.save(function (err) {
                    if (err) {
                        console.log(err);
                    }
                });
            }
        });
    }catch(err){
        res.json({message:err});
    }
    res.status(200).send({ isSuccess: true });
});

router.post('/invite',async(req,res) => {
    try {
        temp = [];
        await Tasks.find({"invite.id":  req.body.account,"expired":0}  ).exec(async (err, res2) => {
            if (err) {
                console.log('fail to query:', err)
                return;
            }
            else{
                res2.forEach(function(item){
                    item.invite.forEach(function(person){
                        if(person.id == req.body.account && person.state === 1){
                            temp.push(item); 
                        }
                     });
                 });
                res.send(temp);
            }
        });
    }catch(err){
        res.json({message:err});
    }
});

router.post('/agree',async(req,res) => {
    try {
        await Tasks.updateOne({ "_id":req.body.id},{ $addToSet: { participate: req.body.participate }}, function(err) {
            if (err) {
                console.log('fail to query:', err)
                return;
            }
            else{
               Tasks.findOne({"_id":req.body.id} ).exec(async (err, res2) => {
                    if (err) {
                        console.log('fail to query:', err)
                        return;
                    }
                    else{
                        res2.invite.forEach(function(person){
                            if(person.id === req.body.account){
                                 person.state = 2; 
                            }
                         });
                         res2.save();
                        res.status(200).send({ isSuccess: true });
                    }
                });
            }
        });
    }catch(err){
        res.json({message:err});
    }
});

router.post('/deny',async(req,res) => {
    try {
        await Tasks.findOne({"_id":req.body.id} ).exec(async (err, res2) => {
            if (err) {
                console.log('fail to query:', err)
                return;
            }
            else{
                res2.invite.forEach(function(person){
                    if(person.id === req.body.account){
                         person.state = 0; 
                    }
                 });
                 res2.save();
                res.status(200).send({ isSuccess: true });
            }
        });
    }catch(err){
        res.json({message:err});
    }
});

router.post('/progress',async(req,res) => {
    try {
        await Tasks.find({ "participate.id": req.body.account,"participate.state": 1}).exec(async (err, res2) => {
            if (err) {
                console.log('fail to query:', err)
                return;
            }
            else{
                console.log(req.body.account);
                res.send(res2);
            }
        });
    }catch(err){
        res.json({message:err});
    }
});

router.post('/changestate',async(req,res)=>{
    try {
        await Tasks.updateOne({ "_id":req.body.id,"participate.id":req.body.account},{'$set': {
            'participate.$.state': req.body.state}}, function(err) {
            if (err) {
                console.log('fail to query:', err)
                return;
            }
            else{
                res.status(200).send({ isSuccess: true });
            }
        });
    }catch(err){
        res.json({message:err});
    }
})
module.exports = router;