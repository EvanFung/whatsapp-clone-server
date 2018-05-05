import http from 'http';
import path from 'path';
import methods from 'methods';
import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import cors from 'cors';
import passport from 'passport';
import errorhandler from 'errorhandler';
import mongoose from 'mongoose';
const PORT = 8080;
//Create global app object
const app = express();

app.use(cors());

//normal express config defaults
app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(require('method-override')());
app.use(express.static(__dirname + '/public'));

app.use(
  session({
    secret: 'conduit',
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false
  })
);

app.use(errorhandler());

// mongoose.Promise = global.Promise;
//for convinience we using the mlab uri
mongoose.connect(
  'mongodb://evanfung:password@ds151809.mlab.com:51809/whatsapp-clone'
);
mongoose.connection
  .once('open', () => console.log('Connected to MongoLab instance.'))
  .on('error', error => console.log('Error connecting to MongoLab:', error));
mongoose.set('debug', true);

import './models/User';
import './config/passport';
import routes from './routes';
app.use(routes);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
//error handle middleware
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    errors: {
      message: err.message,
      error: {}
    }
  });
});

app.listen(PORT, () =>
  console.log(`Server is now running on http://localhost:${PORT}`)
);
