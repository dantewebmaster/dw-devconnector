const httpCodes = require('../../helpers/enums/httpCodes');

const errorDefinitions = {
  UNKNOWN: {
    key: 'UNKNOWN',
    statusCode: httpCodes.ERROR,
    message: 'API failed to execute this action through an unknown cause',
    detail: 'Unfortunately this error do not provide more information',
  },
  BAD_REQUEST_PARAMETER: {
    key: 'BAD_REQUEST_PARAMETER',
    statusCode: httpCodes.BAD_REQUEST,
    message: 'An input value was not accepeted',
    detail: '{parameterName: #INPUT}',
  },
  BAD_REQUEST_PARAMETER_UNSET: {
    key: 'BAD_REQUEST_PARAMETER_UNSET',
    statusCode: httpCodes.BAD_REQUEST,
    message: 'An input value was not informed',
    detail: '{parameterName: #INPUT}',
  },
  USER_ALREADY_EXISTS: {
    key: 'USER_ALREADY_EXISTS',
    statusCode: httpCodes.CONFLICT,
    message: 'User already registered',
    detail: '{parameterName: #INPUT}',
  },
  USER_NOT_FOUND: {
    key: 'USER_NOT_FOUND',
    statusCode: httpCodes.NOT_FOUND,
    message: 'User not found',
    detail: '{parameterName: #INPUT}',
  },
};

module.exports = errorDefinitions;
