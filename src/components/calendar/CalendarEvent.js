import React from 'react'

export const CalendarEvent = ( event ) => {
  
  const { title, user, field } = event.event;
  // console.log(event.event)
  return (
    <div>
      {/* <span > { title } </span> */}
      <div> {`Cancha ${field}`} </div>
      <strong> { user?.name } </strong>
    </div>
  )
}
