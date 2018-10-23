const transformOne = userModel => ({
  userUid: userModel.userUid,
  email: userModel.email,
  firstName: userModel.firstName,
  lastName: userModel.lastName,
  address: userModel.address,
  avatar: userModel.avatar,
});

const transform = (users, options) => users.map(transformOne, options);

const transformInputOne = (userModel) => {
  const user = {
    userUid: userModel.userUid,
    firstName: userModel.firstName,
    address: userModel.address,
    city: userModel.city,
  };
  return user;
};

const transformInput = (users, options) =>
  users.map(transformInputOne, options);

module.exports = {
  transform,
  transformOne,
  transformInput,
  transformInputOne,
};
