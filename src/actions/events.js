import Swal from "sweetalert2";
import { fetchAxios, fetchWithToken } from "../helpers/fetch";
import { prepareEvents, prepareFixedEvent } from "../helpers/prepareEvents";
import { types } from "../types/types";


export const eventSetActive = (event) => ({
  type: types.eventSetActive,
  payload: event
});

export const eventStartAddNew = (event) => {
  return async( dispatch, getState ) => {
    const { uid, name } = getState().auth;
    const { events } = getState().calendar;

    let eventsFiltered = events.filter( evento => evento.start.toString() === event.start.toString() )
    
    let busyField = eventsFiltered.find( evento => evento.field === event.field )
    
    if( busyField ){
      return Swal.fire( 'Error', `La cancha ${event.field.toString()} ya está ocupada`, 'error' );
    }
    
    
    
    try {
      
      const resp = await fetchWithToken('events', event, 'POST');
      const body = await resp.json();

      if(body.ok){
        event.id = body.event.id;
        event.user = {
          _id: uid,
          name
        }
        // console.log(event)
        dispatch( eventAddNew( prepareFixedEvent(event, true) ) );
      }
      
    } catch (error) {
        console.log(error)
    }    

  }
}

const eventAddNew = (event) => ({
  type: types.eventAddNew,
  payload: event
});

export const eventClearActive = () => ({ type: types.eventClearActive });

export const eventStartUpdate = (event) => {
  return async ( dispatch ) => {
    
    try {
      const resp = await fetchWithToken(`events/${event.id}`, event, 'PUT');
      const body = await resp.json();
      
      if(body.ok){
        dispatch( eventDeleted( event.id ) );
        dispatch( eventAddNew( prepareFixedEvent(event, true) ) );
        
      } else {
        Swal.fire( 'Error', body.msg, 'error' );
      }
      
    } catch (error) {
        console.log(error)
      }
  }
}

const eventUpdated = ( event ) => ({ 
  type: types.eventUpdated, 
  payload: event
});

export const eventStartDelete = () => {
  return async ( dispatch, getState ) => {
    
    const { id } = getState().calendar.activeEvent;

    try {
      const resp = await fetchWithToken(`events/${id}`, {},'DELETE');
      const body = await resp.json();
      
      if(body.ok){
        dispatch( eventDeleted( id ) );
      } else {
        Swal.fire( 'Error', body.msg, 'error' );
      }
      
    } catch (error) {
        console.log(error)
      }
  }
}

const eventDeleted = ( id ) => ({ type: types.eventDeleted, payload: id });

export const eventsStartLoading = ( filter = {} ) => {
  return async ( dispatch ) => {
    try {
      // const resp = await fetchWithToken('events');
      // const body = await resp.json();
      // filter = {
      //   ...filter,
      //   fixedEvent: true
      // }
      const { data } = await fetchAxios('events', filter )
      const events = prepareEvents( data.events )
      let expandedEvents = events;
      events.forEach( (event) => {
        if( event.fixedEvent ){
          expandedEvents = [ ...expandedEvents, ...prepareFixedEvent(event) ]
        }
      })
      
      dispatch( eventsLoaded( expandedEvents ) );
      
    } catch (error) {
        console.log(error)
      }
  }
}

const eventsLoaded = (events) => ({
  type: types.eventsLoaded,
  payload: events
});

export const eventLogout = () => ({ type: types.eventLogout });