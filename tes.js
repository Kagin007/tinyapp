const urlDatabase = {
  b6UTxQ: {
      longURL: "https://www.tsn.ca",
      userID: "aJ48lW"
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ62lW"
  },
  i3BoGr: {
      longURL: "https://www.google.ca",
      userID: "aJ48lE"
  }
};
//TO DO: change userID 'aj48W' to cookie.USER
//Creates a new Database to render that is unique to the cookies.userID
const filterUserID = (database) => {
  let usersUrlDatabase = {};
  for (let key of Object.keys(database)) {
    if (database[key]['userID'] === 'aJ48lW') {
      usersUrlDatabase[key] = {
        'longURL': urlDatabase[key]['longURL'],
        'userID': urlDatabase[key]['userID']
      }
    }
  }
  return usersUrlDatabase
}

console.log(filterUserID(urlDatabase))