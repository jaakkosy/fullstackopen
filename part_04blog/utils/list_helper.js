const dummy = (blogs) => {
  return 1
}


const totalLikes = (blogs) => {
  return blogs.reduce(function(sum, blog) {
    return sum + blog.likes;
  }, 0);
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return 0
  }
  return blogs.reduce(function(prevBlog, currentBlog) {
    return (prevBlog.likes > currentBlog.likes) ? prevBlog : currentBlog;
  });
};

const mostBlogs = (blogs) => {

  if (blogs.length === 0) {
    return 0
  }

  const authorCounts = {}

  for (let i = 0; i < blogs.length; i++) {
    const blog = blogs[i];

    const author = blog.author

    if (authorCounts[author]) {
      authorCounts[author] ++
    }

    else {
      authorCounts[author] = 1
    }
  }

  let maxAuthor = "";
  let maxCount = 0;

  for (const author in authorCounts) {
    if (authorCounts[author] > maxCount) {
      maxAuthor = author
      maxCount = authorCounts[author]
    }
  }
  return {
    author : maxAuthor,
    blogs : maxCount
  }
}

const mostLikes = (blogs) => {

  if (blogs.length === 0) {
    return 0
  }
  const authorHighestLikes = {}

  for (let i = 0; i < blogs.length; i++) {
    const blog = blogs[i];
    const author = blog.author

    if (authorHighestLikes[author]) {
      authorHighestLikes[author] += blog.likes
    }

    else {
      authorHighestLikes[author] = blog.likes
    }
  }


  let maxAuthor = "";
  let maxLikes = 0;

  for (const author in authorHighestLikes) {
    if (authorHighestLikes[author] > maxLikes) {
      maxAuthor = author
      maxLikes = authorHighestLikes[author]
    }
  }
  return {
    author : maxAuthor,
    likes : maxLikes
  }
    
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}


