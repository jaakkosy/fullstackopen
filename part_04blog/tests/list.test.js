const listHelper = require('../utils/list_helper')

const blogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0
  }  
]

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})


describe('total likes', () => {
  test('of a bigger list is calculated right', () => {
    const result = listHelper.totalLikes(blogs)
    expect(result).toBe(36)
  })

  test('when list has only one blog equals the likes of that', () => {
    const blog = blogs[0]
    const result = listHelper.totalLikes([blog])
    expect(result).toBe(blog.likes)
  })

  test('of empty list is zero', () => {
    const emptyResult = listHelper.totalLikes([])
    expect(emptyResult).toBe(0)
  })
})

describe('favorite blog', () => {
  test('of a bigger list is calculated right', () => {
    const result = listHelper.favoriteBlog(blogs)
    expect(result.likes).toEqual(12)
  })

  test('when list has only one blog equals the likes of that blog', () => {
    const blog = blogs[0]
    const result = listHelper.favoriteBlog([blog])
    expect(result.likes).toEqual(blog.likes)
  })

  test('of empty list is zero', () => {
    const emptyResult = listHelper.favoriteBlog([])
    expect(emptyResult).toBe(0)
  })
})

describe('author who has most blog posts', () => {
  test('of a bigger list is calculated right', () => {
    const result = listHelper.mostBlogs(blogs)
    expect(result.author).toEqual("Robert C. Martin")
  })

  test('when list has only one blog equals the likes of that blog', () => {
    const blog = blogs[0]
    const result = listHelper.mostBlogs([blog])
    expect(result.author).toEqual("Michael Chan")
  })

  test('of empty list is zero', () => {
    const emptyResult = listHelper.mostBlogs([])
    expect(emptyResult).toBe(0)
  })
})

describe('author whose blog posts have most likes', () => {
  test('of a bigger list is calculated right', () => {
    const result = listHelper.mostLikes(blogs)
    expect(result.author).toEqual("Edsger W. Dijkstra")
  })

  test('when list has only one blog equals the likes of that blog', () => {
    const blog = blogs[0]
    const result = listHelper.mostLikes([blog])
    expect(result.author).toEqual("Michael Chan")
  })

  test('of empty list is zero', () => {
    const emptyResult = listHelper.mostLikes([])
    expect(emptyResult).toBe(0)
  })
})