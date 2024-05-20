const express = require('express');
const userRouter = express.Router();
const User = require('../models/User.js');
const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken');
const passport = require('passport');
require('dotenv').config();
const jwtSecret = process.env.JWTSECRET;
const message = { msgBody: "Error has occured", msgError: true };

const signToken = (userID) => {
    return JWT.sign(
        {
            iss: "https://fullstack-vite.vercel.app",
            sub: userID,
        },
        process.env.JWTTOKEN,
        { expiresIn: '365d' }
    );
};

userRouter.post('/register-with-wallet', (req, res) => {
    const { address } = req.body;
    // check if user already exists
    User.findOne({ address: address.toLowerCase() }).exec((err, user) => {
        if (err) res.status(500).json({ message });
        else if (user) {
            console.log("user")
            const token = signToken(user._id);
            res.cookie('user_token', token, { httpOnly: true, sameSite: true });
            res.status(200).json({ user });
        } else {
            const newUser = new User({
                address: address.toLowerCase(),
                username: "user_" + address.slice(2,6),
                profileImg: "https://i.redd.it/ivr8bevv4gl11.png",
            });
            newUser.save((err, user) => {
                if (err) res.status(500).json({ message });
                else {
                    const token = signToken(user._id);
                    res.cookie('user_token', token, { httpOnly: true, sameSite: true });
                    res.status(200).json({ user, "new": true });
                }
            });
        }
    });
});

// get current user info
userRouter.get("/info", passport.authenticate("jwt", { session: false }), (req, res) => {
    User.findById({ _id: req.user._id }).exec((err, user) => {
        if (err) {
            res.status(500).json({ message });
        } else {
            res.status(200).json({ user });
        }
    });
});

userRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const userDoc = await User.findOne({ email });
    if (userDoc) {
        const passOk = bcrypt.compareSync(password, userDoc.password);
        if (passOk) {
            jwt.sign({
                email: userDoc.email,
                id: userDoc._id
            }, jwtSecret, {}, (err, token) => {
                if (err) throw err;
                res.cookie('token', token).json(userDoc);
            });
        } else {
            res.status(422).json('pass not ok');
        }
    } else {
        res.json('not found');
    }
});

userRouter.get('/profile', (req, res) => {
    const { token } = req.cookies;
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            if (err) throw err;
            const { name, email, _id } = await User.findById(userData.id);
            res.json({ name, email, _id });
        });
    } else {
        res.json(null);
    }
});

userRouter.post('/logout', (req, res) => {
    res.cookie('token', '').json(true);
});

userRouter.get('/collected/:address', async (req, res) => {

    try {
        const { address } = req.params;

        // Find the user by their address and populate the tokenArray
        const user = await User.findOne({ address: address.toLowerCase() }).populate({
            path: 'tokenArray',
            options: { sort: { createdAt: -1 } } // Sort tokenArray by createdAt in descending order
        });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Return the populated tokenArray
        res.json(user.tokenArray);
    } catch (error) {
        console.error("Error fetching user tokens:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


module.exports = userRouter;