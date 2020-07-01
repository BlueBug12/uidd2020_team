const mongoose = require('mongoose');
const Floorplan = mongoose.model("Floorplan");
const Users = require('../models/Users');

module.exports = (app) => {

    app.post('/saveFloorplan', (req, res) => {
        let account = req.body.account;
        let floorplan = req.body.floorplan;
        Users.find({ account: account }, (err, users) => {
            if (!err) {
                Floorplan.find({ class: users[0].classcode }, (err, docs) => {
                    if (!err) {
                        if (docs.length == 0) {
                            Floorplan.insertMany([{
                                class: users[0].classcode,
                                floorplan: floorplan
                            }], err => {
                                if (!err) {
                                    res.status(200).send({ isSuccess: true });
                                } else {
                                    res.status(503).send({ isSuccess: false });
                                }
                            });
                        } else {
                            Floorplan.findOneAndUpdate({ class: users[0].classcode }, { floorplan: floorplan }, err => {
                                console.log(err)
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
            } else {
                res.status(503).send({ isSuccess: false });
            }
        });
    });

    app.post('/readFloorplan', (req, res) => {
        let account = req.body.account;
        Users.find({ account: account }, (err, users) => {
            if (!err) {
                Floorplan.find({ class: users[0].classcode }, (err, docs) => {
                    if (!err) {
                        res.status(200).send({ floorplan: docs[0]? docs[0].floorplan: [] });
                    } else {
                        res.status(503).send({ isSuccess: false });
                    }
                });
            } else {
                res.status(503).send({ isSuccess: false });
            }
        });
    });

};
