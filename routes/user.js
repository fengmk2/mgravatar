
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
      return next(new Error('Email or password wrong.'));
    }
    req.session.user = user;
    res.redirect('/profile');
  });
};

exports.logout = function (req, res, next) {
  req.session.user = null;
  res.redirect('/');
};

// GET /profile
exports.profile = function (req, res, next) {
  if (!req.session.user) {
    return res.redirect('/');
  }
  User.get(req.session.user._id, function (err, user) {
    if (err) {
      return next(err);
    }
    var hash = User.md5(req.query.email || req.session.user.email);
    res.render('upload', {user: user, hash: hash});
  });
};

// GET /profile/upload
exports.listImages = function (req, res, next) {
  var email = User.md5(req.query.email || req.session.user.email);
  User.getEmail(email, function (err, email) {
    if (err) {
      return next(err);
    }
    if (!email) {
      return res.send([]);
    }
    var infos = email.images || [];
    var images = [];
    infos.forEach(function (info) {
      images.push({
        name: info.name,
        size: info.size,
        thumbnail_url: '/avatars/' + info.path,
        url: '/avatars/' + info.path,
      });
    });
    res.send(images);
    // res.send([
    //    { "delete_type" : "DELETE",
    //     "delete_url" : "http://localhost:8888/files/image2012-08-02-143349-2.jpg",
    //     "name" : "image2012-08-02-143349-2.jpg",
    //     "size" : 298289,
    //     "thumbnail_url" : "http://localhost:8888/files/thumbnail/image2012-08-02-143349-2.jpg",
    //     "url" : "http://localhost:8888/files/image2012-08-02-143349-2.jpg"
    //   },
    //   { "delete_type" : "DELETE",
    //     "delete_url" : "http://localhost:8888/files/js-error.png",
    //     "name" : "js-error.png",
    //     "size" : 186361,
    //     "thumbnail_url" : "http://localhost:8888/files/thumbnail/js-error.png",
    //     "url" : "http://localhost:8888/files/js-error.png"
    //   },
    //   { "delete_type" : "DELETE",
    //     "delete_url" : "http://localhost:8888/files/Screensho%20assa%20(1).png",
    //     "name" : "Screensho assa (1).png",
    //     "size" : 16617,
    //     "thumbnail_url" : "http://localhost:8888/files/thumbnail/Screensho%20assa%20(1).png",
    //     "url" : "http://localhost:8888/files/Screensho%20assa%20(1).png"
    //   }
    // ]);
  });
};

exports.upload = function (req, res, next) {
  var file = req.files.files[0];
  var email = req.body.email || req.session.user.email;
  var savedir = path.join(path.dirname(__dirname), 'public', 'avatars');
  var filename = file.hash + path.extname(file.filename);
  fs.rename(file.path, path.join(savedir, filename));
  var info = {
    path: filename,
    name: file.filename,
    size: file.size,
    lastModifiedDate: file.lastModifiedDate,
    mime: file.mime,
    hash: file.hash
  };
  User.addImage(req.session.user._id, email, info, function (err, result) {
    if (err) {
      return next(err);
    }
    res.send([{
      name: info.name,
      size: info.size,
      thumbnail_url: '/avatars/' + info.path,
      url: '/avatars/' + info.path,
    }]);
  });
};
