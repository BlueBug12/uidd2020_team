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
router.post('/',async(req,res) => {
    const tasks = new Tasks({
        content:req.body.content,
        advise:req.body.advise,
        date:req.body.date,
        time:req.body.time
    });
    try {
        const savePost = await tasks.save();
        res.json(savePost);
    }catch(err){
        res.json({message:err});
    }

});

module.exports = router;