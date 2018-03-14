var app = require('express')();
var nodemailer = require('nodemailer');
require('dotenv').config();

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD
    }
});

var mailOptions = {
    from: 'buivanphuocforyou@gmail.com',
    to: 'buivanphuoc1802@gmail.com',
    subject: 'Sending Email using Node.js',
    text: 'That was easy!'
};

app.get('/', function(req, res) {
    res.send("Hello world!");
});

app.post('/sendMail', function (req, res) {
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
            throw error;
        } 
        console.log('Email sent: ' + info.response);
        res.send(info);
    });
});

app.listen(3000);
