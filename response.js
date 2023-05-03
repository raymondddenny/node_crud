const response = (statusCode, data, message, res) => {
  res.status(statusCode).json({
    payload: {
      status_code: statusCode,
      data: data,
    },
    message: message,
    pagination: {
      total: 0,
      per_page: 0,
      prev: "null",
      next: "null",
    },
  });
};

module.exports = response;
