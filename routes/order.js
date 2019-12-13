const router = require('express').Router();
const Order = require('../model/Order');
const User = require('../model/User');
const {orderValidation} = require('../validation');
const verify = require('./verifyToken');

/**
 * Register a new user.
 * @route Post /order
 * @group Order - Operations about orders
 * @param {Order.model} body.body.required
 * @returns {object} 201 - The new registered order.
 * @returns {Error}  default - Unexpected error
 */
router.post('/', verify, async (req, res) => {
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

/**
 * Gets all saved orders.
 * @route GET /order/all
 * @group Order - Operations about orders
 * @returns {object} 200 - An array of order.
 * @returns {Error}  default - Unexpected error
 */
router.get('/all', async (req, res) => {
    const ordersDb = await Order.find();
    res.send(ordersDb);
});

/**
 * Logged user only. Update an order.
 * @route PATCH /order/{id}
 * @group Order - Operations about orders
 * @param {string} id.path.required
 * @param {Order.model} body.body.required
 * @returns {object} 200 - Message
 * @returns {Error}  default - Unexpected error
 */
router.patch('/:id', verify, async(req, res) => {
    const order = await Order.findOne({_id: req.params.id});
    if(!order) return res.status(400).send('Sorry bro! Wrong id.');

    const updatedOrder = await Order.updateOne({_id: req.params.id}, { 
        $set: {
            clientId: req.body.clientId,
            total: req.body.total
        }}
    );
       res.send({msg:'Order updated.', orderId: req.params.id});
});

/**
 * Logged user only. Delete an order.
 * @route DELETE /order/{id}
 * @group Order - Operations about orders
 * @param {string} id.path.required
 * @returns {object} 200 - Message
 * @returns {Error}  default - Unexpected error
 */
router.delete('/:id', verify, async(req, res) => {
    const {deletedCount} = await Order.deleteOne({ _id: req.params.id })
    res.send({
        message: deletedCount ? 'Order successfully deleted!' : 'There is no order attached to this id.'   
    });
});

module.exports = router;