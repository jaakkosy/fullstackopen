const logger = require('./logger')
const User = require('../models/user')
const webtoken = require('jsonwebtoken')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const unknownEndPoint = (request, response) => {
  response.status(404).send({
    error: 'unknowwn endpoint'
  })
}

const errorHandler = (error, request, response, next) => {
  if(error.name === 'ValidationError'){
    return response.status(400).send({ error: error.message })
  }
  else if(error.name === 'CastError'){
    return response.status(400).json({ error: 'malformatted id' })
  }
  else if(error.name === 'JsonWebTokenError'){
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('Authorization')
  if(!authorization)
  {
    return response.status(401).json({ error: 'Unauthorized' })
  }
  else if(authorization && authorization.startsWith('Bearer '))
  {
    const token = authorization.replace('Bearer ', '')
    request.token = token
  }
  next()
}


const userExtractor = async (request, response, next) => {
  const decoded_token = webtoken.verify(request.token, process.env.SECRET)
  if(!decoded_token.id){
    return response.status(401).json({ error: 'token invaid' })
  }
  const user = await User.findById(decoded_token.id)
  request.user = user.username
  next()
}

module.exports = {
  requestLogger,
  unknownEndPoint,
  errorHandler,
  tokenExtractor,
  userExtractor }