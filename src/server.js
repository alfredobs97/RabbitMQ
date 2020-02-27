const express = require('express');
const app = express();
const rabbit = require('./rabbit');

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

      app.listen(3000, () => console.log('listen'));
    })
    .catch(err => console.log(err));
};

getStartRabbit();
