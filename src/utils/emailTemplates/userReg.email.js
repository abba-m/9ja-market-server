export const userRegistrationEmailObject = () => {
  const emailText =
    "Welcome to 9jaMarket. Buy and sell anything across Nigeria";
  const emailHtml =
    "<h5>Welcome to 9jaMarket. Buy and sell anything across Nigeria</h5>";

  return {
    subject: "Registration Successful",
    emailText,
    emailHtml,
  };
};
