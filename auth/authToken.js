const jwt = require("jsonwebtoken");

/* function check there is no token , the function returns a 401 Unauthorized status code
if the token is valid , it return a 403 Forbiden status code
*/
/**
 *
 * @param {req} req
 * @param {res} res
 * @param {next} next using
 * @returns
 */
function authenticateToken(req, res, next) {
  //function extracts the authorization header fromn the request object
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

//like a name this function will be generate access token
/**
 *
 * @param {user} :user the parameter when user login will be have username or email and password
 * @returns tokken
 */
function generateAccesToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 900 });
}
module.exports = { authenticateToken, generateAccesToken };
