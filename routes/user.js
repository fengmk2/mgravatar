
/*
 * GET users listing.
 */

var User = require('../controllers/user');

exports.list = function(req, res){
  res.send("respond with a resource");
};

exports.signup = function (req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  User.addUser(username, password, function (err, result) {
    if (err) {
      return next(err);
    }
    if (!result.success) {
      return res.render('404', {message: result.message});
    }
    res.redirect('/login');
  });
};

exports.login = function (req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  User.authUser(username, password, function (err, user) {
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