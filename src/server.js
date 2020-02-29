const express = require('express');
const app = express();
const rabbit = require('./rabbit');
const cors = require('cors');

app.use(express.json());

app.use(cors());

const getStartRabbit = async () => {
  rabbit
    .start()
    .then(channel => {
      app.get('/status', (req, res) => {
        if (channel) return res.sendStatus(200);

        return res.sendStatus(500);
      });

      app.post('/createKey', (req, res) => {
        console.log('Received a request with ', req.body);
        rabbit.sendKey(channel, req.body);
        res.sendStatus(200);
      });

      app.listen(8080, () => console.log('listen'));
    })
    .catch(err => console.log(err));
};

getStartRabbit();
