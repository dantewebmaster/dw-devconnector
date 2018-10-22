module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    userUid: {
      type: DataTypes.UUID,
      primaryKey: true,
      field: 'user_uid',
    },
    firstName: {
      type: DataTypes.STRING,
      field: 'first_name',
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
  }, {
      createdAt: 'created_at',
      updatedAt: 'last_updated_at',
      tableName: 'users',
      schema: 'devconnector',
    });

  return User;
};
