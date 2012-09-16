
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
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
  // pass a secret to cookieParser() for signed cookies
  app.use(express.cookieParser('mk2 is cool'));
  // add req.session cookie support
  app.use(express.cookieSession());
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/developer/api', developer.api);
app.get('/avatar/upload', avatar.upload);
app.get('/users', user.list);
app.post('/profile/upload', user.upload);
app.post('/signin', user.signin);
app.post('/signup', user.signup);
app.get('/error', routes.error);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
