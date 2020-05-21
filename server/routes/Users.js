const express = require('express');
const router = express.Router();
const Users = require('../models/Users');

//Check login
router.post('/',async(req,res) => {
    try {
        await Users.findOne({'account':req.body.account,'password': req.body.password }).exec(async (err, res2) => {
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
                    "account":"${res2.account}"
                }`));
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
        phone:req.body.phone,
        icon:req.body.icon
    });
    try {
        const savePost = await users.save();
        res.json(savePost);
        res.send(savePost);
    }catch(err){
        res.json({message:err});
    }
});

//store fb login data
router.post('/CheckData',async(req,res) => {
    try {
        console.log(req.body.account);
        await Users.findOne({ "account":req.body.account}).exec(async (err, res2) => {
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
                        phone:req.body.phone,
                        icon:req.body.url
                    });
                    await users.save();
                    res.send(JSON.parse(`{
                        "first": "true"
                    }`));
                }
                else{
                    res.send(JSON.parse(`{
                        "first": "false"
                    }`));
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
module.exports = router;
