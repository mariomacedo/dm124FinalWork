const router = require('express').Router();
const User = require('../model/User');
const {registerValidation, loginValidation} = require('../validation');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const verify = require('./verifyToken');
const _ = require('lodash');

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
 * This function comment is parsed by doctrine
 * @route GET /api
 * @group foo - Operations about user
 * @param {string} email.query.required - username or email - eg: user@domain
 * @param {string} password.query.required - user's password.
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 */
router.get('/all', async (req, res) => {
    const usersDb = await User.find();
    let users = new Array();
    usersDb.forEach(user => users.push(_.pick(user, ['_id', 'name', 'email'])));
    res.send({count: users.length, users: users});
});

router.patch(':id', verify, async(req, res) => {
    const usersDb = await User.update(req.params.id,{ 
        $set: {
            name: req.body.name,
            email: req.body.email
        }}
    );
    let users = new Array();
    usersDb.forEach(user => users.push(_.pick(user, ['_id', 'name', 'email'])));
    res.send(users);
});

router.delete(':id', verify, async(req, res) => {
    const deletedUser = await User.remove(req.params.id);
    res.send({
        message: `User ${deletedUser.name} successfully deleted!`,
        deletedUser: deletedUser
    });
});

module.exports = router;
