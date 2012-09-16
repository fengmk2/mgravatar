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

exports.get = function (id, callback) {
  db.user.findById(id, callback);
};

exports.add = function (email, password, callback) {
  var token = createToken(email, password);
  db.user.findOne({
    email: email
  }, function (err, user) {
    if (err) {
      return callback(err);
    }
    if (user) {
      return callback(null, {success: false, message: 'User exists.'});
    }
    var profile = {
      email: email,
      password: token,
      createTime: new Date(),
      updateTime: new Date()
    };
    db.user.insert(profile, function (err) {
      if (err) {
        return callback(err);
      }
      callback(null, {success: true});
    });
  });
};

exports.auth = function (username, password, callback) {
  var token = createToken(username, password);
  db.user.findOne({
    email: username,
    password: token
  }, callback);
};

exports.update = function (id, data, callback) {
  db.user.updateById(id, data, callback);
};

/**
 * Add an image to email.
 * 
 * @param {string} id
 * @param {String} email
 * @param {Object} imageInfo
 *  - url
 *  - type
 * @param {Function(err)} callback
 */
exports.addImage = function (id, email, imageInfo, callback) {
  var hash = exports.md5(email);
  db.email.findOne({hash: hash}, function (err, item) {
    if (err) {
      return callback(err);
    }
    item = item || {email: email, userid: id, images: [imageInfo], hash: hash};
    if (item._id) {
      var images = item.images.filter(function (info) {
        return info.hash !== imageInfo.hash;
      });
      images.push(imageInfo);
      item.images = images;
      db.email.updateById(item._id, item, callback);
    } else {
      db.email.insert(item, callback);
    }
  });
};

exports.visitEmail = function (hash, nextIndex, callback) {
  callback = callback || function () {};
  db.email.update({hash: hash}, {$set: {index: nextIndex}}, callback);
};

exports.getEmail = function (hash, callback) {
  db.email.findOne({hash: hash}, callback);
};

exports.getEmails = function (id, callback) {
  db.email.findItems({userid: id}, callback);
};