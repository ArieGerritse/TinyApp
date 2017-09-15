var express = require("express");
var app = express();
var PORT = process.env.PORT || 8080;
const bodyParser = require("body-parser");
var express = require('express');
var cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
var cookieSession = require('cookie-session');


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

app.get("/", (req, res) => {
  if (req.session.user_id === undefined) {
    res.redirect('/login');
  } else {
    res.redirect('/urls');
  }
});

app.get("/urls", (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    usersInfo: users,
    user_id: req.session.user_id
  };
  res.render("urls_index", templateVars);
});
app.post("/login", (req, res) => {
  let tempVars = {
    response: ''
  };

  if (req.body.password != undefined && req.body.email != undefined && req.body.password != '') {
    let i = 1;
    Object.keys(users).forEach(function(element) {
      if (users[element].email === req.body.email && bcrypt.compareSync(req.body.password, users[element].password) === true) {
        req.session.user_id = users[element].email;
        res.redirect('/urls');
        i = 0;
      }
      if (Object.keys(users).length === i) {
        console.log('HERE!');
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

app.post("/logout", (req, res) => {
  req.session.user_id = undefined;
  res.redirect('/urls');
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls/new", (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    shortURL: req.params.id,
    usersInfo: users,
    user_id: req.session.user_id
  };
  res.render("urls_new", templateVars);
});

app.post("/urls/add", (req, res) => {
  let randomString = generateRandomString();
  urlDatabase[randomString] = {
    longURL: req.body.longURL,
    poster: req.session.user_id
  };
  console.log(urlDatabase);
  res.redirect('/urls');
});

app.post("/register", (req, res) => {
  let tempVars = {
    response: ''
  };

  if (req.body.password != undefined && req.body.email != undefined && req.body.password != '') {
    Object.keys(users).forEach(function(element) {
      if (users[element].email === req.body.email) {
        tempVars.response = 'That email has already been registered.';
        res.render("urls_reg", tempVars);
      }
    });
    if (tempVars.response != 'That email has already been registered.') {
      let randomString = generateRandomString();
      users[randomString] = {
        id: randomString,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10)
      };
      req.session.user_id = users[randomString].email;
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

//req.body.password == true && req.body.email == true

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
    urlDatabase[req.params.id].longURL = req.body.longURL;
    res.redirect('http://localhost:8080/urls');
  } else {
    res.redirect('http://localhost:8080/urls');
  }
});

app.post("/urls/:id", (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    shortURL: req.params.id,
    user_id: req.session.user_id,
    usersInfo: users
  };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  if (Object.keys(urlDatabase).indexOf(req.params.shortURL) > -1) {
    res.redirect(urlDatabase[req.params.shortURL].longURL);
  } else {
    res.redirect('/urls/new');
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