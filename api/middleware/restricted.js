const jwt = require('jsonwebtoken');
const secret = require('../secrets/secret.js');
// const { JWT_SECRET } = require('../../config');





module.exports = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "token required" });
  }

  jwt.verify(token, secret.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "token invalid" });
    }

    next();
  });



  /*
    IMPLEMENT

    1- On valid token in the Authorization header, call next.

    2- On missing token in the Authorization header,
      the response body should include a string exactly as follows: "token required".

    3- On invalid or expired token in the Authorization header,
      the response body should include a string exactly as follows: "token invalid".
  */
};



