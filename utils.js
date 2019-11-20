const fs = require('fs');

module.exports.readFile = async function readFile(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(data);
    });
  })
};