module.exports = (obj) => {
  Object.keys(obj).forEach((key) => obj[key] === undefined && delete obj[key]);
};
