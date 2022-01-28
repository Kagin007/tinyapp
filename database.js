//**DATABASES**

//short url as main key
const urlDatabase = {
  sgq3y6: {
    longURL: "https://www.tsn.ca",
    userID: "userRandomID",
    count: 1,
    clicker: ['aJ48lW'],
    createdDate: "Fri Jan 28 2022 08:50:11 GMT-0500 (Eastern Standard Time)"
  },

  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
    count: 3,
    clicker: ['aJ48lW', 'adam', 'bob'],
    createdDate: "Fri Jan 28 2022 08:50:11 GMT-0500 (Eastern Standard Time)"
  },

  i3BoGr: {
    longURL: "https://www.pokemon.ca",
    userID: "aJ48lW",
    count: 1,
    clicker: ['aJ48lW'],
    createdDate: "Fri Jan 28 2022 08:50:11 GMT-0500 (Eastern Standard Time)"
  },

  1234: {
    longURL: "https://www.google.ca",
    userID: "userRandomID",
    count: 1,
    clicker: ['aJ48lW'],
    createdDate: "Fri Jan 28 2022 08:50:11 GMT-0500 (Eastern Standard Time)"
  },

  12345: {
    longURL: "https://www.cooking.ca",
    userID: "userRandomID",
    count: 1,
    clicker: ['aJ48lW'],
    createdDate: "Fri Jan 28 2022 08:50:11 GMT-0500 (Eastern Standard Time)"
  },
};


//object of users who have registered
const users = {
  userRandomID: {
    id: "userRandomID",
    email: "123@example.com",
    password: "$2a$10$tzm15bM/sVXZghe9vkdn9O7UamBvXAC2PONMHBl.sm/1cgX7ZK5uK", //**for evaluator**: password is 1234
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "$2a$10$tzm15bM/sVXZghe9vkdn9O7UamBvXAC2PONMHBl.sm/1cgX7ZK5uK", //**for evaluator**: password is 1234
  },
  aJ48lW: {
    id: "aJ48lW",
    email: "super-man@dailyplanet.com",
    password: "$2a$10$tzm15bM/sVXZghe9vkdn9O7UamBvXAC2PONMHBl.sm/1cgX7ZK5uK", //**for evaluator**: password is 1234
  },
  eJ48GW: {
    id: "eJ48GW",
    email: "ohya@example.com",
    password: "$2a$10$tzm15bM/sVXZghe9vkdn9O7UamBvXAC2PONMHBl.sm/1cgX7ZK5uK", //**for evaluator**: password is 1234
  },
};

module.exports = {users, urlDatabase}