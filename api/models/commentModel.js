const crypto = require('crypto');

module.exports = class Post {
  constructor(userId, content) {
    this.userId = userId;
    this.content = content;
  }

  prepare() {
    this.link = crypto.randomBytes(12).toString('hex');

    return this;
  }
};
