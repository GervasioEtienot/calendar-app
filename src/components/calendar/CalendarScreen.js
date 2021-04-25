import React, { useEffect } from 'react'
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
import { eventClearActive, eventSetActive, eventsStartLoading } from '../../actions/events';
import { AddNewFab } from '../ui/AddNewFab';
import { DeleteEventFab } from '../ui/DeleteEventFab';
import { ColoredDateCellWrapper } from './ColoredDateCellWrapper';

moment.locale('es');

const localizer = momentLocalizer(moment) // or globalizeLocalizer

const fieldsColors = ['blue', 'green', 'red'];

export const CalendarScreen = () => {
  
  const [lastView, setLastView] = useState(localStorage.getItem('lastView') || 'week' )
  const dispatch = useDispatch();
  const { events, activeEvent } = useSelector(state => state.calendar);
  const { uid } = useSelector(state => state.auth);

  useEffect(() => {
    dispatch( eventsStartLoading() );
  }, [dispatch])

  const onDoubleClick = (e) => {
    dispatch( uiOpenModal() )
  }

  const onSelectEvent = (e) => {
    dispatch( eventSetActive(e) );
  }

  const onSelectSlot = (e) => {
    if( activeEvent ){
      dispatch( eventClearActive() );
    } else {
      if( e.action === 'doubleClick' || e.action === 'select' ){
        const inicio = moment( e.start ).minutes(0).seconds(0).toDate()
        const final = moment( inicio ).add(1, 'hours').toDate()
        e.start = inicio
        e.end = final
        
        let initTurn = {
          // title: "",
          players: [],
          start: inicio,
          end: final,
          field: 0,
          fixedEvent: false
        }
        dispatch( eventSetActive(initTurn) );
        dispatch( uiOpenModal() )
      }
    }
    
  }

  const onViewChange = (e) => {
    setLastView(e)
    localStorage.setItem('lastView', e)
  }

  const eventStyleGetter = ( event, start, end, isSelected ) =>{
    const now = moment();
    const style = {
      backgroundColor: ( uid === event.user._id ) ? fieldsColors[1]: '#367CF7',
      // backgroundColor: fieldsColors[event.field-1],
      border: ( isSelected && activeEvent ) ? '3px solid black': '',
      borderRadius: ( isSelected && activeEvent ) ? '4px': 'opx',
      opacity: ( moment( now ).isBefore( moment( start ) ) ) ? 0.8: 0.4,
      display: 'block',
      color: 'white',
      fontSize: '0.8rem',
      maxWidth: "33.33%",
      // overflowX: 'hidden'
      
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
        defaultView="week"
        onDoubleClickEvent={ onDoubleClick }
        onSelectEvent={ onSelectEvent }
        onSelectSlot={ onSelectSlot }
        selectable={ true }
        longPressThreshold={ 10 }
        onView={ onViewChange }
        components={{
          event: CalendarEvent,
          dateCellWrapper: ColoredDateCellWrapper
        }}
        views={['month', 'week', 'day']}
        view={ lastView }
        min={new Date(2016, 10, 0, 17, 0, 0)}
        scrollToTime={new Date(2016, 1, 1, 10)}
        popup
      />

      <AddNewFab />
      
      {
        activeEvent && <DeleteEventFab />
      }
      
      <CalendarModal />

    </div>
  )
}
