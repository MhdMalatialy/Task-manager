const nodemailer = require("nodemailer");
async function main(email,name,subject,body) {
if (email.match(/(@test.com||@example.com)$/)) {
  return console.log(email)
}
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user:process.env.EMAIL , // generated ethereal user
      pass: process.env.PASSWORD, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Mhd Mlatialy" <hamooda.mlatia@gmail.com>', // sender address
    to: email, // list of receivers
    subject, // Subject line
    // text: "hello from my node js ya sokra ", // plain text body
    html: `<html><h1> Dear ${name}. </h1><b>${body}.</b>  </html>`, // html body
  });

  // console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}
module.exports=main