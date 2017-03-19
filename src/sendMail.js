const nodemailer = require('nodemailer');
const config = require('./config');


const { email } = config;
const transporter = nodemailer.createTransport({
  host: email.host,
  port: 465,
  // secureConnection: true,
  auth: {
    user: email.user,
    pass: email.password,
  },
});

/**
 * 发送邮件
 * @params contents
 */
const sendEmail = (contents) => {
  transporter.sendMail({
    from: email.user,
    to: email.toUser,
    subject: 'login successfully',
    text: contents || 'test',
  }, (err, res) => {
    if (err) {
      console.log(err);
    } else {
      console.log(`Message sent: ${res.response}`);
    }

    transporter.close();
  });
};

sendEmail('测试是否发送成功');

module.exports = sendEmail;
