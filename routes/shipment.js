const router = require('express').Router();
const Shipment = require('../model/Shipment');
const Order = require('../model/Order');
const User = require('../model/User');
const {shipmentValidation} = require('../validation');
const verify = require('./verifyToken');

/**
 * Logged user only. Register a new shipment.
 * @route Post /shipment
 * @group Shipment - Operations about user
 * @param {Shipment.model} body.body.required
 * @returns {object} 201 - The new registered shipment.
 * @returns {Error}  default - Unexpected error
 */
router.post('/', verify, async (req, res) => {
    const {error} = shipmentValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const orderExist = await Order.findOne({_id: req.body.orderId});
    if(!orderExist) return res.status(400).send('Error: Order could not be found.');

    const clientExist = await User.findOne({_id: req.body.clientId});
    if(!clientExist) return res.status(400).send('Error: Client could not be found.');

    const shipment = new Shipment({
        orderId: req.body.orderId,
        clientId: req.body.clientId,
        receiverName: req.body.receiverName,
        receiverCpf: req.body.receiverCpf,
        isReceiverTheBuyer: req.body.isReceiverTheBuyer,
        coordinates: req.body.coordinates
    });

    try {
        const savedShipment = await shipment.save();
        res.status(201).send({
            message: 'Shipment successfully created.',
            user: savedShipment
        });
    } catch (err) {
        res.status(400).send(err);
    }
});

/**
 * Gets all saved shipments.
 * @route GET /shipment/all
 * @group Shipment - Operations about user
 * @returns {object} 200 - An array of shipment
 * @returns {Error}  default - Unexpected error
 */
router.get('/all', async (req, res) => {
    const shipments = await Shipment.find();
    res.send({count: shipments.length, shipments: shipments});
});

/**
 * Logged user only. Delete an user.
 * @route DELETE /shipment/{id}
 * @group Shipment - Operations about user
 * @param {string} id.path.required
 * @returns {object} 200 - Message
 * @returns {Error}  default - Unexpected error
 */
router.delete('/:id', verify, async(req, res) => {
    const {deletedCount} = await Shipment.deleteOne({ _id: req.params.id })
    res.send({
        message: deletedCount ? 'Shipment successfully deleted!' : 'There is no Shipment attached to this id.'   
    });
});

/**
 * Logged user only. Update an order.
 * @route PATCH /shipment/{id}
 * @group Shipment - Operations about users
 * @param {string} id.path.required
 * @param {Shipment.model} body.body.required
 * @returns {object} 200 - Message
 * @returns {Error}  default - Unexpected error
 */
router.patch('/:id', verify, async(req, res) => {
    const order = await Shipment.findOne({_id: req.params.id});
    if(!order) return res.status(400).send('Sorry bro! Wrong id.');

    const updatedShipment = await Shipment.updateOne({_id: req.params.id}, { 
        $set: {
            orderId: req.body.orderId,
            clientId: req.body.clientId,
            receiverName: req.body.receiverName,
            receiverCpf: req.body.receiverCpf,
            isReceiverTheBuyer: req.body.isReceiverTheBuyer,
            coordinates: req.body.coordinates
        }}
    );
       res.send({msg:'Shipment updated.', shipmentId: req.params.id});
});

module.exports = router;