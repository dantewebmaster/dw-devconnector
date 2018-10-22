const transformOne = userModel => ({
  userUid: userModel.userUid,
  firstName: userModel.firstName,
});

const transform = (users, options) => users.map(transformOne, options);

const transformInputOne = (userModel) => {
  const user = {
    userUid: userModel.userUid,
    firstName: userModel.firstName,
  };
  return user;
};

const transformInput = (users, options) => users.map(transformInputOne, options);

module.exports = {
  transform,
  transformOne,
  transformInput,
  transformInputOne,
};
