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
                                console.log(build[0]);
                                console.log(build[0].icon);
                                item.icon = build[0].icon;
                            } 
                        });
                        console.log(item._id);
                        item._id = item._id.toString();
                        console.log(item._id);
                        tasks.push(item);
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
                                    users.push({_id:item._id.toString(),icon:item.icon});
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
        point:req.body.point
    });
    try {
        const savePost = await tasks.save();
        res.json(savePost);
    }catch(err){
        res.json({message:err});
    }

});
router.post('/expired',(req,res) => {
    console.log(req.body.id);
    console.log(mongoose.Types.ObjectId(req.body.id));
    var id = mongoose.Types.ObjectId(req.body.id);
    Tasks.find({ _id:id}).exec(async (err, res2) => {
        if (err) {
            console.log('fail to query:', err)
            return;
        }
        else{
            console.log(res2);
        }
    });
    Tasks.findOneAndUpdate({ _id:id}, { expired: 1 }, err => {
        console.log(err);
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
module.exports = router;