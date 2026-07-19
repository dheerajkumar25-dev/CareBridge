// validators.js
// Small, dependency-free validation helpers used by the auth controller
// before express-validator's fuller checks run on the route. Having a
// couple of these as plain functions (instead of only relying on the
// express-validator middleware) makes the core rules easy to unit test
// without spinning up an Express server.

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isStrongPassword(password) {
  return typeof password === "string" && password.length >= 6;
}

function isValidPhone(phone) {
  return /^[0-9]{10}$/.test(phone);
}

module.exports = { isValidEmail, isStrongPassword, isValidPhone };

// ---- quick manual test (run: node server/utils/validators.js) ----
if (require.main === module) {
  console.assert(isValidEmail("test@example.com") === true, "valid email should pass");
  console.assert(isValidEmail("not-an-email") === false, "invalid email should fail");
  console.assert(isStrongPassword("123456") === true, "6-char password should pass");
  console.assert(isStrongPassword("123") === false, "3-char password should fail");
  console.assert(isValidPhone("9876543210") === true, "10-digit phone should pass");
  console.assert(isValidPhone("98765") === false, "short phone should fail");
  console.log("All validator assertions passed.");
}
