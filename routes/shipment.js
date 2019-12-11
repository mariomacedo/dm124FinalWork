const router = require('express').Router();
const Shipment = require('../model/Shipment');
const Order = require('../model/Order');
const User = require('../model/User');
const {shipmentValidation} = require('../validation');

router.post('/new', async (req, res) => {
    const {error} = shipmentValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const orderExist = await Order.findOne({orderId: req.body.orderId});
    if(!orderExist) return res.status(400).send('Error: Order could not be found.');

    const clientExist = await User.findOne({clientId: req.body.clientId});
    if(!clientExist) return res.status(400).send('Error: Client could not be found.');

    const shipment = new Shipment({
        orderId: req.body.orderId,
        clientId: req.body.clientId,
        receiverName: req.body.receiverName,
        receiverCpf: req.body.receiverCpf,
        isReceiverTheBuyer: req.body.isReceiverTheBuyer,
        coordinates: req.body.coordinates,
    });

    try {
        const savedUser = await user.save();
        res.status(201).send({
            message: 'Shipment order successfully created.',
            user: user._id
        });
    } catch (err) {
        res.status(400).send(err);
    }
});

module.exports = router;