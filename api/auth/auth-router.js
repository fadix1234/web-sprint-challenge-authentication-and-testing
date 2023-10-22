const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../users/users-model.js');
const secret = require('../secrets/secret.js');

const { BCRYPT_ROUNDS } = require('../../jest.config.js')

router.post('/register', async (req, res) => {
  let user = req.body

  if (!user.username || !user.password) {
    return res.status(400).json({ error: 'username and password required' });
  }
  User.findBy({ username: user.username })
  .then(existingUser => {
    console.log(existingUser)
    if (existingUser.length) {
      return res.status(409).json({ error: 'username taken' });
    }
  })
  try {
    const { username, password } = req.body

    const hash = bcrypt.hashSync(user.password, BCRYPT_ROUNDS)

    const newUser = await User.add({ username, password: hash })

    res.status(201).json(newUser)

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while registering the user.' });
  }
 

  // .catch(err => {
  //   res.status(500).json({ error: 'An error occurred while registering the user.' });
  //   res.end('implement register, please!');
  // });
  // const hash = bcrypt.hashSync(user.password, BCRYPT_ROUNDS)

  // user.password = hash

  // User.add(user)
  //   .then(saved => {
  //     res.status(201).json(user)


  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.
    DO NOT EXCEED 2^8 ROUNDS OF HASHING!

    1- In order to register a new account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel", // must not exist already in the `users` table
        "password": "foobar"          // needs to be hashed before it's saved
      }

    2- On SUCCESSFUL registration,
      the response body should have `id`, `username` and `password`:
      {
        "id": 1,
        "username": "Captain Marvel",
        "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
      }

    3- On FAILED registration due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED registration due to the `username` being taken,
      the response body should include a string exactly as follows: "username taken".
  */
});




router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'username and password required' });
  }

  User.findBy({ username })
    .then(user => {
      console.log(user)
      if (user.length && bcrypt.compareSync(password, user[0].password)) {

        const token = generateToken(user);


        res.status(200).json({
          message: `welcome, ${user[0].username}`,
          token,
        });
      } else {

        res.status(401).json({ error: 'invalid credentials' });
      }
    })
    .catch(err => {
      res.status(500).json({ error: 'An error occurred while logging in.' });
    });
});


function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
  };
  const options = {
    expiresIn: '1d',
  };
  return jwt.sign(payload, secret.JWT_SECRET, options);
};
/*
  IMPLEMENT
  You are welcome to build additional middlewares to help with the endpoint's functionality.

  1- In order to log into an existing account the client must provide `username` and `password`:
    {
      "username": "Captain Marvel",
      "password": "foobar"
    }

  2- On SUCCESSFUL login,
    the response body should have `message` and `token`:
    {
      "message": "welcome, Captain Marvel",
      "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
    }

  3- On FAILED login due to `username` or `password` missing from the request body,
    the response body should include a string exactly as follows: "username and password required".

  4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
    the response body should include a string exactly as follows: "invalid credentials".
*/


module.exports = router;
