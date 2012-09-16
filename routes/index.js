
/*
 * GET home page.
 */
exports.index = function(req, res){
  res.render('index', { title: 'MGravatar' });
};

exports.error = function(req, res){
  res.render('error', { 
    title: 'MGravatar-Errors',
    message: 'Internal Error!'
  });
};