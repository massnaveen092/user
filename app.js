const express = require('express')
const sqlite3 = require('sqlite3')
const {open} = require('sqlite')
const path = require('path')

const app = express()
app.use(express.json())
let database = null
const dbpath = path.join(__dirname, 'userData.db')

const insilizeserver = async () => {
  try {
    database = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server Login......')
    })
  } catch (error) {
    console.log(`Db Error ${error.message}`)
    process.exit(1)
  }
}
insilizeserver()

app.post('/register', async (request, response) => {
  let {username, name, password, gender, location} = request.body //Destructuring the data from the API call

  let hashedPassword = await bcrypt.hash(password, 10) //Hashing the given password

  let checkTheUsername = `
            SELECT *
            FROM user
            WHERE username = '${username}';`
  let userData = await db.get(checkTheUsername) //Getting the user details from the database
  if (userData === undefined) {
    //checks the condition if user is already registered or not in the database
    /*If userData is not present in the database then this condition executes*/
    let postNewUserQuery = `
            INSERT INTO
            user (username,name,password,gender,location)
            VALUES (
                '${username}',
                '${name}',
                '${hashedPassword}',
                '${gender}',
                '${location}'
            );`
    if (password.length < 5) {
      //checking the length of the password
      response.status(400)
      response.send('Password is too short')
    } else {
      /*If password length is greater than 5 then this block will execute*/

      let newUserDetails = await db.run(postNewUserQuery) //Updating data to the database
      response.status(200)
      response.send('User created successfully')
    }
  } else {
    /*If the userData is already registered in the database then this block will execute*/
    response.status(400)
    response.send('User already exists')
  }
})
app.post('/login/', async (request, response) => {
  const {username, password} = request.body
  const iscorrectuser = `SELECT *
            FROM user
            WHERE username = '${username}';`
  const isuser = await database.run(iscorrectuser)
  if (isuser === undefined) {
    response.status(400)
    response.send('Invalid user')
  }

  let iscorrectpass = await bcrypt.compare(password, isuser.password)
  if (iscorrectpass) {
    response.status(200)
    response.send('Login success')
  } else {
    response.status(400)
    response.send('Invalid password')
  }
})

app.put('/change-password/', async (request, response) => {
  const {username, oldPassword, newPassword} = request.body
  let hashedPassword = await bcrypt.compare(password, isuser.password)
  let checkTheUsername = `
            SELECT *
            FROM user
            WHERE username = '${username}';`
  const userData =  await database.run(checkTheUsername)
  if (userData){
    let updatevalue = `UPDATE user SET ${username},${newPassword}`
    if (password.length < 5) {
      //checking the length of the password
      response.status(400)
      response.send('Password is too short')
  }else{
    let newUserDetails = await db.run(updatevalue) //Updating data to the database
      response.status(200)
      response.send('Password updated')
  }
  else{
    response.status(400)
    response.send("Invalid current password")
  }

}
})
module.exports