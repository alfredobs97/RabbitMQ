const rabbit = require('./app');
const queueEmail = 'email';
const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'nuestroEmail',
    pass: 'nuestraPass'
  }
});

function generateEmail(mail) {
  let mailOptions = {
    from: 'nuestroEmail',
    to: mail,
    subject: 'Your keys are ready!!',
    text: 'All your keys are already encoded and ready for you to download them'
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

rabbit
  .start()
  .then(channel => {
    console.log('Connected');
    channel.consume(queueEmail, async msg => {
      let configurationKey = JSON.parse(msg.content);
      console.log(' [x] Received %s', msg.content.toString());

      const mail = await generateEmail(configurationKey.mail);
      rabbit.sendKeyBack(channel, mail);

      //confirma que se ha enviado el correo y lo elimina de la cola

      channel.ack(msg);
      console.log(mail);
    });
  })
  .catch(err => console.log(err));
