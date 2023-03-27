const Header = ({name}) => {
    return (
      <div>
      <h3>{name}</h3>
      </div>
    )
  }
  
  const Part = ({name,exercises}) => {
    return (
    <div>
      {name} {exercises}
    </div>
    )
  }
  
  const Total = ({courseInfo}) => {
    const totalAmount = courseInfo.reduce((accumulator, course) => accumulator + course.exercises, 0)
    return (
      <h4>total of {totalAmount} exercises</h4>
    )
  }
  
  const Content = ({parts,name}) => {
    return (
      <div>
    <Header name = {name} />
      {parts.map(onePart =>
        <Part key = {onePart.id} name = {onePart.name} exercises = {onePart.exercises}/>
        )}
      <Total courseInfo = {parts}/>
      </div>
    )
  }
  
  const Course = ({courses}) => {
    return (
      <div>
        <h1>Web development curriculum</h1>
        {courses.map(oneCourse =>
          <Content key = {oneCourse.id} parts = {oneCourse.parts} name = {oneCourse.name} />
          )}
      </div>
    )
  }

export default Course