const db = require("../../data/dbConfig")

module.exports = {
  add,
  find,
  findBy,
  findById,
}

function find() {
  return db("users")
  
}

function findBy(username) {
    return db("users")
      .where({ username }) 
      .first(); 
  }

async function add(users) {
  const [id] = await db("users").insert(users)
  return findById(id)
}

function findById(id) {
  return db("users").where({ id }) 
  .select("username", "password")
  .first();
 
       
  }
 