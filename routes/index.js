
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.developerResources = function(req, res){
  res.render('developer-resources', { title: 'sss' });
};