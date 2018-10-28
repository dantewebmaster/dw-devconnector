const transformOne = userModel => ({
  userUid: userModel.userUid,
  name: userModel.name,
  email: userModel.email,
  avatar: userModel.avatar,
});

const transform = (users, options) => users.map(transformOne, options);

const transformInputOne = (userModel) => {
  const user = {
    userUid: userModel.userUid,
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
