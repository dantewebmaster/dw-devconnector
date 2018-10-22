const handleError = require('./errors/ErrorHandler');
const logger = require('./logger');
const httpCodes = require('./enums/httpCodes');
const jsonPackage = require('../../package.json');

/**
 * Create Request to B.O.
 * @param (funcName: string, callback: (res, data))
 * @returns returns express controller
 */
function createRequest(modelName, funcName, OperationClass, callback) {
  return async (req, res) => {
    logger.debug(`${modelName}Controller.${funcName}`);
    try {
      const operation = new OperationClass(req.swagger.params);
      const data = await operation[funcName]();
      res.set('api-version', jsonPackage['api-version']);
      if (callback) {
        callback(res, data);
        return false;
      }
      let result = data;
      if (data.contentRange && data.data) {
        result = result.data;
        res.set('contentRange', data.contentRange);
        res.set('acceptRange', result.length);
      }
      return res.status(httpCodes.OK).json(result);
    } catch (err) {
      const customError = handleError(err, req.headers['debug-trace']);
      return res
        .status((customError.statusCode || httpCodes.ERROR))
        .json(customError.response);
    }
  };
}

module.exports = createRequest;
