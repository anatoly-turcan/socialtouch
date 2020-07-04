const crypto = require('crypto');

module.exports = class Post {
  constructor(userId, content, groupId = null) {
    this.userId = userId;
    this.groupId = groupId;
    this.content = content;
  }

  prepare() {
    this.salt = crypto.randomBytes(8).toString('hex');
    this.link = crypto.randomBytes(12).toString('hex');

    return this;
  }
};
