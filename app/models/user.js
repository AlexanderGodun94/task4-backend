module.exports = function (sequelize, DataTypes) {
  const bcrypt = require('bcryptjs');

  const User = sequelize.define('User', {
    id: {type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true},
    email: {type: DataTypes.STRING, allowNull: false, unique: true},
    password: {type: DataTypes.STRING, allowNull: true},
    status: {
      type: DataTypes.STRING(DataTypes.ENUM({values: ['ACTIVE', 'BLOCKED']})),
      defaultValue: 'ACTIVE'
    },
    firstName: {type: DataTypes.STRING, allowNull: true},
    lastName: {type: DataTypes.STRING, allowNull: true},
    lastSession: {type: DataTypes.DATE, allowNull: true},
    role: {
      type: new DataTypes.VIRTUAL(DataTypes.STRING), get: () => {
        return 'investor';
      }
    },
  }, {
    paranoid: true,
    tableName: 'users'
  });

  User.beforeCreate((model, options) => {
    model.hashPassword();
  });


  User.prototype.hashPassword = function () {
    this.password = bcrypt.hashSync(this.password, 10);
  };

  User.associate = function (models) {
  };

  User.prototype.toJSON = function () {
    let fullName;
    if (this.lastName && this.firstName) fullName = this.lastName + ' ' + this.firstName;
    if (this.lastName && !this.firstName) fullName = this.lastName;
    if (this.firstName && !this.lastName) fullName = this.firstName;
    return {
      id: this.id,
      email: this.email,
      status: this.status,
      firstName: this.firstName,
      lastName: this.lastName,
      fullName: fullName,
      role: this.role,
      lastSession: this.lastSession,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  };

  return User;
};
