export const sendSuccess = (
  res,
  data = null,
  message = "Success",
  statusCode = 200
) => {
  const payload = {
    status: "success",
    success: true,
    message,
  };

  if (data !== null) payload.data = data;

  return res.status(statusCode).json(payload);
};

export const sendError = (
  res,
  message = "Error",
  errors = null,
  statusCode = 400
) => {
  const payload = {
    status: "error",
    success: false,
    message,
  };

  if (errors) payload.errors = errors;

  return res.status(statusCode).json(payload);
};

export default { sendSuccess, sendError };
