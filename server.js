const {https} = require('firebase-functions');
const next = require('next');
const admin = require('firebase-admin');

admin.initializeApp();

const dev = process.env.NODE_ENV !== 'production';
const app = next({dev, conf: {distDir: '.next'}});
const handle = app.getRequestHandler();

exports.server = https.onRequest((req, res) => {
  return app.prepare().then(() => handle(req, res));
});
