const db = require("../../data/dbConfig")

module.exports = {
    add,
    find,
    findBy,
    findById,
}

function find() {
    return db("users").select("id", "username")

}

 async function findBy(filter) {
    const [user] = await db("users").where(filter)
    return user
    // return db("users")
    //     .where({ username })
    //     .select("id", "username", "password")
    //     .first();
}

async function add(users) {
      const [id] = await db("users").insert(users)
      return findById(id)
    // return db("users").insert(users).then(async([id]) => findById({ id: id }))
}

function findById(id) {
    console.log('test')
    return db("users").where( {id} )
        // .select("username")
        .first();


}
