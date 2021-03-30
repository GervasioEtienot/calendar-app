import moment from 'moment';

export const prepareFixedEvent = ( event ) => {
  
  let fixedEvent = [
    {
      ...event
    }
  ]

  if( event.fixedEvents ) {
    const momentStart = moment( event.start );
    const limitYear = event.getFullYear();
    let i;
    
    
    const weeks = momentStart.diff(`${limitYear}-12-31`, 'weeks');
    for( i=0; i<(-weeks); i++ ){
      fixedEvent.push( {
        ...event,
        start: moment( event.start ).add( (i+1)*7, 'days').toDate(),
        end: moment( event.end ).add( (i+1)*7, 'days').toDate()
      } );
    }
  }
  
  return fixedEvent;
}