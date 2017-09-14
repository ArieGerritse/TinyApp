var express = require("express");
var app = express();
var PORT = process.env.PORT || 8080;
const bodyParser = require("body-parser");
var express = require('express');
var cookieParser = require('cookie-parser');

var app = express();
app.use(cookieParser());

app.use(bodyParser.urlencoded({
  extended: true
}));

app.set("view engine", "ejs");

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls", (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    username: req.cookies.username
  };
  let randomString = generateRandomString();
  var linkName = "Go to your link!";
  if (req.body.longURL) {
    urlDatabase[randomString] = req.body.longURL;
  }
  res.render("urls_index", templateVars);
});

app.post("/login", (req, res) => {
  res.cookie('username', req.body.username);
  res.redirect('/urls');
});

app.post("/logout", (req, res) => {
  res.clearCookie('username');
  res.redirect('/urls');
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls/new", (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    shortURL: req.params.id,
    username: req.cookies["username"]
  };
  res.render("urls_new", templateVars);
});

app.post("/urls/:id/delete", (req, res) => {
  if (Object.keys(urlDatabase).indexOf(req.params.id) > -1) {
    delete urlDatabase[req.params.id];
    res.redirect('http://localhost:8080/urls');
  } else {
    res.redirect('http://localhost:8080/urls');
  }
});

app.post("/urls/:id/update", (req, res) => {
  if (Object.keys(urlDatabase).indexOf(req.params.id) > -1) {
    urlDatabase[req.params.id] = req.body.longURL;
    res.redirect('http://localhost:8080/urls');
  } else {
    res.redirect('http://localhost:8080/urls');
  }
});

app.post("/urls/:id", (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    shortURL: req.params.id,
    username: req.cookies["username"]
  };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  if (Object.keys(urlDatabase).indexOf(req.params.shortURL) > -1) {
    res.redirect(urlDatabase[req.params.shortURL]);
  } else {
    res.redirect('http://localhost:8080/urls/new');
  }

});

function generateRandomString() {
  let text = "";
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < 6; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

//<%='/urls/' + x + '/delete'%>