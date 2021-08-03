import nodemailer from 'nodemailer';
import {
  emailGmail, passwordGmail
} from '../settings';

export const sendEmail = {
  async mailSender(receiver) {
  // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      pool: true,
      maxConnections: 1,
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: emailGmail, // generated ethereal user
        pass: passwordGmail, // generated ethereal password
      }
    });
    const mailOptions = {
      from: 'admin@edunesis.com',
      to: receiver.email,
      subject: receiver.subject,
      text: receiver.message
    };
    // eslint-disable-next-line no-unused-vars
    return new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions)
        .then(() => {
          // console.log(`signup mail sent ${receiver.email}`);
          const feedback = {
            message: `signup mail sent to ${receiver.email}`,
            status: true
          };
          resolve(feedback);
        })
        .catch((err) => {
          // console.log(`signup mail could not be sent to ${receiver.email}`, err);
          const feedback = {
            message: `signup mail could not be sent to ${receiver.email}`,
            error: err,
            status: false
          };
          resolve(feedback);
        });
    });
  }
//   let info = await transporter.sendMail({
//     from: '"Fred Foo 👻" <foo@example.com>', // sender address
//     to: "bar@example.com, baz@example.com", // list of receivers
//     subject: "Hello ✔", // Subject line
//     text: "Hello world?", // plain text body
//     html: "<b>Hello world?</b>", // html body
//   });
};
