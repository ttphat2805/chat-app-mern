const md5 = require("md5");

const hash = (plain) => {
  return md5(plain);
};

const encryptPassword = (password) => {
  const hashPassword = hash(password);
  return hashPassword;
};

const comparePassword = (hashPassword, password) => {
  const toCompareHashPassword = hash(password);
  return hashPassword === toCompareHashPassword;
};

module.exports = { encryptPassword, comparePassword };
