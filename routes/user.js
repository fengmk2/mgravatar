
/*
 * GET users listing.
 */

var path = require('path');
var fs = require('fs');
var EventProxy = require('eventproxy').EventProxy;
var User = require('../controllers/user');

exports.list = function(req, res){
  res.send("respond with a resource");
};

exports.signup = function (req, res, next) {
  var email = req.body.email;
  var password = req.body.password;
  User.add(email, password, function (err, result) {
    if (err) {
      return next(err);
    }
    if (!result.success) {
      return res.render('error', {message: result.message});
    }
    exports.signin(req, res, next);
  });
};

exports.signin = function (req, res, next) {
  var email = req.body.email;
  var password = req.body.password;
  User.auth(email, password, function (err, user) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next();
    }
    req.session.user = user;
    res.redirect('/profile');
  });
};

exports.logout = function (req, res, next) {
  req.session.user = null;
  res.redirect('/');
};

exports.profile = function (req, res, next) {
  var ep = EventProxy.create('user', 'emails', function (user, emails) {
    res.render('upload', {user: user, emails: emails});
  });
  ep.once('error', function (err) {
    ep.unbind();
    next(err);
  });
  User.get(req.session.user._id, function (err, user) {
    if (err) {
      return ep.emit('error', err);
    }
    ep.emit('user', user);
  });
  User.getEmails(req.session.user._id, function (err, emails) {
    if (err) {
      return ep.emit('error', err);
    }
    ep.emit('emails', emails);
  });
};

exports.upload = function (req, res, next) {
  var file = req.files && req.files.image;
  var email = req.body.email;
  var savedir = path.join(path.dirname(__dirname), 'public', 'avatars');
  var filename = file.hash + path.extname(file.filename);
  fs.rename(file.path, path.join(savedir, filename));
  var imageInfo = {
    path: filename,
    name: file.filename,
    size: file.size,
    lastModifiedDate: file.lastModifiedDate,
    mime: file.mime,
    hash: file.hash
  };
  User.addImage(req.session.user._id, email, imageInfo, function (err, result) {
    if (err) {
      return next(err);
    }
    res.redirect('/profile');
  });
};
