const router = require('express').Router();
const Order = require('../model/Order');
const User = require('../model/User');
const {orderValidation} = require('../validation');

router.post('/new', async (req, res) => {
    const {error} = orderValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const clientExist = await User.findOne({clientId: req.body.clientId});
    if(!clientExist) return res.status(400).send('Error: Client could not be found.');

    const order = new Order({
        clientId: req.body.clientId,
        total: req.body.total
    });

    try {
        const savedOrder = await order.save();
        res.status(201).send({
            message: 'Order successfully created.',
            user: user._id
        });
    } catch (err) {
        res.status(400).send(err);
    }
});

module.exports = router;