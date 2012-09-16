var path = require('path');
var User = require('../controllers/user');

// /avatar/:HASH
exports.index = function (req, res, next) {
  var hash = req.params.hash;
  User.getEmail(hash, function (err, email) {
    if (err) {
      return next(err);
    }
    var index = 0;
    var info = null;
    if (email) {
      index = email.index || 0;
      info = email.images[index];
    }
    if (!info) {
      return next();
    }

    var savedir = path.join(path.dirname(__dirname), 'public', 'avatars');
    res.sendfile(info.path, {root: savedir});

    index++;
    if (index >= email.images.length) {
      index = 0;
    }
    User.visitEmail(hash, index);
  });
};