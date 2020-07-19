const crypto = require('crypto');

module.exports = class Chat {
  constructor(userId, targetId) {
    this.userId = userId;
    this.targetId = targetId;
  }

  prepare() {
    this.link = crypto.randomBytes(12).toString('hex');

    return this;
  }
};
