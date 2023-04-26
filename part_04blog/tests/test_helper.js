const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const initialBlogs = [
    {
      title: 'Dota 2 is hard to master',
      author: 'Topson',
      url: 'https://www.dota2protracker.com/',
      likes: 55
    },
    {
      title: 'Required teamwork in Dota 2',
      author: 'Jaakko',
      url: 'https://www.dotabuff.com',
      likes: 20
    },
]
const nonExistingId = async () => {
  const blog = new Blog({ title: 'willremovethissoon' })
  await blog.save()
  await blog.remove()
  return blog.id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

const firstUser = async () => {
  const passwordHash = await bcrypt.hash('testpw', 10)
  const user = new User({username: 'testname', passwordHash})
  await user.save()
}

const addAnotherUser = async () => {
  const passwordHash = await bcrypt.hash('testerpwtwo', 10)
  const user = new User({username: 'testUserTwo', passwordHash})
  await user.save()
}

const addBlogForUser = async (username,password) => {
  const token = await loginUser(username,password)
  initialBlogs.forEach(async blog => {
    await api.post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(blog)
  })
}

const loginUser = async (username, password) => {
  const user_login = {
    username: username,
    password: password
  }
  const response = await api.post('/api/login').send(user_login)
  const body = response.body
  return body.token
}

module.exports = {
  initialBlogs, nonExistingId, blogsInDb, usersInDb, firstUser, addAnotherUser, addBlogForUser, loginUser
}