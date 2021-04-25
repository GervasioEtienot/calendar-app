import { types } from '../types/types';

// {
//   id: 'hbkjbljnlkn555fgfgfghf5h',
//   title: 'Cumple Marina',
//   start: moment().toDate(),
//   end: moment().add( 2, 'hours' ).toDate(),
//   notes: 'Comprarle regalo',
//   user: {
//     _id: '123',
//     name: 'Gervasio'
//   }
// }

const initialState = {
  events: [],
  activeEvent: null
};


export const calendarReducer = (state = initialState, action ) => {
  switch (action.type) {
    case types.eventSetActive:
      return {
        ...state,
        activeEvent: action.payload
      }
    case types.eventAddNew:
      return {
        ...state,
        events: [ ...state.events, ...action.payload ]
      }
    case types.eventClearActive:
      return {
        ...state,
        activeEvent: null
      }
    case types.eventUpdated:
      return {
        ...state,
        events: state.events.map(
          e => ( e.id === action.payload.id ? action.payload : e )
        )
      }
    case types.eventDeleted:
      const deleteId = action.payload || state.activeEvent.id; 
      return {
        ...state,
        events: state.events.filter(
          e => ( e.id !== deleteId )
        ),
        activeEvent: null
      }
    case types.eventsLoaded:
      return {
        ...state,
        events: [ ...action.payload ]
      }
    case types.eventLogout:
      return initialState;
    default:
      return state;
  }
}