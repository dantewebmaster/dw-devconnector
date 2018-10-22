const { Exception, errorDefinitions } = require('./errors');

module.exports = {
  isUUID: (value, fieldTested) => {
    const isValid = value.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/gm);
    if (fieldTested && !isValid) {
      return Exception.raise({
        ...errorDefinitions.BAD_REQUEST_PARAMETER,
        values: { '#INPUT': fieldTested },
      });
    }
    return isValid;
  },
  isFilled: (value, fieldTested) => {
    const isValid = value !== undefined && value !== null;
    if (fieldTested && !isValid) {
      return Exception.raise({
        ...errorDefinitions.BAD_REQUEST_PARAMETER_UNSET,
        values: { '#INPUT': fieldTested },
      });
    }
    return isValid;
  },
};
