const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')
const api = supertest(app)
const bcrypt = require('bcrypt')


describe('viewing one or more saved blog(s)', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })
  
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
      const response = await api.get('/api/blogs')
      expect(response.body).toHaveLength(helper.initialBlogs.length)
    })

  test('identifying field must be "id"', async () => {
    const response = await api.get('/api/blogs')
    response.body.forEach(obj => {
      expect(obj).toHaveProperty('id');
    });
  });
})

/*
describe('new blogs with correct content can be set', () => {

  test('a valid blog can be added and contains required contents', async () => {
    const newBlog = {
      title: 'Testing title',
      author: 'Tester',
      url: 'www.youtube.com',
      likes: 999,
      userId: "643fd9ca3baa4b16a15de308"
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const contents = blogsAtEnd.map(b => b.title)
    expect(contents).toContain(
      'Testing title'
    )
    const response = await api.get('/api/blogs')
    response.body.forEach(obj => {
      expect(obj).toHaveProperty('title');
      expect(obj).toHaveProperty('author');
      expect(obj).toHaveProperty('url');
    });
  })

  test('when blog post is set without likes attribute, likes are set to 0', async () => {

    const newBlog = {
      title: 'Testing without likes',
      author: 'Tester testing without likes attribute',
      url: 'www.likes.com'
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    const addedBlog = blogsAtEnd.find(blog => blog.title === "Testing without likes")
    expect(addedBlog.likes).toBe(0)
  })
})
*/

describe('incorrect blog content leads to correct response status code when trying to add', () => {

  test('when new blog post doesnt include token, POST request is responsed with 401 unauthorized.', async () => {

    const newBlog = {
      author: 'Tester testing without title and url',
      title: 'Tester title',
      url: 'www.youtube.com'
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/)
  })
})
/*
describe('deleting blog posts', () => {

  beforeEach(async () => {
    await User.deleteMany({})
    await helper.firstUser()
    await helper.addAnotherUser()
  })

  test('succeeds with valid id and authorized token', async () => {
    await helper.addBlogForUser('testname', 'testpw')
    const token = await helper.loginUser('testname', 'testpw')
    const blogs = await helper.blogsInDb()

    await api
      .delete(`/api/blogs/${blogs[1].id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204);
})
})
*/

describe('modifying blog posts', () => {
  test('single blog post can be modified', async () => {

    const { title, author, url, likes } = {
    title: 'Jaakko Modifies Blog',
    author: 'Tester',
    url:'Youtube',
    likes: 500
  };
    const blogsAtStart = await helper.blogsInDb()
    const blogToModify = blogsAtStart[0]
    await api
      .put(`/api/blogs/${blogToModify.id}`)
      .send({ title, author, url, likes })
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd.map(b => b.title)).toContain(title);
    expect(blogsAtEnd.map(b => b.author)).toContain(author);
    expect(blogsAtEnd.map(b => b.url)).toContain(url);
    expect(blogsAtEnd.map(b => b.likes)).toContain(likes);
  })
})

describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('expected `username` to be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
})

describe('when trying to make new user without required information', () => {
  test('creation of new user fails with too short password', async () => {

    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'testuser',
      name: 'tester',
      password: 'xd'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('password must be atleast 3 characters long')
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creation of user new fails with too short username', async () => {

    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'tu',
      name: 'tester',
      password: 'xdxd'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('is shorter than the minimum allowed length')
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
})


afterAll(async () => {
  await mongoose.connection.close()
})

