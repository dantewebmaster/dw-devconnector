const httpCodes = require('../../helpers/enums/httpCodes');

const errorDefinitions = {
  UNKNOWN: { // Generic error
    key: 'UNKNOWN',
    statusCode: httpCodes.ERROR,
    message: 'API failed to execute this action through an unknown cause',
    detail: 'Unfortunately this error do not provide more information',
  },
  BAD_REQUEST_PARAMETER: { // invalid parameter value
    key: 'BAD_REQUEST_PARAMETER',
    statusCode: httpCodes.BAD_REQUEST,
    message: 'An input value was not accepeted',
    detail: '{parameterName: #INPUT}',
  },
  BAD_REQUEST_PARAMETER_UNSET: { // required parameter not filled
    key: 'BAD_REQUEST_PARAMETER_UNSET',
    statusCode: httpCodes.BAD_REQUEST,
    message: 'An input value was not informed',
    detail: '{parameterName: #INPUT}',
  },
};

module.exports = errorDefinitions;
