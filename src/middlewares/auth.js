const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  const { token } = req.cookies;

  try {
    if (!token) {
      return res.status(401).send("Access Denied");
    }

    const decoded = jwt.verify(token, "Pkrmrj@91");
    if (!decoded) {
      return res.status(401).send("Access Denied");
    }

    // ✅ fetch the actual user
    const user = await User.findById(decoded._id);
    if (!user) {
      return res.status(401).send("User not found");
    }

    req.user = user; // now you have full user doc
    next();
  } catch (error) {
    console.error("Auth error:", error);
    res.status(401).send("Access Denied");
  }
};

module.exports = userAuth;
