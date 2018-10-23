module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    userUid: {
      type: DataTypes.UUID,
      primaryKey: true,
      field: 'user_uid',
    },
    email: {
      type: DataTypes.STRING,
      field: 'email',
    },
    password: {
      type: DataTypes.STRING,
      field: 'password',
    },
    firstName: {
      type: DataTypes.STRING,
      field: 'first_name',
    },
    lastName: {
      type: DataTypes.STRING,
      field: 'last_name',
    },
    avatar: {
      type: DataTypes.STRING,
      field: 'avatar',
    },
    address: {
      type: DataTypes.STRING,
      field: 'address',
    },
    city: {
      type: DataTypes.STRING,
      field: 'city',
    },
    country: {
      type: DataTypes.STRING,
      field: 'country',
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at',
      defaultValue: DataTypes.NOW,
    },
    lastUpdatedAt: {
      type: DataTypes.DATE,
      field: 'last_updated_at',
      defaultValue: DataTypes.NOW,
    },
  }, {
      createdAt: 'created_at',
      updatedAt: 'last_updated_at',
      tableName: 'users',
      schema: 'devconnector',
    });

  return User;
};
