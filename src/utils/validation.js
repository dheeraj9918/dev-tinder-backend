const validator = require('validator')

const validationSignup = (req) => {
    const { firstName, lastName, password, emailId } = req.body;

    if (!firstName || !lastName) {
        throw new Error("Please enter the valid name!!");
    }
    else if (!validator.isEmail(emailId)) {
        throw new Error("Please enter the valid email address");
    } else if (!validator.isStrongPassword(password)) {
        throw new Error("Please enter the strong password");
    }
}


module.exports = validationSignup;