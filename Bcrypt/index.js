const bcrypt = require('bcrypt')

const hashPassword = async (pwd) => {
  /* Here 10 is the number of rounds which you can kind of think of as a difficulty level for this hash. It doesn't effect how long the salt takes but it does the hash. 100 for example might take several hours */
  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(pwd, salt)
  console.log(`SALT is: ${salt}`)
  console.log(`HASH is: ${hash}`)
}

// hashPassword('monkey')

const login = async (pwd, hashedPW) => {
  const result = await bcrypt.compare(pwd, hashedPW)
  if (result)
    console.log("We have a match")
  else
    console.log("Not matched")
}

login('monkey1', '$2b$10$F4kVQVQ7vEpTC/sxVZkkjec0AXleuVDFNJkZrRBlV0ojbHofIcIbK')