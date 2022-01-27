const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

const urlDatabase = {
  sgq3y6: {
    longURL: "https://www.tsn.ca",
    userID: "userRandomID",
  },
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.pokemon.ca",
    userID: "aJ48lW",
  },
  1234: {
    longURL: "https://www.google.ca",
    userID: "userRandomID",
  },
  12345: {
    longURL: "https://www.cooking.ca",
    userID: "userRandomID",
  },
};

//list of users who have registered
const users = {
  userRandomID: {
    id: "userRandomID",
    email: "123@example.com",
    password: "123",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
  aJ48lW: {
    id: "aJ48lW",
    email: "321@example.com",
    password: "321",
  },
  aJ48lW: {
    id: "aJ48lW",
    email: "321@example.com",
    password: "321",
  },
};

//generates a random 6 digit string that is used for both userIDs and shortURLs
const generateRandomString = () => {
  return (Math.random() + 1).toString(36).substring(6);
};

//Returns user if email exists in database
const emailCheck = (database, email) => {
  for (const user in database) {
    if (users[user]["email"] === email) {
      return user;
    }
  }
  return false;
};

//Creates a new Database to render that is unique to the cookies.userID
const filterUserID = (database, cookieUser) => {
  let usersUrlDatabase = {};
  for (let key of Object.keys(database)) {
    if (database[key]["userID"] === cookieUser) {
      usersUrlDatabase[key] = {
        longURL: urlDatabase[key]["longURL"],
        userID: urlDatabase[key]["userID"],
      };
    }
  }
  return usersUrlDatabase;
};

app.set("view engine", "ejs");

//**ROUTES**
//main page that displays user's list of URLS.
app.get("/urls", (req, res) => {
  const cookiesUser = req.cookies.userID;
  const filteredByUser = filterUserID(urlDatabase, cookiesUser);
  const templateVars = {
    user: users[cookiesUser],
    urls: filteredByUser,
  };
  //if user is not logged in they are redirected to 'notLoggedIn.ejs' that prompts them to login or register
  if (!cookiesUser) {
    res.render("notLoggedIn", templateVars);
  } else {
    res.render("urls_index", templateVars);
  }
});

//if user is not logged in they are redirected to login page. Otherwise, they go to urls_new where they can generate new shortUrls
app.get("/urls/new", (req, res) => {
  if (!req.cookies.userID) {
    res.redirect("/login");
  } else {
    const templateVars = {
      user: users[req.cookies.userID],
    };
    res.render("urls_new", templateVars);
  }
});

//come back to this one to really understand it
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL,
    user: users[req.cookies.userID],
  };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});

app.post("/urls", (req, res) => {
  const shortUrl = generateRandomString();

  urlDatabase[shortUrl] = {
    longURL: req.body.longURL,
    userID: req.cookies.userID,
  };
  console.log(urlDatabase[shortUrl]);
  res.redirect(`/urls/${shortUrl}`);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const cookieUser = req.cookies.userID;
  const shortURL = req.params.shortURL;
  //check if logged in user matches the userID. If not deleting is denied
  if (cookieUser !== urlDatabase[shortURL]["userID"]) {
    console.log("permission to delete *DENIED*");
  } else {
    delete urlDatabase[req.params.shortURL];
    res.redirect(`/urls/`);
  }
});

app.post("/urls/:shortURL/update", (req, res) => {
  const cookieUser = req.cookies.userID;
  const shortURL = req.params.shortURL;
  //check if logged in user matches the userID. If not editing is denied
  if (cookieUser !== urlDatabase[shortURL]["userID"]) {
    console.log("permission to edit *DENIED*");
  } else {
    urlDatabase[req.params.shortURL].longURL = req.body.newURL;
    res.redirect("/urls");
  }
});

app.post("/login", (req, res) => {
  const userEmail = req.body.email;
  const userPassword = req.body.password;
  //get email's Id
  const user = emailCheck(users, userEmail);

  //check if user's email exists
  if (user) {
    //check if password matches
    if (userPassword === users[user].password) {
      //set cookie of logged in user
      res.cookie("userID", user);
      res.redirect("/urls");
    }
  } else {
    res.sendStatus(403);
  }
});

app.post("/logout", (req, res) => {
  res.clearCookie("userID");
  res.redirect("/urls");
});

//handles the submission of the registration form to the object
app.post("/register", (req, res) => {
  const userEmail = req.body.email;
  const userPassword = req.body.password;
  //check if blanks (ie: falsy) values were passed into the form
  if (!userEmail || !userPassword) {
    res.sendStatus(400);
    //check if the email already exists in the 'database'
  } else if (emailCheck(users, userEmail)) {
    res.sendStatus(400);
  } else {
    //create a new user
    const userId = generateRandomString();
    users[userId] = {
      id: userId,
      email: userEmail,
      password: userPassword,
    };

    //passing the user's object (info) into cookies.
    //this is then used as reference for the user on each page
    res.cookie("userID", userId);

    res.redirect("/urls");
  }
});

app.get("/register", (req, res) => {
  const templateVars = {
    user: users[req.cookies.userID],
  };
  res.render("registration", templateVars);
});

//login form
app.get("/login", (req, res) => {
  const templateVars = {
    user: users[req.cookies.userID],
  };
  res.render("login_form", templateVars);
});

//the server is always listening!
app.listen(PORT, () => {
  console.log(`TINYapp listening on port ${PORT}!`);
});
