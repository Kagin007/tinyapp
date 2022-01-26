const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser())

function generateRandomString() {
  let sixDigitNum = Math.floor(Math.random()*1000000)
  return sixDigitNum.toString()
}


//list of urls that have been shortened
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

//list of users who have registered
const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}

//returns user if email exists in database
const emailCheck = (database, email) => {
  for (const user in database) {
    if (users[user]['email'] === email) {
      return user
    }
  }
  return false;
}

app.set('view engine', 'ejs')

//ROUTES

app.get("/urls", (req, res) => {
  const templateVars = { 
    user: users[req.cookies.userID],
    urls: urlDatabase };
  res.render("urls_index", templateVars)
});

app.get("/urls/new", (req, res) => {
  const templateVars = {
    user: users[req.cookies.userID],
  }
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { 
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    user: users[req.cookies.userID],
  };
  res.render("urls_show", templateVars)
})

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL]
  res.redirect(longURL);
});

app.post("/urls", (req, res) => {
  const shortUrl = generateRandomString()
  urlDatabase[shortUrl] = req.body.longURL
  res.redirect(`/urls/${shortUrl}`);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL]
  res.redirect(`/urls/`);
});

app.post("/urls/:shortURL/update", (req, res) => {
  console.log(req.body.newURL)
  // urlDatabase[shortURL] = req.body
  urlDatabase[req.params.shortURL] = req.body.newURL
  res.redirect('/urls')
})

app.post("/login", (req, res) => {
  const userEmail = req.body.email;
  const userPassword = req.body.password;
  //get email's Id
  const user = emailCheck(users, userEmail)
  console.log(users[user].email)

  // "userRandomID": {
  //   id: "userRandomID", 
  //   email: "user@example.com", 
  //   password: "purple-monkey-dinosaur"
  // },

  //check if user's email exists
  if (user) {
    //check if password matches
    if (userPassword === users[user].password) {
      res.cookie("userID", user)
      res.redirect('/urls')
    }
  }
   res.sendStatus(403)
})

app.post("/logout", (req, res) => {
  res.clearCookie("userID")
  res.redirect('/urls')
})

//handles the submission of the registration form to the object
app.post("/register", (req, res) => {
  const userEmail = req.body.email;
  const userPassword = req.body.password;
  //check if blanks (ie: falsy) values were passed into the form
  if (!userEmail || !userPassword) {
    res.sendStatus(400)
  //check if the email already exists in the 'database'
  } else if (emailCheck(users, userEmail)) {
    res.sendStatus(400)
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
  res.cookie("userID", userId)

  res.redirect("/urls")    
  }
})

app.get("/register", (req, res) => {
  const templateVars = {
    user: users[req.cookies.userID]
  }
  res.render("registration", templateVars)
})

//login form
app.get("/login", (req, res) => {
  const templateVars = {
    user: users[req.cookies.userID]
  }
  res.render("login_form", templateVars)
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});