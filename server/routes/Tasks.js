const express = require('express');
const router = express.Router();
const Tasks = require('../models/Tasks');

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
    try {
        await Tasks.findOne({ "classcode":req.params.classcode}).exec(async (err, res2) => {
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
router.post('/',async(req,res) => {
    const tasks = new Tasks({
        content:req.body.content,
        advise:req.body.advise,
        date:req.body.date,
        time:req.body.time,
        author:req.body.author,
        classcode:req.body.classcode
    });
    try {
        const savePost = await tasks.save();
        res.json(savePost);
    }catch(err){
        res.json({message:err});
    }

});

module.exports = router;