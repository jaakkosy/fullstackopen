const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3
  },
  number: {
    type: String,
    minlength: 8,
    validate: [
      {
      validator: value => value.charAt(2) === "-" || value.charAt(3) === "-",
      message: props => `${props.value} number must be in correct format!`
      },
      {
      validator: value => {
        let count = 0;
        for (let i = 0; i < value.length; i++) {
          if (value[i] === "-") {
            count++;
          }
        }
        return count === 1;
      },
      message: props => `${props.value} number must have "-" character only once!`
    }
    ]
  } 
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)