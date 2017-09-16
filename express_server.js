var express = require("express");
var app = express();
var PORT = process.env.PORT || 8080;
const bodyParser = require("body-parser");
var express = require('express');
var cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
var cookieSession = require('cookie-session');
// All requires for the project

var app = express();
app.use(cookieParser());

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(cookieSession({
  name: 'session',
  keys: ['user_id']
}));

app.set("view engine", "ejs");
//////////////////////////////////////////////////
// URL database of both the Short URL, long URL, and the ID of the poster who made the link
let urlDatabase = {
  "b2xVn2": {
    longURL: "http://www.lighthouselabs.ca",
    poster: '9hs5xK'
  },
  "9sm5xK": {
    longURL: "http://www.google.com",
    poster: 'Vn2b2x'
  }
};
/////////////////////////////////////////////
//Database of the
const users = {
  '9hs5xK': {
    id: '9hs5xK',
    email: 'makebeleive@gmail.com',
    password: bcrypt.hashSync('password', 10)
  },
  'Vn2b2x': {
    id: 'Vn2b2x',
    email: 'gmail@gmail.com',
    password: bcrypt.hashSync('password', 10)
  },
  'Vn2222': {
    id: 'Vn2222',
    email: 'g@g',
    password: bcrypt.hashSync('q', 10)
  }
};

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
//////////////////////////////////////////// DONE
//look at json information
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});
///////////////////////////////////////////////////////////// DONE
//Base of tiny app, if logged in redirects to /urls, if not redirects to /login
app.get("/", (req, res) => {
  if (req.session.user_id === undefined) {
    res.redirect('/login');
  } else {
    res.redirect('/urls');
  }
});
///////////////////////////////////////////// DONE
//Filters the URL database based on user logged in or user logged off
app.get("/urls", (req, res) => {
  let filteredDatabase = {};

  for (let x in urlDatabase) {
    if (req.session.user_id !== undefined && req.session.user_id === urlDatabase[x].poster) {
      filteredDatabase[x] = urlDatabase[x];
    } else if (req.session.user_id === undefined) {
      filteredDatabase = urlDatabase;
      break;
    }
  }

  let templateVars = {
    urls: filteredDatabase,
    usersInfo: users,
    user_id: req.session.user_id
  };

  res.render("urls_index", templateVars);
});
////////////////////////////////////////////////// DONE
//Adds a page to add a new long URL / Short URL to database
//Only users can add new links
app.get("/urls/new", (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    shortURL: req.params.id,
    usersInfo: users,
    user_id: req.session.user_id
  };

  if (req.session.user_id === undefined) {
    res.redirect('/urls');
  } else {
    res.render("urls_new", templateVars);
  }
});
/////////////////////////////////////////////// DONE
// Adds the new URL to the databasse with poster info / short URL / long URL
app.post("/urls", (req, res) => {
  let randomString = generateRandomString();
  urlDatabase[randomString] = {
    longURL: req.body.longURL,
    poster: req.session.user_id
  };
  res.redirect('/urls');
});
//////////////////////////////////////////// Done
//
app.get("/u/:shortURL", (req, res) => {
  if (Object.keys(urlDatabase).indexOf(req.params.shortURL) > -1) {
    res.redirect(urlDatabase[req.params.shortURL].longURL);
  } else {
    res.redirect('/urls/new');
  }

});
////////////////////////////////////////// NEEDS TO DO MORE STUFF
app.post("/urls/:id", (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    shortURL: req.params.id,
    user_id: req.session.user_id,
    usersInfo: users
  };
  res.render("urls_show", templateVars);
});
////////////////////////////////// Needs a redirect if logged in, and split into GET AND POST
app.post("/login", (req, res) => {
  let tempVars = {
    response: ''
  };

  if (req.body.password != undefined && req.body.email != undefined && req.body.password != '') {
    let i = 1;
    Object.keys(users).forEach(function(element) {
      if (users[element].email === req.body.email && bcrypt.compareSync(req.body.password, users[element].password) === true) {
        req.session.user_id = element;
        res.redirect('/urls');
        i = 0;
      }
      if (Object.keys(users).length === i) {
        tempVars.response = 'Not a valid username or password';
        res.render("urls_login", tempVars);
      }
      i++;
    });
  } else if (req.body.email === '' && req.body.email === '') {
    tempVars.response = 'Please enter a email and password';
    res.render("urls_login", tempVars);
  } else if (req.body.email === '') {
    tempVars.response = 'Please enter a valid email';
    res.render("urls_login", tempVars);
  } else if (req.body.password === '') {
    tempVars.response = 'Please enter a valid password';
    res.render("urls_login", tempVars);
  } else {
    res.render("urls_login", tempVars);
  }
});
//////////////////////////////////////// Needs to be broken into get and post
app.post("/register", (req, res) => {
  let tempVars = {
    response: ''
  };

  //If statment checks if the email and password are defined from text input
  if (req.body.password != undefined && req.body.email != undefined && req.body.password != '') {
    //forEach loop checks the object if the email has been used before and sends error message
    Object.keys(users).forEach(function(element) {
      if (users[element].email === req.body.email) {
        tempVars.response = 'That email has already been registered.';
        res.render("urls_reg", tempVars);
      }
    });
    //If email has not been registered, this code will execute
    if (tempVars.response === '') {
      let randomString = generateRandomString();
      users[randomString] = {
        id: randomString,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10)
      };
      req.session.user_id = randomString;
      res.redirect('/urls');
    }
  } else if (req.body.email === '' && req.body.email === '') {
    res.render("urls_reg", tempVars);
  } else if (req.body.email === '') {
    tempVars.response = 'Please enter a valid email';
    res.render("urls_reg", tempVars);
  } else if (req.body.password === '') {
    tempVars.response = 'Please enter a valid password';
    res.render("urls_reg", tempVars);
  } else {
    res.render("urls_reg", tempVars);
  }

});
//////////////////////////////////////////// DONE
//Logout function, deletes user_id cookie (not all in case i want to do the
//stetch goals) and redirects to /urls
app.post("/logout", (req, res) => {
  req.session.user_id = undefined;
  res.redirect('/urls');
});
////////////////////////////////////////////////////// ADD SOME ERROR MESSAGES
app.post("/urls/:id/delete", (req, res) => {
  if (Object.keys(urlDatabase).indexOf(req.params.id) > -1) {
    delete urlDatabase[req.params.id];
    res.redirect('http://localhost:8080/urls');
  } else {
    res.redirect('http://localhost:8080/urls');
  }
});
////////////////////////////////// Needs to be POST /urls/:id
app.post("/urls/:id/update", (req, res) => {
  if (Object.keys(urlDatabase).indexOf(req.params.id) > -1) {
    urlDatabase[req.params.id].longURL = req.body.longURL;
    res.redirect('/urls');
  } else {
    res.redirect('/urls');
  }
});
///////////////////////////////////////////////////
//function that generates a 6 string of a random alphanumeric value
function generateRandomString() {
  let text = "";
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < 6; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}