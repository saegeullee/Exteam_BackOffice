const makeError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.status = 'FAIL';

  return error;
};

module.exports = makeError;
