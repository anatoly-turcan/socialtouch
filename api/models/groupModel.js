const crypto = require('crypto');

module.exports = class Group {
  constructor(name, description, creatorId, imgId = undefined) {
    this.name = name;
    this.description = description;
    this.creatorId = creatorId;
    this.imgId = imgId;
  }

  prepare() {
    this.link = crypto.randomBytes(12).toString('hex');

    return this;
  }
};
