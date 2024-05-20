const express = require('express');
const Token = require('../models/Token.js');
const Message = require('../models/Message.js');
const messageRouter = express.Router();
const errMsg = { msgBody: "Error has occured", msgError: true };

messageRouter.post('/new-message', (req, res) => {
    const message = new Message(req.body.newMessage);
    message.save(err => {
        if (err) {
            res.status(500).json({ errMsg });
        }
        else {
            Token.findOneAndUpdate({ tokenAddress: req.body.newMessage.tokenAddress }, { $push: { messages: message } }, (err) => {
                if (err) { res.status(500).json({ errMsg }) }
                else {
                    res.status(200).json({ message: { msgBody: "Successfully updated messages", msgError: false } });
                }
            });
        }
    });
});

module.exports = messageRouter;