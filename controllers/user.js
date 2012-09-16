/*!
 * mgravatar - controllers/auth.js
 * Copyright(c) 2012 fengmk2 <fengmk2@gmail.com>
 * MIT Licensed
 */

"use strict";

/**
 * Module dependencies.
 */

var db = require('../common/db');
var crypto = require('crypto');

/**
 * md5 hash
 *
 * @param {String} s
 * @return {String} md5 hash string
 * @api public
 */
exports.md5 = function (s) {
  var md5sum = crypto.createHash('md5');
  md5sum.update(s, Buffer.isBuffer(s) ? 'binary' : 'utf8');
  return md5sum.digest('hex');
};

function createToken(username, password) {
  return exports.md5(password + username + password + username[0]);
}

exports.addUser = function (username, password, callback) {
  var token = createToken(username, password);
  db.user.findOne({
    email: username
  }, function (err, user) {
    if (err) {
      return callback(err);
    }
    if (user) {
      return callback(null, {success: false, message: 'User exists.'});
    }
    db.user.insert({
      email: username,
      password: token,
      createTime: Date.now()
    }, function (err) {
      if (err) {
        return callback(err);
      }
      callback(null, {success: true});
    });
  });
};

exports.authUser = function (username, password, callback) {
  var token = createToken(username, password);
  db.user.findOne({
    email: username,
    password: token
  }, callback);
};
