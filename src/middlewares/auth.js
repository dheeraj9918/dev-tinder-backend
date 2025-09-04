const jwt = require("jsonwebtoken");
const User = require("../models/user");
const userAuth =  async(req, res, next) => {
    const cookies = req.cookies;
    const { token } = cookies;
    try {
        if (!token) {
            return res.status(401).send("Access Denied");
        }
        const verifyed =  jwt.verify(token, "Pkrmrj@91");
        if (!verifyed) {
            return res.status(401).send("Access Denied");
        }
        req.user = verifyed;
        next();
    } catch (error) {
        res.status(401).send("Access Denied");
    }

}

module.exports = userAuth;