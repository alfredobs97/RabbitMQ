const amqp = require('amqplib/callback_api');
const queueEmail = 'email';
const queueKey = 'key';
const queueKeyBack = 'keyBack';

module.exports = {
  start: start,
  sendKey: sendKey,
  sendEmail: sendEmail
};

async function start() {
  const server = await createConnection('amqp://rabbitmq:rabbitmq@rabbitmq');
  const channel = await createChannel(server);

  // crear las colas al arrancar porque si no va a petar cuando empiecen a escuchar por estas colas
  channel.assertQueue(queueKeyBack, {
    durable: true
  });

  channel.assertQueue(queueKey, {
    durable: true
  });

  channel.assertQueue(queueEmail, {
    durable: true
  });

  return channel;
}

function createConnection(connectionString) {
  return new Promise((resolve, reject) => {
    amqp.connect(connectionString, function(error0, connection) {
      if (error0) reject(error0);
      resolve(connection);
    });
  });
}

function createChannel(connection) {
  return new Promise((resolve, reject) => {
    connection.createChannel(function(error1, channel) {
      if (error1) reject(error1);
      resolve(channel);
    });
  });
}

function sendKey(channel, keyData) {
  return channel.sendToQueue(queueKey, Buffer.from(JSON.stringify(keyData)));
}

function sendEmail(channel, emailData) {
  return channel.sendToQueue(
    queueEmail,
    Buffer.from(JSON.stringify(emailData))
  );
}