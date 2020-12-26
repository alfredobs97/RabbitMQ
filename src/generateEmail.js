const rabbit = require('./rabbit');
const nodemailer = require('nodemailer');
const config = require('./config');
console.log('config: ');
console.log(config);
const transporter = nodemailer.createTransport({
  service: config.SERVICE,
  auth: {
    user: config.EMAIL,
    pass: config.PASS,
  },
});

function generateEmail(userPreferences) {
  const mailOptions = {
    from: config.EMAIL,
    to: userPreferences.email,
    subject: 'Your keys are ready!!',
    text:
      'All your keys are already encoded and ready for you to download them',
    attachments: [
      {
        filename: 'publicKey.pem',
        content: Buffer.from(userPreferences.public, 'utf-8'),
      },
      {
        filename: 'privateKey.pem',
        content: Buffer.from(userPreferences.private, 'utf-8'),
      },
    ],
  };

  return new Promise((resolve, reject) => {
    console.log('creating email promise');
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) return reject(error);
      return resolve(info.response);
    });
  });
}

rabbit
  .start()
  .then((channel) => {
    console.log('Connected');

    channel.consume(config.QUEUE_EMAIL, async (msg) => {
      const keyAndEmail = JSON.parse(msg.content);
      console.log('sending email');
      console.log(keyAndEmail);
      const responseMailServer = await generateEmail(keyAndEmail);
      console.log(responseMailServer);
      //confirma que se ha enviado el correo y lo elimina de la cola

      channel.ack(msg);
      console.log('Respuesta del servidor de correo: ' + responseMailServer);
    });
  })
  .catch((err) => console.log(err));
