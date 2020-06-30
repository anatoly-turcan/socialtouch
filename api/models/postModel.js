const { randomBytes } = require('crypto');
const { DataTypes, Model } = require('sequelize');

class Post extends Model {
  static generateLink() {
    return randomBytes(10).toString('hex');
  }
}

module.exports = (sequelize) => {
  return Post.init(
    {
      post_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: DataTypes.INTEGER,
      group_id: DataTypes.INTEGER,
      content: DataTypes.TEXT,
      content_preview_limit: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      link: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'post',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
};
