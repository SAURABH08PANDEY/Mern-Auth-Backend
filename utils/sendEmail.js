const nodemailer = require('nodemailer');
require("dotenv").config();

const sendEmail=async(email, verificationToken)=> {
  
  let testAccount = await nodemailer.createTestAccount();


  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'felipe.rippin37@ethereal.email',
        pass: 'jkazNSdcB5wmt1Uf2V'
    }
});


let info = await transporter.sendMail({
  from: 'saurabhpandey8mar@gmail.com',
  to: 'hello@gmail.com',
  subject: 'verify email',
  html: `<a href="http://localhost:5000/api/v1/auth/verify-email?verificationToken=${verificationToken}&email=${email}">Verify Email</a>`,
});




// apiInstance
//   .sendTransacEmail({
//     sender,
//     to: recivers,
//     subject: 'Verify Your Account',
//     htmlContent:  `<a href="http://localhost:5000/api/v1/auth/verify-email?verificationToken=${verificationToken}&email=${email}">Verify Email</a>`,
//   })
//     .then(
//       function (data) {
//         console.log("API called successfully. Returned data: " + data);
//       }
//   )
//   .catch(function (error) {
//     console.error("............................",error);
//   }
// );
 
}

module.exports = sendEmail;