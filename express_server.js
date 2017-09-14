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

let urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {
  '9hs5xK': {
    id: '9hs5xK',
    email: 'makebeleive@gmail.com',
    password: 'password'
  },
  'Vn2b2x': {
    id: 'Vn2b2x',
    email: 'gmail@gmail.com',
    password: 'password'
  }
};

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/", (req, res) => {
  res.render("urls_test");
});

app.get("/urls", (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    usersInfo: users,
    user_id: req.cookies.user_id
  };
  let randomString = generateRandomString();
  var linkName = "Go to your link!";
  if (req.body.longURL) {
    urlDatabase[randomString] = req.body.longURL;
  }
  res.render("urls_index", templateVars);
});
app.post("/login", (req, res) => {
  let tempVars = {
    response: ''
  };

  if (req.body.password != undefined && req.body.email != undefined && req.body.password != '') {
    let i = 1;
    Object.keys(users).forEach(function(element) {
      if (users[element].email === req.body.email && users[element].password === req.body.password) {
        res.cookie('user_id', element);
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
  res.clearCookie('user_id');
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
    user_id: req.cookies.user_id
  };
  res.render("urls_new", templateVars);
});

app.post("/register", (req, res) => {
  let tempVars = {
    response: ''
  };

  if (req.body.password != undefined && req.body.email != undefined && req.body.password != '') {
    Object.keys(users).forEach(function(element) {
      if (users[element].email === req.body.email) {
        console.log(element);
        console.log(users[element].email + ' ' + req.body.email);
        tempVars.response = 'That email has already been registered.';
      }
    });
    if (tempVars.response != 'That email has already been registered.') {
      let randomString = generateRandomString();
      users[randomString] = {
        id: randomString,
        email: req.body.email,
        password: req.body.password
      };
      res.cookie('user_id', randomString);
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
    user_id: req.cookies.user_id,
    usersInfo: users
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