const appError = require("../error/appError");

const requireRole = (role) => {
    return (req, res, next) => {
        if (role.includes(req.userRole)) {
            next();
        }
        else {
            throw new appError(`access denied your role is ${req.userRole} and trying to access ${role}`, 403)
        }
    }
}

module.exports=requireRole;