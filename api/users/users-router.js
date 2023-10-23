const router = require("express").Router()

const User = require("./users-model.js")

const Check = require('../middleware/restricted.js')

router.get("/", Check("admin"), (req, res, next) => {
  User.find()
    .then(Check => {
      res.json(Check)
    })
    .catch(next) 
})


module.exports = router;