const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { DataTypes, Model } = require('sequelize');

class User extends Model {
  static generateLink() {
    return crypto.randomBytes(10).toString('hex');
  }

  static generateSalt() {
    return crypto.randomBytes(8).toString('hex');
  }

  static async hashPassword(password) {
    return await bcrypt.hash(password, 12);
  }

  static validate(
    body,
    fields = { username: true, email: true, password: true }
  ) {
    if (fields.username) {
      if (!body.password) return 'Missing fields';

      if (body.username.length < 2) return 'Username must be greater than 1';

      if (body.username.length > 20) return 'Username must not exceed 20';
    }

    if (fields.email) {
      if (!body.email) return 'Missing fields';

      if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(body.email))
        return 'Invalid email address';
    }

    if (fields.password) {
      if (!body.password || !body.passwordConfirm) return 'Missing fields';

      if (body.password.length < 8) return 'Password must be greater than 7';

      if (body.password.length > 30) return 'Password must not exceed 30';

      if (body.password !== body.passwordConfirm) return 'Password mismatch';
    }

    return null;
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
}

module.exports = (sequelize) => {
  return User.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      username: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: {
          msg: 'Username is already in use',
        },
      },
      email: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: {
          msg: 'Email is already in use',
        },
      },
      salt: {
        type: DataTypes.STRING(16),
        allowNull: false,
      },
      password_hash: {
        type: DataTypes.STRING(60),
        allowNull: false,
      },
      password_reset_token: {
        type: DataTypes.STRING(64),
      },
      password_changed_at: {
        type: DataTypes.DATE,
      },
      img_id: {
        type: DataTypes.INTEGER,
      },
      link: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: {
          msg: 'This short link is already in use',
        },
      },
    },
    {
      sequelize,
      modelName: 'user',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
};
