/**
  resolves to an ARRAY with all users, each user having { user_id, username }
 */
const db = require('../../data/db-config.js')


async function find() {
return await db('users as u').select('u.user_id', 'u.username')
}

/**
  resolves to an ARRAY with all users that match the filter condition
 */
async function findBy(filter) {
  try {
    const user = await db('users as u').where('u.username', filter)
    return user
  } catch (err) {
    throw (err)
  }
}

/**
  resolves to the user { user_id, username } with the given user_id
 */
async function findById(user_id) {
  return await db('users as u').where('u.user_id', user_id)
}

/**
  resolves to the newly inserted user { user_id, username }
 */
async function add(user) {
  return await db('users as u').insert(user)
}

// Don't forget to add these to the `exports` object so they can be required in other modules
module.exports = {
  find,
  findBy,
  findById,
  add
}