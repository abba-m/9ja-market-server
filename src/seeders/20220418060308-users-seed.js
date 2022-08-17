"use strict";
const { v4: UUIDV4 } = require("uuid");

module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert("User", [
      {
        userId: UUIDV4(),
        fullName: "John Doe",
        email: "johndoe@mailinator.com",
        provider: "local",
        premium: true,
        phone: "09088",
        confirmed: true,
        blocked: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: UUIDV4(),
        fullName: "Bill Gates",
        email: "billjenks@mailinator.com",
        provider: "local",
        premium: true,
        phone: "08099",
        confirmed: true,
        blocked: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});

  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete("User", null, {});
  }
};
