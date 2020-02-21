const express = require('express');
const app = express();
const rabbit = require('./app');
const queueKeyBack = 'keyBack';

app.use(express.json());

const getStartRabbit = async () => {
  rabbit
    .start()
    .then(channel => {
      app.get('/status', (req, res) => {
        if (channel) return res.sendStatus(200);

        return res.sendStatus(500);
      });

      app.post('/createKey', (req, res) => {
        rabbit.sendKey(channel, req.body);
        res.sendStatus(200);
      });

      //TODO notificar al usuario que se ha creado su llave en el objeto keys { public: llavePublica, private: llavePrivada}
      channel.consume(
        queueKeyBack,
        msg => {
         // console.log(' [x] Received %s', msg.content.toString());

         //confirma que ha procesado el mensaje
         channel.ack(msg);
        },
      );

      app.listen(3000, () => console.log('listen'));
    })
    .catch(err => console.log(err));
};

getStartRabbit();
