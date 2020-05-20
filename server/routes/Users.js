const express = require('express');
const router = express.Router();
const Users = require('../models/Users');

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
router.post('/enroll',async(req,res) => {
    const users = new Users({
        account:req.body.account,
        password:req.body.password,
        name:req.body.name,
        phone:req.body.phone
    });
    try {
        const savePost = await users.save();
        res.json(savePost);
    }catch(err){
        res.json({message:err});
    }
});
router.post('/fbData',async(req,res) => {
    try {
        await Users.findOne({ "account":req.body.account}).exec(async (err, res) => {
            if (err) {
                console.log('fail to query:', err)
                return;
            }
            else{
                res.account = req.body.account;
                res.password = req.body.password;
                res.phone = " ";
                res.icon = req.body.url;
                console.log(res.account);
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

module.exports = router;