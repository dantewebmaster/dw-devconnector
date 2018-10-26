module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    userUid: {
      type: DataTypes.UUID,
      primaryKey: true,
      field: 'user_uid',
    },
    name: {
      type: DataTypes.STRING,
      field: 'name',
    },
    email: {
      type: DataTypes.STRING,
      field: 'email',
    },
    password: {
      type: DataTypes.STRING,
      field: 'password',
    },
    avatar: {
      type: DataTypes.STRING,
      field: 'avatar',
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
    lastName: {
      type: DataTypes.STRING,
      field: 'last_name',
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
  }, {
      createdAt: 'created_at',
      updatedAt: 'last_updated_at',
      tableName: 'users',
      schema: 'devconnector',
    });

  return User;
};
