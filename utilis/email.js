const nodemailer = require("nodemailer");
const sendEmail = options => {
const transporter = nodemailer.createTransport({
  host:"smtp.mailtrap.io",
  port:25,
  // service:"gmail",
  auth:{
    user:"990264fa52f2c4",
    pass:"d2841d722a901b"

  }
});

// const mailOptions = {
//   from:"The Server",
//   to:"sasa1x20001@gmail.com",
//   text:"Eh y memo 3amla eh "
// }

transporter.sendMail(options);
return "Done";
}
module.exports = sendEmail;
