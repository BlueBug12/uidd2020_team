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


router.get('/memberlength',(req,resup) => {
    Users.find({ "classcode":req.query.classcode}).exec((err, res2) => {
        if (err) {
            console.log('fail to query:', err)
            return;
        }
        else{
            resup.send({length:res2.length})
        }
    }) 
})

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

//set task expired
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

//participate in game page
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

//load data to  invite page
router.post('/invite',async(req,res) => {
    try {
        temp = [];
        Tasks.find({"invite.id":  req.body.account,"expired":0}  ).exec(async (err, res2) => {
            if (err) {
                console.log('fail to query:', err)
                return;
            }
            else{
                const test = async function () {
                    return new Promise(async (resolve, reject) => {
                        res2.forEach(function(item,index){
                            item.invite.forEach( function(person){
                                
                                if(person.id == req.body.account && person.state === 1){
                                   Users.findOne({"account":item.author} ).exec((err, res4) => {
                                        if (err) {
                                            console.log('fail to query:', err)
                                            return;
                                        }
                                        else{
                                            item.author = res4.nickname;
                                            if(index == res2.length-1){
                                                resolve(true);
                                            }
                                        }
                                    });

                                    temp.push(item);
                                }
                            });
                        });
                        
                    });
                };
                test().then(r => {
                    if (r === true) {
                        res.send(temp);
                    }
                });
            }
        });
    }catch(err){
        res.json({message:err});
    }
});

//change invite state in invite page
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

//change invite state in invite page
router.post('/deny',(req,res) => {
    try {
        Tasks.findOne({"_id":req.body.id} ).exec(async (err, res2) => {
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

//load data to process page
router.post('/progress',(req,res) => {
    try {
        Tasks.find({ "participate.id": req.body.account}).exec(async (err, res2) => {
            if (err) {
                console.log('fail to query:', err)
                return;
            }
            else{
                res.send(res2);
            }
        });
    }catch(err){
        res.json({message:err});
    }
});

//set participate.state in process page 
router.post('/changestate:clearrefuse',(req,res)=>{
    try {
         Tasks.findOneAndUpdate({ "participate._id":req.body.id},{'$set': {
            'participate.$.state': req.body.state}}, function(err) {
            if (err) {
                console.log('fail to query:', err)
                return;
            }
            else{
                if(req.params.clearrefuse == "clear"){
                    Tasks.findByIdAndUpdate(mongoose.mongo.ObjectID(req.body._id),{'$pull': {
                        'verify': { 'state':0 }}},{upsert: true, new: true},function(err2,doc){
                        if (err2) {
                            console.log('fail to query:', err2)
                            return;
                        }
                        else{
                            res.status(200).send({ isSuccess: true });
                        }                       
                    })
                }
                else{
                    res.status(200).send({ isSuccess: true });
                }
            }
        });
    }catch(err){
        res.json({message:err});
    }
})


router


//load data to verify page
router.post('/verify',async(req,res) => {
    try {
        temp = [];
        check = 0;
        await Tasks.find({"participate.state":2}  ).exec((err, res2) => {
            if (err) {
                console.log('fail to query:', err)
                return;
            }
            else{
                res2.forEach(function(item){
                    item.participate.forEach(function(person){
                        if(person.state != 2){
                            check = 1; 
                        }
                     });
                     item.verify.forEach(function(person2){
                        if(person2.id == req.body.account){
                            check = 1; 
                        }
                     });
                     if(check == 0){
                         temp.push(item);
                     }
                     else{
                         check = 0;
                     }
                 });
                res.send(temp);
            }
        });
    }catch(err){
        res.json({message:err});
    }
});

//set verify state
router.post('/verifystate',(req,res)=>{
    try {
         Tasks.updateOne({ "_id":req.body.id},{'$push': {
            'verify': req.body.verify}}, function(err) {
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

//check if task is finish or failure
router.post('/checkstate',(req,res)=>{
    try {
        var temp = [];
        var length = 0;
        var agree = 0;
        var deny = 0;
        Users.find({ "classcode":req.body.classcode}).exec((err, res2) => {
            if (err) {
                console.log('fail to query:', err)
                return;
            }
            else{
                length = res2.length / 2 + 1;
                Tasks.find({ "participate.id": req.body.account,"participate.state":2}).exec((err, res3) => {
                    if (err) {
                        console.log('fail to query:', err)
                        return;
                    }
                    else{
                        res3.forEach(function(item){
                            item.verify.forEach(function(person){
                                if(person.state == 0){
                                    deny++;
                                }
                                else{
                                    agree++;
                                }
                            });
                            if(agree >= length){
                                item.participate.forEach(async function(member){
                                    member.state = 3;
                                    await Users.findOne({"account":member.id} ).exec((err, res4) => {
                                        if (err) {
                                            console.log('fail to query:', err)
                                            return;
                                        }
                                        else{
                                            res4.point = item.point;
                                            res4.save();
                                        }
                                    });
                                });
                            }
                            else if(deny >= length){
                                item.participate.forEach(function(member){
                                    member.state = 4;
                                });
                            }
                            item.save();
                            agree = 0;
                            deny = 0;
                        });
                        res.status(200).send({ isSuccess: true });
                    }
                });
            }
        });
    }catch(err){
        res.json({message:err});
    }
})

//get user finish task
router.post('/finished',(req,res)=>{
    try {
        console.log(req.body.account);
        Tasks.find({ "participate.id": req.body.account,"participate.state":3}).exec(async (err, res2) => {
            if (err) {
                console.log('fail to query:', err)
                return;
            }
            else{
                res.send(res2);
            }
        });
    }catch(err){
        res.json({message:err});
    }
})
module.exports = router;