const router = require('express').Router();
const User = require('../model/User');
const {registerValidation, loginValidation} = require('../validation');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const verify = require('./verifyToken');
const _ = require('lodash');

router.post('/register', verify, async (req, res) => {
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
            user: user._id
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

router.get('/all', async (req, res) => {
    const usersDb = await User.find();
    let users = new Array();
    usersDb.forEach(user => users.push(_.pick(user, ['_id', 'name', 'email'])));
    res.send(users);
});

module.exports = router;
