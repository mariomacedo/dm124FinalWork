const router = require('express').Router();
const Order = require('../model/Order');
const User = require('../model/User');
const {orderValidation} = require('../validation');
const verify = require('./verifyToken');

router.post('/new', verify, async (req, res) => {
    const {error} = orderValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const clientExist = await User.findOne({_id: req.body.clientId});
    if(!clientExist) return res.status(400).send('Error: Client could not be found.');

    const order = new Order({
        clientId: req.body.clientId,
        total: req.body.total
    });

    try {
        const savedOrder = await order.save();
        res.status(201).send({
            message: 'Order successfully created to '+ clientExist.name +'.',
            savedOrder: savedOrder
        });
    } catch (err) {
        res.status(400).send(err);
    }
});

router.get('/all', async (req, res) => {
    const ordersDb = await Order.find();
    res.send(ordersDb);
});

module.exports = router;