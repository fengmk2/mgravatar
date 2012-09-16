
/*
 * GET users listing.
 */

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

exports.profile = function (req, res, next) {
  //console.log(locals);
  User.get(req.session.user._id, function (err, user) {
    if (err) {
      return next(err);
    }
    res.render('upload');
  });
};

exports.upload = function (req, res, next) {
  var file = req.files && req.files.image;
  var email = req.body.email;

};