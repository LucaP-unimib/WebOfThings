var keys = require('../resources/auth');

module.exports = function() {
  return function (req, res, next) {
    console.log(req.method + " " + req.path);
    if (req.path.substring(0, 5) === "/css/") {
      next(); //Allow unauthorized access to the css folder

    } else {
      var token = req.body.token || req.get('authorization') || req.query.token; //check header or url parameters or post parameters for token
      console.log(req.params);
      if (!token) { //If no token provided, return 401 UNAUTHORIZED
        return res.status(401).send({success: false, message: 'API token missing.'});
      } else {
        if (token != keys.apiToken) { //If token is not a valid API key, return 403 FORBIDDEN
          return res.status(403).send({success: false, message: 'API token invalid.'});
        } else { //If everything is good, save to request for use in other routes
          next();
        }
      }
    }
  }
};
