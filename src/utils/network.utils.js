export const constructError = (
  res,
  statusCode = 500,
  title = "Internal Server Error",
  message = "Something went wrong. Please try again later.",
) =>
  res.status(statusCode).json({
    data: null,
    error: {
      statusCode,
      error: title,
      message,
    },
  });

export const constructRes = (
  res,
  statusCode = 200,
  data = { message: "okay👍🏻" },
) => res.status(statusCode).json(data);
