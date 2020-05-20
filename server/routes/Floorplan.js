const mongoose = require('mongoose');
const Floorplan = mongoose.model("Floorplan");

module.exports = (app) => {

    app.post('/saveFloorplan', (req, res) => {
        let account = req.body.account;
        let floorplan = req.body.floorplan;
        Floorplan.find({ account: account }, (err, docs) => {
            if (!err) {
                if (docs.length == 0) {
                    Floorplan.insertMany([{
                        account: account,
                        floorplan: floorplan
                    }], err => {
                        if (!err) {
                            res.status(200).send({ isSuccess: true });
                        } else {
                            res.status(503).send({ isSuccess: false });
                        }
                    });
                } else {
                    Floorplan.findOneAndUpdate({ account: account }, { floorplan: floorplan }, err => {
                        if (!err) {
                            res.status(200).send({ isSuccess: true });
                        } else {
                            res.status(503).send({ isSuccess: false });
                        }
                    });
                }
            } else {
                res.status(503).send({ isSuccess: false });
            }
        });
    });

    app.post('/readFloorplan', (req, res) => {
        
    });

};
