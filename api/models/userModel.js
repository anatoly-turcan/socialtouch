const crypto = require('crypto');
const bcrypt = require('bcryptjs');

module.exports = class User {
  constructor(username, email, password, passwordConfirm) {
    this.username = username;
    this.email = email;
    this.password = password;
    this.passwordConfirm = passwordConfirm;
  }

  async prepare() {
    this.salt = crypto.randomBytes(8).toString('hex');
    this.link = crypto.randomBytes(12).toString('hex');
    this.passwordHash = await bcrypt.hash(this.password, 12);
    if (this.password) delete this.password;
    if (this.passwordConfirm) delete this.passwordConfirm;

    return this;
  }

  static async hashPassword(password) {
    return await bcrypt.hash(password, 12);
  }

  static async correctPassword(password, hash) {
    return await bcrypt.compare(password, hash);
  }

  static changedPasswordAfter(passwordChangedAt, jwtTimestamp) {
    if (passwordChangedAt) {
      const changedTimestamp = parseInt(passwordChangedAt.getTime() / 1000, 10);

      return jwtTimestamp < changedTimestamp;
    }

    return false;
  }

  static createPasswordResetToken() {
    const resetToken = crypto.randomBytes(32).toString('hex');

    const passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    return { passwordResetToken, resetToken };
  }
};
