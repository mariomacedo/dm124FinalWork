const router = require('express').Router();
const User = require('../model/User');
const {registerValidation, loginValidation} = require('../validation');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const verify = require('./verifyToken');
const _ = require('lodash');

/**
 * Register a new user.
 * @route Post /user
 * @group User - Operations about user
 * @param {User.model} body.body.required
 * @returns {object} 201 - The new registered user.
 * @returns {Error}  default - Unexpected error
 */
router.post('/', verify, async (req, res) => {
    const {error} = registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const emailExist = await User.findOne({email: req.body.email});
    if(emailExist) return res.status(400).send('Error: e-mail has already been used.');

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword
    });

    try {
        const savedUser = await user.save();
        res.status(201).send({
            message: 'User successfully created.',
            user: _.pick(savedUser, ['_id', 'name', 'email'])
        });
    } catch (err) {
        res.status(400).send(err);
    }
});

/**
 * Login user.
 * @route Post /user/login
 * @group User - Operations about user
 * @param {LoginUser.model} body.body.required
 * @returns {object} 200 - The JWT token
 * @returns {Error}  default - Unexpected error
 */
router.post('/login', async (req, res) => {
    const {error} = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send('Sorry bro! Wrong E-mail or passsword.');

    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.status(400).send('Sorry bro! Wrong e-mail or Passsword.');

    // Creat and assign token
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send({message: 'Logged in', token: token});  
});

/**
 * Gets all saved users.
 * @route GET /user/all
 * @group User - Operations about user
 * @returns {object} 200 - An array of user
 * @returns {Error}  default - Unexpected error
 */
router.get('/all', async (req, res) => {
    const usersDb = await User.find();
    let users = new Array();
    usersDb.forEach(user => users.push(_.pick(user, ['_id', 'name', 'email'])));
    res.send({count: users.length, users: users});
});

/**
 * Logged user only. Update an user.
 * @route PATCH /user/{id}
 * @group User - Operations about user
 * @param {string} id.path.required
 * @param {User.model} body.body.required
 * @returns {object} 200 - Message
 * @returns {Error}  default - Unexpected error
 */
router.patch('/:id', verify, async(req, res) => {
    const user = await User.findOne({_id: req.params.id});
    if(!user) return res.status(400).send('Sorry bro! Wrong id.');

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    const updatedUser = await User.updateOne({_id: req.params.id}, { 
        $set: {
            name: req.body.name,
            email: req.body.email,
            password: hashPassword
        }}
    );
       res.send({msg:'User updated.', userId: req.params.id});
});

/**
 * Logged user only. Delete an user.
 * @route DELETE /user/{id}
 * @group User - Operations about user
 * @param {string} id.path.required
 * @returns {object} 200 - Message
 * @returns {Error}  default - Unexpected error
 */
router.delete('/:id', verify, async(req, res) => {
    const {deletedCount} = await User.deleteOne({ _id: req.params.id })
    res.send({
        message: deletedCount ? 'User successfully deleted!' : 'There is no user attached to this id.'   
    });
});

module.exports = router;
