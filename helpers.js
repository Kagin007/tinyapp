//Returns user object if email exists in database
const getUserByEmail = (email, database) => {
  for (const user in database) {
    if (database[user]["email"] === email) {
      return user;
    }
  }
  return false;
};

//Returns filtered user database object filtered by the cookieUser
const filterUserID = (database, cookieUser) => {
  let usersUrlDatabase = {};
  for (let key of Object.keys(database)) {
    if (database[key]["userID"] === cookieUser) {
      usersUrlDatabase[key] = {
        longURL: database[key]["longURL"],
        userID: database[key]["userID"],
        count: database[key]['count'],
        clicker: database[key]['clicker']
      };
    }
  }
  return usersUrlDatabase;
};

//generates a random 6 digit string that is used for both userIDs and shortURLs
const generateRandomString = () => {
  return (Math.random() + 1).toString(36).substring(6);
};




module.exports = {
  getUserByEmail,
  filterUserID,
  generateRandomString,
};