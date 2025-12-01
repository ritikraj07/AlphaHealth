// ===============================================
// 🔐 Password Utility Using bcryptjs
// ===============================================
// We never store plain passwords in the database.
// Instead, we convert them into a hashed (encrypted-like)
// format that cannot be reversed. bcryptjs helps with this.
//
const bcrypt = require('bcryptjs');



// ======================================================
// 🔹 hashPassword(password)
// ------------------------------------------------------
// ✔ Takes a normal plain password (user input)
// ✔ Generates a hash using bcrypt (salt + encryption)
// ✔ More "saltRounds" means stronger security but slower speed
// ------------------------------------------------------
// Example Output: "$2a$12$78ajsdn78a8sd7a8d7asjd...."
// ======================================================
const hashPassword = async (password) => {
    const saltRounds = 12; // Recommended: 10-12 for production
    return await bcrypt.hash(password, saltRounds);
};



// ======================================================
// 🔹 comparePassword(password, hashedPassword)
// ------------------------------------------------------
// ✔ Compares entered password with hashed password stored in DB
// ✔ Returns TRUE if correct, FALSE if wrong
// ✔ bcrypt internally hashes again and verifies
// ------------------------------------------------------
// Used during login → to check if user entered correct password
// ======================================================
const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};



// ======================================================
// 📤 Export Utility Functions
// ------------------------------------------------------
// We export both so we can use them anywhere like:
// const { hashPassword, comparePassword } = require("./password.util");
// ======================================================
module.exports = { hashPassword, comparePassword };
