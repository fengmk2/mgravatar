/*!
 * mgravatar - common/db.js
 * Copyright(c) 2012 fengmk2 <fengmk2@gmail.com>
 * MIT Licensed
 */

"use strict";

/**
 * Module dependencies.
 */

var mongoskin = require('mongoskin');
var mongo = null;

if (process.env.VCAP_SERVICES){
  var env = JSON.parse(process.env.VCAP_SERVICES);
  mongo = env['mongodb-1.8'][0].credentials;
}
else{
  mongo = {
    "hostname": "192.168.1.23",
    "port": 27017,
    // "username":"",
    // "password":"",
    // "name":"",
    "db": "mgravatar"
  };
}

var generate_mongo_url = function (obj) {
  obj.hostname = obj.hostname || 'localhost';
  obj.port = (obj.port || 27017);
  obj.db = (obj.db || 'test');
  if (obj.username && obj.password) {
    return "mongodb://" + obj.username + ":" + obj.password + "@" + obj.hostname + ":" + obj.port + "/" + obj.db;
  } else {
    return "mongodb://" + obj.hostname + ":" + obj.port + "/" + obj.db;
  }
};

var mongourl = generate_mongo_url(mongo);

var db = module.exports = mongoskin.db(mongourl);

db.bind('user');
db.user.ensureIndex('email', {unique: true}, function () {
  console.log('email index created.', arguments);
});
