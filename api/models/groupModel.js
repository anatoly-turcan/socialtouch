const crypto = require('crypto');

module.exports = class Group {
  constructor(name, description, creatorId, imgId = undefined) {
    this.name = name;
    this.description = description;
    this.creator_id = creatorId;
    this.img_id = imgId;
  }

  prepare() {
    this.link = crypto.randomBytes(12).toString('hex');

    return this;
  }
};
