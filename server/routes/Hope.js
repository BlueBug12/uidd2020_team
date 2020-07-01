const mongoose = require('mongoose');
const Hopes = mongoose.model("Hope");

module.exports = (app) => {

    app.post('/saveHope', (req, res) => {
        let classcode = req.body.classcode;
        let data = req.body.data;
        Hopes.findOneAndUpdate({ classcode: classcode }, { hope: data }, (err) => {
            if (err) {
                res.status(503).send({ isSuccess: false });
            }
        });
    });

    app.post('/readHope', (req, res) => {
        let classcode = req.body.classcode;
        Hopes.find({ classcode: classcode }, (err, docs) => {
            if (!err) {
                res.status(200).send({ data: docs[0].data });
            } else {
                res.status(503).send({ isSuccess: false });
            }
        });
    });

};
