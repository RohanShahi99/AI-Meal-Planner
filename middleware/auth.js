const jwt = require('jsonwebtoken');
module.exports = function (req, res, next) {
  const token = req.header('Authorization')?.split(" ")[1];
  console.log('Token:', token);
  if (!token) return res.status(401).send("Access denied");
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(400).send("Invalid token");
  }
};
