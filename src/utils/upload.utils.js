const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

const uploadImagesToCloud = async (files) => {
  let result;

  if (null == files.length) {
    result = await streamUpload(files.buffer);
    return result;
  }

  result = [];
  for (let i = 0; i < files.length; i++) {
    const current = files[i];
    const res = await streamUpload(current.buffer);

    if (res) {
      result.push(res);
    }
  }

  return result;
};

const streamUpload = (buffer) => {
  return new Promise((resolve, reject) => {
    let stream = cloudinary.uploader.upload_stream((err, result) => {
      if (result) {
        resolve(result);
      } else {
        reject(err);
      }
    });

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

module.exports = { uploadImagesToCloud };