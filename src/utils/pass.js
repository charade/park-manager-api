const bcrypt = require('bcrypt');

module.exports = {
    generateHash : (password) => bcrypt.hash(password, 10),

    checkPassword : (givenPass, has) => bcrypt.compare(givenPass, hash)
}