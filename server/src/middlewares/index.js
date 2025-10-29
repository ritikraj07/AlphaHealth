const { validateCreateAdmin } = require("../validators/admin.validator");
const { validateCreateEmployee } = require("../validators/employee.validator");

module.exports = {
    validateCreateEmployee, validateCreateAdmin
};