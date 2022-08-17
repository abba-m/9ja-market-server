const { uid } = require("uid");
//const { constructError } = require("./network.utils")

const validatePostReq = (req) => {
  const data = JSON.parse(req.body.data);
  let message = "";

  if (!req.files.length) {
    return "post images missing.";
  }

  if (!data) {
    return "data field missing.";
  }

  if (!data.title) {
    message += "\ntitle field is required";
  }

  if (!data.price) {
    message += "\nprice field is required";
  }

  if (!data.description) {
    message += "\ndescription field is required";
  }

  if (!data.location) {
    message += "\nlocation field is required";
  }

  if (message) {
    return message;
  }

  return 0;
};

const createPostSlug = (title) => {
  const str = title.split(" ").join("-");
  return `${str}-${uid(6)}`;
};

module.exports = { validatePostReq, createPostSlug };