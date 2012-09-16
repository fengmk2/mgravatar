
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , developer = require('./routes/developer')
  , avatar = require('./routes/avatar')
  , http = require('http')
  , path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set("view engine", "hbs");
  app.use(express.favicon());
  // pass a secret to cookieParser() for signed cookies
  app.use(express.cookieParser('mk2 is cool'));
  // add req.session cookie support
  app.use(express.cookieSession());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.use(function (req, res, next) {
  res.locals.currentUser = req.session.user;
  next();
});

app.use(app.router);

app.get('/', routes.index);
app.get('/developer/api', developer.api);
app.get('/avatar/upload', avatar.upload);
app.get('/users', user.list);
app.get('/profile', user.profile);
app.post('/profile/upload', user.upload);
app.post('/signin', user.signin);
app.post('/signup', user.signup);
app.get('/error', routes.error);

app.use(function (err, req, res, next) {
  // treat as 404
  if (~err.message.indexOf('not found')) return next();

  // log it
  console.error(err.stack);

  // error page
  res.status(500).render('error');
});

// assume 404 since no middleware responded
app.use(function (req, res, next) {
  res.status(404).render('404', { url: req.originalUrl });
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
