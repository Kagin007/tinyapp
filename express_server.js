const {
  getUserByEmail,
  filterUserID,
  generateRandomString,
  uniqueCounter,
} = require("./helpers");

const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);
const methodOverride = require('method-override');

//**MIDDLEWARE**
//enables parsing of POST requests
app.use(bodyParser.urlencoded({ extended: true }));

// override with POST having ?_method=DELETE and UPDATE
app.use(methodOverride('_method'));

//enables encryption of cookies
app.use(
  cookieSession({
    name: "session",
    keys: ["key1", "key2"],
  })
);

//setting ejs as the template engine
app.set("view engine", "ejs");

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

//**ROUTES**
//main page that displays user's list of URLS.
app.get("/urls", (req, res) => {
  const cookiesUser = req.session.userID;
  //if user is not logged in they are redirected to the register page
  const userUrls = filterUserID(urlDatabase, cookiesUser);
  const templateVars = {
    user: users[cookiesUser],
    urls: userUrls,
  };
  if (cookiesUser) {
    res.render("urls_index", templateVars);
  } else {
    res.render("not_logged_in", templateVars);
  }
});

//if user is not logged in they are redirected to login page. Otherwise, they go to 'urls_new.ejs' where they can generate new shortUrls
app.get("/urls/new", (req, res) => {
  const templateVars = {
    user: users[req.session.userID],
  };
  if (req.session.userID) {
    res.render("urls_new", templateVars);
  } else {
    res.redirect("/login");
  }
});

app.get("/urls/:shortURL", (req, res) => {
  if (!req.session.userID) {
    res.status("401").send("Unauthorized access. Police have been dispatched");
  } else if (req.session.userID !== urlDatabase[req.params.shortURL]['userID']) {
    res.status("401").send("You are not authorized!");
  } else {
    const templateVars = {
      shortURL: req.params.shortURL,
      longURL: urlDatabase[req.params.shortURL].longURL,
      user: users[req.session.userID],
    };
    res.render("urls_show", templateVars);
  }
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  //add a counter for number of clicks
  urlDatabase[req.params.shortURL]['count']++;
  //add counter for unique clicks and if click is new, add user to array
  uniqueCounter(urlDatabase, req.params.shortURL, req.session.userID);

  res.redirect(longURL);
});

app.post("/urls", (req, res) => {
  const shortUrl = generateRandomString();

  urlDatabase[shortUrl] = {
    longURL: req.body.longURL,
    userID: req.session.userID,
    count: 0,
    clicker: [],
    createdDate: new Date()
  };
  res.redirect(`/urls/${shortUrl}`);
});

app.delete("/urls/:shortURL", (req, res) => {
  const cookieUser = req.session.userID;
  const shortURL = req.params.shortURL;
  //check if logged in user matches the userID. If not deleting is denied
  if (cookieUser !== urlDatabase[shortURL]["userID"]) {
    console.log("permission to delete *DENIED*");
  } else {
    delete urlDatabase[req.params.shortURL];
    res.redirect(`/urls/`);
  }
});

app.put("/urls/:shortURL", (req, res) => {
  const cookieUser = req.session.userID;
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
  const user = getUserByEmail(userEmail, users);

  //check if user's email exists
  //** BIG CHANGE ** ADDED HASHING to password/
  if (user && bcrypt.compareSync(userPassword, users[user].password)) {
    //set cookie of logged in user
    req.session["userID"] = user;
    res.redirect("/urls");
  } else {
    res.status(403).send("Login not valid");
  }
});

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/login");
});

//handles the submission of the registration form to the object
app.post("/register", (req, res) => {
  const userEmail = req.body.email;
  const userPassword = req.body.password;
  //check if falsy values were passed in
  if (!userEmail || !userPassword) {
    res.status(400).send("Please fill in both email & password");
    //check if the email already exists in the 'database'
  } else if (getUserByEmail(userEmail, users)) {
    res
      .status(400)
      .send(
        "That email already exists in our database.\n Please try a different email"
      );
  } else {
    //encrypt password
    const hashedPassword = bcrypt.hashSync(userPassword, salt);
    //create a new user
    const userId = generateRandomString();
    users[userId] = {
      id: userId,
      email: userEmail,
      password: hashedPassword,
    };

    //passing the user's object (info) into cookies.
    req.session["userID"] = userId;

    res.redirect("/urls");
  }
});

app.get("/register", (req, res) => {
  //if user is already logged in, redirect to /urls
  if (req.session.userID) {
    res.redirect("/urls");
  } else {
    const templateVars = {
      user: users[req.session.userID],
    };
    res.render("registration", templateVars);
  }
});

//login form
app.get("/login", (req, res) => {
  if (!req.session.userID) {
    const templateVars = {
      user: users[req.session.userID],
    };
    res.render("login_form", templateVars);
  } else {
    res.redirect("/urls");
  }
});

//the server is always listening!
app.listen(PORT, () => {
  console.log(`TINYapp listening on port ${PORT}!`);
});

