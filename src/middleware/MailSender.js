// file modified from https://nodemailer.com/about/
const nodemailer = require('nodemailer');

async function newUserEmail(email, firstName, lastName, status, presentationLocation) {
  try {
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      // host: 'smtp.ethereal.email',
      // port: 587,
      // secure: false, // true for 465, false for other ports
      service: 'gmail',
      auth: {
        user: 'errandhub21@gmail.com', // generated ethereal user
        pass: '@errandhub21#', // generated ethereal password
      },
    });

    // setup email data with unicode symbols
    const mailOptions = {
      from: '"Send It 👻" <no-reply@sendit.com>',
      to: email,
      subject: 'Parcel delivery information',
      html: `Dear ${firstName} ${lastName}, <br><br>
      Your parcel delivery order information has been changed as follows: <br> <br>
      <ul>
        <li>Status : <strong>${status}</strong></li>
        <li>Present Location : <strong>${presentationLocation}</strong></li>
      </ul>
      <br><br>
      Thank you for using our platform.
      `,
    };
    // send mail with defined transport object
    await transporter.sendMail(mailOptions);
  } catch (error) {
    // console.log(error);
  }
}

module.exports = {
  newUserEmail,
};
