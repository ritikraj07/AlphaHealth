const { validateCreateAdmin } = require("../validators/admin.validator");
const { validateCreateUser } = require("../validators/user.validator");

module.exports = {
    validateCreateUser, validateCreateAdmin
};