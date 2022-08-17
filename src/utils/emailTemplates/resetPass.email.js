const resetPasswordEmail = (name, code) => {
  const emailText = `
    Hello ${name}
    Sorry to know that you have forgotten your password. Find your password reset code below.
    *${code}*

    Code expires in 3 minutes.
  `;

  const emailHtml = `
  <h5>Hello ${name}, 9jaMarket here.</h5>
  <p>Sorry to know that you have forgotten your password. Find your password reset code below.
  <h3>${code}</h3>
  <br>
  <p style="color:red;">Code expires in 3 minutes.</p>
  `;

  return {
    subject: "Password Reset",
    emailText,
    emailHtml,
  };
};

module.exports = { resetPasswordEmail };