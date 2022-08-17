const Mailjet = require("node-mailjet");

const normalizePort = (val) => {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
};

const _emailText = "Lorem ipsum dolor sit amet consectetur adipiscing elit nam, class dictumst fermentum egestas platea elementum dui inceptos, eleifend nostra nascetur congue eu malesuada euismod. Fringilla eleifend";

const _emailHtml = `
    <h5>The Big Bang Theory</h5>
    <p>Lorem ipsum dolor sit amet consectetur adipiscing elit nam, class dictumst fermentum egestas platea elementum dui inceptos, eleifend nostra nascetur congue eu malesuada euismod. Fringilla eleifend<p>
  `;

const mailjet = Mailjet.apiConnect(process.env.MAILJET_API_KEY,
  process.env.MAILJET_API_SECRET);

const sendMail = async (email, subject, text, html) => {
  const request = await mailjet
    .post("send", { "version": "v3.1" })
    .request({
      "Messages": [{
        "From": {
          "Email": process.env.USER_EMAIL,
          "Name": "9ja-Market",
        },
        "To": [{
          "Email": email,
        }],
        "Subject": subject,
        "TextPart": text,
        "HTMLPart": html,
      }]
    });

  console.log("[Email Res]:", request.body);
  return request;
};

const getResetCodeExpireTime = () => {
  //5 mins from current time
  return new Date(new Date().getTime() + 300000);
};

module.exports = {
  normalizePort,
  sendMail,
  getResetCodeExpireTime,
};
