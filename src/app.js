const amqp = require('amqplib/callback_api');
const queueKey = 'key';
const queueKeyBack = 'keyBack';

module.exports = {
  start: start,
  sendKey: sendKey,
  sendKeyBack: sendKeyBack
};

async function start() {
  const server = await createConnection('amqp://rabbitmq:rabbitmq@localhost');
  const channel = await createChannel(server);

  // crear las dos colas al arrancar porque si no va a petar cuando empiecen a escuchar por estas colas
  channel.assertQueue(queueKeyBack, {
    durable: true
  });

  channel.assertQueue(queueKey, {
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

function sendKeyBack(channel, keys) {
  return channel.sendToQueue(queueKeyBack, Buffer.from(JSON.stringify(keys)));
}

/* amqp.connect('amqp://rabbitmq:rabbitmq@localhost', function(
  error0,
  connection
) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function(error1, channel) {
    channel.sendToQueue('cola1', Buffer.from('Hola mundo'));
  });
});
 */
