import moment from 'moment';

export const prepareEvents = (events = []) => {
  return events.map( (e) => ({
    ...e,
    end: moment(e.end).toDate(),
    start: moment(e.start).toDate()
  }));
}

export const prepareFixedEvent = ( event, creatingEvent = false ) => {
  
  let newEvent = [];

  if( creatingEvent ){
    newEvent.push( event )
  }

  if( event.fixedEvent ) {
    const momentStart = moment( event.start );
    const limitYear = event.start.getFullYear();
    let i;
    
    
    const weeks = momentStart.diff(`${limitYear}-12-31`, 'weeks');
    for( i=0; i<(-weeks); i++ ){
      newEvent.push( {
        ...event,
        start: moment( event.start ).add( (i+1)*7, 'days').toDate(),
        end: moment( event.end ).add( (i+1)*7, 'days').toDate()
      } );
    }
    
  }
  
  
  return newEvent;
}