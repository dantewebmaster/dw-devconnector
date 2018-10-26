const httpCodes = require('../helpers/enums/httpCodes');
const createRequest = require('../helpers/createRequest');
const UsersBO = require('../core/businessOperation/UsersBO');

const CONTROLLER_NAME = 'users';

module.exports = {

  /** --- GET ------------------------------------------- */
  getUsers: createRequest(CONTROLLER_NAME, 'get', UsersBO),
  getByUid: createRequest(CONTROLLER_NAME, 'getByUid', UsersBO),

  /** --- POST ------------------------------------------- */
  registerUser: createRequest(
    CONTROLLER_NAME, 'registerUser', UsersBO,
    (res, data) => res.status(httpCodes.CREATED).json(data),
  ),

  /** --- PATCH ------------------------------------------- */
  patchUser: createRequest(
    CONTROLLER_NAME, 'patch', UsersBO,
    (res) => {
      res.status(httpCodes.NO_CONTENT).end();
    },
  ),

  /** --- DELETE ------------------------------------------- */
  deleteUser: createRequest(
    CONTROLLER_NAME, 'delete', UsersBO,
    (res) => {
      res.status(httpCodes.NO_CONTENT).end();
    },
  ),
};
