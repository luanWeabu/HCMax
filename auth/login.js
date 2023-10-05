const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { generateAccesToken } = require("./authToken");

let refreshTokens = [];

/**
 *  Login
 * @param {*} request data in be
 * @param {*} res
 */
async function handleLogin(req, res) {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = { email: req.body.email, password: hashedPassword };
    const accessToken = generateAccesToken(user);
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
    refreshTokens.push(refreshToken);
    res.status(200).json({ accessToken, refreshToken });
  } catch (error) {
    res.status(500).send({ messagae: "Something went was wrong" });
  }
}

/**
 *  Resfresh Tokken
 * @param {*} req
 * @param {*} res
 * @returns
 */
function handleRefreshToken(req, res) {
  const refreshToken = req.body.token;
  if (refreshToken === null) return res.sendStatus(401);
  if (refreshTokens.includes(refreshToken)) return res.sendStatus(403);
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = generateAccesToken({ email: user.email });
    res.json({ accessToken });
  });
}

module.exports = { handleLogin, handleRefreshToken };
