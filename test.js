const obj = {
  name: '12312321',
  name2: '12312321',
  name3: '21321',
  name4: '21312321'
};

for (var keys in Object.keys(obj)) {
  console.log(keys);
}

console.log(obj);

// console.log(Object.keys(obj)[3]);