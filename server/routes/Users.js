const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Users = require('../models/Users');
const { db } = require('../models/Users');


//Check login
router.post('/',(req,res) => {
    try {
        Users.findOne({'account':req.body.account,'password': req.body.password }).exec(async (err, res2) => {
            if (err) {
                console.log('fail to query:', err)
                return;
            }
            else{
                if(!res2) {
                    res.send(JSON.parse(`{
                        "text": "登入失敗！",
                        "account":"NULL"
                    }`));
                    return;
                }
                res.send(JSON.parse(`{
                    "text": "Hello ${res2.name}！",
                    "account":"${res2.account}",
                    "classcode": "${res2.classcode}"
                }`));
            }
        });
    }catch(err){
        res.json({message:err});
    }
});


router.get('/monsterstate',(req,res)=>{
    Users.findOne({account:req.query.account},(err,res2)=>{
        if (err) {
            res.status(503).send({ isSuccess: false });
        } else {
            res.send(res2.monster);
        }
    })
})


//check repeat account
router.post('/checkaccount',(req,res) => {
    try {
        Users.findOne({ "account":req.body.account}).exec(async (err, res2) => {
            if (err) {
                console.log('fail to query:', err)
                return;
            }
            else{
                if(res2 === null){
                    res.status(200).send({ enroll: true });   
                }
                else{
                    res.status(200).send({ enroll: false });
                }
            }
        });
    }catch(err){
        res.json({message:err});
    }
});


//store enroll data
router.post('/enroll',async(req,res) => {
    const users = new Users({
        account:req.body.account,
        password:req.body.password,
        name:req.body.name,
        icon:req.body.icon,
        gender:req.body.gender,
        birthday:req.body.birthday,
        mail:req.body.mail,
        point:0,
        monster:[1,1,1,1]
    });
    try {
        const savePost = await users.save();
        res.json(savePost);
    }catch(err){
        res.json({message:err});
    }
    // res.send({ account: req.body.account });
});

//store fb login data
router.post('/CheckData',(req,res) => {
    try {
        //console.log(req.body.account);
         Users.findOne({ "account":req.body.account}).exec(async (err, res2) => {
            if (err) {
                console.log('fail to query:', err);
                return;
            }
            else{
                if(res2 == null){
                    const users = new Users({
                        account:req.body.account,
                        password:req.body.password,
                        name:req.body.name,
                        icon:req.body.url,
                        gender:'未填',
                        birthday:'未填',
                        mail:req.body.mail,
                        point:0,
                        monster:[1,1,1,1]
                    });
                   users.save();
                   console.log(users.monster);
                    res.send(JSON.parse(`{
                        "first": "true"
                    }`));
                }
                else{
                    Users.findOneAndUpdate({ account: res2.account }, { icon: req.body.url }, (err,res3) => {
                        if(err)
                            console.log(err)
                        else{
                            res.send(JSON.parse(`{
                                "first": "false",
                                "classcode":"${res3.classcode}"
                            }`));
                        }
                    });

                }
            }
        });
    }catch(err){
        res.json({message:err});
    }
    //res.status(200).send({ isSuccess: true });
});

//store class info
router.post('/createclass',async(req,res) => {
    try {
        await Users.findOne({ "account":req.body.account}).exec(async (err, res) => {
            if (err) {
                console.log('fail to query:', err)
                return;
            }
            else{
                res.classcode = req.body.classcode;
                res.nickname = req.body.nickname;
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

//get specific user info
router.get('/find/:id',async(req,res) => {
    try {
        await Users.findOne({ "account":req.params.id}).exec(async (err, res2) => {
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

//get same classcode user data
router.get('/:id',async(req,res) => {
    try {
        await Users.find({ "classcode":req.params.id}).exec(async (err, res2) => {
            if (err) {
                console.log('fail to query:', err)
                return;
            }
            else{
                if(res2 == null){
                    res.send("null");   
                }
                else{
                    res.send(res2);
                }
            }
        });
    }catch(err){
        res.json({message:err});
    }
});
// for users to edit their personal information
router.post('/changedata',(req,res) => {
    var id = (req.body.id);
    Users.findOneAndUpdate({ account:id}, { 
        icon:req.body.icon,
        name:req.body.name,
        mail:req.body.mail,
        gender:req.body.gender,
        birthday:req.body.birthday,
        monster:[1,1,1,1]
    }, err => {
        console.log(err);
        if (!err) {
            res.status(200).send({ isSuccess: true });
        } else {
            res.status(503).send({ isSuccess: false });
        }
    });
});




router.post('/updatemonsterstate',(req,res)=>{
    Users.findOneAndUpdate({account:req.body.account},{monster:req.body.monster},(err,res2)=>{
        if (!err) {
            res2.point = res2.point -1 ;
            res2.save();
            res.status(200).send({isSuccess: true});
        } else {
            res.status(503).send({ isSuccess: false });
        }
    })
})

//update user point
router.post('/updatepoint',(req,res) => {
    try {
        Users.findOne({ "account":req.body.account}).exec(async (err, res2) => {
            if (err) {
                console.log('fail to query:', err)
                return;
            }
            else{
                res2.point = res2.point - req.body.point;;
                res2.save();
            }
        });
    }catch(err){
        res.json({message:err});
    }
});
module.exports = router;
