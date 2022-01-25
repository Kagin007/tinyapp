const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));

function generateRandomString() {
  let sixDigitNum = Math.floor(Math.random()*1000000)
  return sixDigitNum.toString()
}
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.set('view engine', 'ejs')

//ROUTES

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars)
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:shortURL", (req, res) => {
  console.log(req)
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render("urls_show", templateVars)
})

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL]
  res.redirect(longURL);
});

app.post("/urls", (req, res) => {
  const shortUrl = generateRandomString()
  console.log("body longURL: ", req.body.longURL)
  urlDatabase[shortUrl] = req.body.longURL
  // res.render()
  res.redirect(`/urls/${shortUrl}`);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});