const config = {
  SERVICE: 'gmail',
  EMAIL: 'your gmail address',
  PASS: 'your password',
  QUEUE_EMAIL: 'email',
  QUEUE_KEY: 'key',
  QUEUE_KEY_BACK: 'keyBack',
};
module.exports = Object.freeze({ ...config });
//rename this to config, and set it with your Email and Password for the email sender
