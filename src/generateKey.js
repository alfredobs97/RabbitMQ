const { generateKeyPair } = require('crypto');
const rabbit = require('./rabbit');
const queueKey = 'key';

function generateKey(type) {
  return new Promise((resolve, reject) => {
    generateKeyPair(
      type,
      {
        modulusLength: 8192,
        publicKeyEncoding: {
          type: 'spki',
          format: 'pem'
        },
        privateKeyEncoding: {
          type: 'pkcs8',
          format: 'pem',
          cipher: 'aes-256-cbc',
          passphrase: ''
        }
      },
      (err, publicKey, privateKey) => {
        if (err) return reject(err);

        const keys = {
          public: publicKey,
          private: privateKey
        };

        return resolve(keys);
      }
    );
  });
}

rabbit
  .start()
  .then(channel => {
    console.log('Connected');

    channel.consume(queueKey, async msg => {
      const configurationKey = JSON.parse(msg.content);
      const keys = await generateKey(configurationKey.type);

      keys.email = configurationKey.email;

      rabbit.sendEmail(channel, keys);

      //confirma que se ha generado la clave y la elimina de la cola
      channel.ack(msg);
      console.log('Llaves generadas y notificado para su envío');
    });
  })
  .catch(err => console.log(err));
