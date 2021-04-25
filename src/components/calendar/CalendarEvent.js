import React from 'react'

export const CalendarEvent = ( event ) => {
  
  const { title, user, field } = event.event;
  // console.log(event.event)
  const splitName = user?.name.split(' ');
  return (
    <div style={{ overflowX: 'hidden' }} >
      {/* <span > { title } </span> */}
      <div style={{ fontWeight: "bold" }}> {field} </div>
      <strong style={{ display: 'block' }}> { splitName[0] } </strong>
      <strong style={{ display: 'block' }}> { splitName[1] } </strong>
    </div>
  )
}
