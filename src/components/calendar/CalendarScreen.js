import React from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'

import { Navbar } from '../ui/Navbar'
import { messages } from '../../helpers/calendar-messages-es';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'moment/locale/es';
import { CalendarEvent } from './CalendarEvent';
import { useState } from 'react';
import { CalendarModal } from './CalendarModal';

moment.locale('es');

const localizer = momentLocalizer(moment) // or globalizeLocalizer

const events = [{
  title: 'Cumple Marina',
  start: moment().toDate(),
  end: moment().add( 2, 'hours' ).toDate(),
  bgcolor: '#fafafa',
  notes: 'Comprarle regalo',
  user: {
    _id: '123',
    name: 'Gervasio'
  }
}]

export const CalendarScreen = () => {
  
  const [lastView, setLastView] = useState(localStorage.getItem('lastView') || 'month' )

  const onDoubleClick = (e) => {
    console.log(e)
  }

  const onSelectEvent = (e) => {
    console.log(e)
  }

  const onViewChange = (e) => {
    setLastView(e)
    localStorage.setItem('lastView', e)
  }

  const eventStyleGetter = ( event, start, end, isSelected ) =>{

    const style = {
      backgroundColor: '#367CF7',
      borderRadius: '0px',
      opacity: 0.8,
      display: 'block',
      color: 'white'
    }

    return {
      style
    }
  };

  return (
    <div className="calendar-screen" >
      <Navbar />

      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        messages={ messages }
        eventPropGetter={ eventStyleGetter }
        onDoubleClickEvent={ onDoubleClick }
        onSelectEvent={ onSelectEvent }
        onView={ onViewChange }
        components={{
          event: CalendarEvent
        }}
        view={ lastView }
      />

      <CalendarModal />

    </div>
  )
}
