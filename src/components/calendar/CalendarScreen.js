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
import { useDispatch, useSelector } from 'react-redux';
import { uiOpenModal } from '../../actions/ui';
import { eventClearActive, eventSetActive } from '../../actions/events';
import { AddNewFab } from '../ui/AddNewFab';
import { DeleteEventFab } from '../ui/DeleteEventFab';

moment.locale('es');

const localizer = momentLocalizer(moment) // or globalizeLocalizer



export const CalendarScreen = () => {
  
  const [lastView, setLastView] = useState(localStorage.getItem('lastView') || 'month' )
  const dispatch = useDispatch();
  const { events, activeEvent } = useSelector(state => state.calendar);

  const onDoubleClick = (e) => {
    dispatch( uiOpenModal() )
  }

  const onSelectEvent = (e) => {
    dispatch( eventSetActive(e) );
    console.log(e)
  }

  const onSelectSlot = (e) => {
    if( activeEvent ){
      dispatch( eventClearActive() );
    } else {
      if( e.action === 'doubleClick'){
        console.log('Se dobleclickeo')
      }
    }
    
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
        onSelectSlot={ onSelectSlot }
        selectable={ true }
        onView={ onViewChange }
        components={{
          event: CalendarEvent
        }}
        view={ lastView }
      />

      <AddNewFab />
      
      {
        activeEvent && <DeleteEventFab />
      }
      
      <CalendarModal />

    </div>
  )
}
