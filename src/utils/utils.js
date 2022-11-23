import Mailjet from "node-mailjet";
import { Chat } from "../models";
import { Op } from "sequelize";
import chalk from "chalk";

export const normalizePort = (val) => {
  const port = parseInt(val, 10);

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

const _emailText = `Lorem ipsum dolor sit amet consectetur adipiscing elit nam, 
  class dictumst fermentum egestas platea elementum dui inceptos, 
  eleifend nostra nascetur congue eu malesuada euismod. Fringilla eleifend`;

const _emailHtml = `
    <h5>The Big Bang Theory</h5>
    <p>Lorem ipsum dolor sit amet consectetur 
    adipiscing elit nam, class dictumst fermentum 
    egestas platea elementum dui inceptos, eleifend 
    nostra nascetur congue eu malesuada euismod. Fringilla eleifend<p>
  `;

const mailjet = Mailjet.apiConnect(
  `${process.env.MAILJET_API_KEY}`,
  `${process.env.MAILJET_API_SECRET}`,
);

export const sendMail = async (email, subject, text, html) => {
  const request = await mailjet.post("send", { version: "v3.1" }).request({
    Messages: [
      {
        From: {
          Email: process.env.USER_EMAIL,
          Name: "9ja-Market",
        },
        To: [
          {
            Email: email,
          },
        ],
        Subject: subject,
        TextPart: text,
        HTMLPart: html,
      },
    ],
  });

  createLogger("SendEmail").info(request.body);
  return request;
};

export const getResetCodeExpireTime = () => {
  //5 mins from current time
  return new Date(new Date().getTime() + 300000);
};

export const findOrCreateRoom = async (userOne, userTwo) => {
  const room = await Chat.findOne({
    where: {
      [Op.or]: [
        { userOne, userTwo },
        { userOne: userTwo, userTwo: userOne },
      ],
    },
  });

  if (room) return room;

  return Chat.create({
    userOne,
    userTwo,
  });
};

export const traverseTime = (timeFromNow) => {
  const validUnits = ["m", "d"];
  if (typeof timeFromNow !== "string") {
    throw new Error("Invalid params for getting expiry date");
  }

  const time = Number(timeFromNow.replace(/[a-zA-Z]/g, ""));
  const unit = timeFromNow.replace(/\d/g, "").toLowerCase();

  if (!validUnits.includes(unit) || isNaN(time)) {
    throw new Error("Invalid params for getting expiry date");
  }

  const timeInMilliSeconds =
    unit === "m" ? time * 60 * 1000 : time * 86400 * 1000;

  return new Date(new Date().getTime() + timeInMilliSeconds);
};

export const backDate = (timeFromNow) => {
  const validUnits = ["m", "d"];
  if (typeof timeFromNow !== "string") {
    throw new Error("Invalid params for getting expiry date");
  }

  const time = Number(timeFromNow.replace(/[a-zA-Z]/g, ""));
  const unit = timeFromNow.replace(/\d/g, "").toLowerCase();

  if (!validUnits.includes(unit) || isNaN(time)) {
    throw new Error("Invalid params for getting expiry date");
  }

  const timeInMilliSeconds =
    unit === "m" ? time * 60 * 1000 : time * 86400 * 1000;

  return new Date(new Date().getTime() - timeInMilliSeconds);
};

export const getUserRoomIds = async (userId) => {
  const rooms = await Chat.findAll({
    where: {
      [Op.or]: [{ userOne: userId }, { userTwo: userId }],
    },
  });

  return rooms.map(({ chatId }) => chatId);
};

export const createLogger = (level) => {
  const printError = chalk.bold.red;
  const printInfo = chalk.blue;

  const { log: Log } = console;

  const error = (value) =>
    process.env.NODE_ENV === "development" &&
    Log(printError(`[${level}]: ${value}`));
  const info = (value) =>
    process.env.NODE_ENV === "development" &&
    Log(printInfo(`[${level}]: ${value}`));
  const log = (value) =>
    process.env.NODE_ENV === "development" && Log(level, value);

  return {
    info,
    error,
    log,
  };
};
