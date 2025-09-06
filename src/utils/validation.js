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


const  validateEditsFields = (req)=>{
    const allowedEdits = ["firstName", "lastName", "age", "about","photoUrl","skills", "gender"];
    const isAllowedEdits = Object.keys(req.body).every((field)=>allowedEdits.includes(field));
    
    return isAllowedEdits;
    
}


module.exports = {  validationSignup, validateEditsFields };