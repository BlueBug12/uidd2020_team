module.exports = (app) => {

    app.post('/signin', (req, res) => {
        console.log(req.body);
        res.status(200).send({ message: 'okkk' });
    });

};
