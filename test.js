var bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';

const obj = {
  name: '12312321',
  name2: '12312321',
  name3: '21321',
  name4: '21312321'
};

bcrypt.hash(myPlaintextPassword, saltRounds, function(err, hash) {
  // Store hash in your password DB.
  console.log(hash);
});

for (var keys in obj) {
  console.log(keys);
}

console.log(obj);

// console.log(Object.keys(obj)[3]);