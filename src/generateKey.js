const { generateKeyPair } = require('crypto');
const rabbit = require('./app');
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
    channel.consume(
      queueKey,
      async msg => {
        let configurationKey = JSON.parse(msg.content);
        console.log(' [x] Received %s', msg.content.toString());


        const keys = await generateKey(configurationKey.type);
        rabbit.sendKeyBack(channel, keys);

        //confirma que se ha generado la clave y la elimina de la cola
        channel.ack(msg);
        console.log(keys);
      },
    );
  })
  .catch(err => console.log(err));
