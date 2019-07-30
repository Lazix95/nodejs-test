"use strict";
const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper


  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: true, // true for 465, false for other ports
    auth: {
      user: 'lazar.matic666999@gmail.com', // generated ethereal user
      pass: 'foodOrder123' // generated ethereal password
    }
  });
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

  exports.sentMail = (restaurantName, {to, subject, text, html}) => {
    transporter.sendMail({
      from: restaurantName+' <'+ restaurantName +'@foodOrder.com>', // sender address
      to: to, // list of receivers
      subject: subject, // Subject line
      text: text, // plain text body
      html: html // html body
    }).catch(err => {
      console.log('err =========:::::::::::>>>>>>>> ',err)
    })
  }

