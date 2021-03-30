import React, { useState } from 'react';

import Modal from 'react-modal';
import DateTimePicker from 'react-datetime-picker';
import moment from 'moment';
import Swal from 'sweetalert2';
import { useDispatch, useSelector } from 'react-redux';
import { uiCloseModal } from '../../actions/ui';
import { eventClearActive, eventStartAddNew, eventStartUpdate } from '../../actions/events';
import { useEffect } from 'react';


const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};
 
// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#root');

const now = moment().minutes(0).seconds(0).add(1, 'hours');
const nowPlus1 = moment( now ).add( 1, 'hours');

const initEvent = {
  title: "",
  notes: "",
  start: now.toDate(),
  end: nowPlus1.toDate(),
  fixedEvent: false
}

export const CalendarModal = () => {
  
  const [titleValid, setTitleValid] = useState(true)
  const [formValues, setFormValues] = useState( initEvent );
  const [addNotes, setAddNotes] = useState(false);

  const { modalOpen } = useSelector(state => state.ui );
  const { activeEvent } = useSelector(state => state.calendar ); 
  const dispatch = useDispatch();

  const { title, notes, start, end, fixedEvent } = formValues;

  useEffect(() => {
    if( activeEvent ){
      setFormValues(activeEvent)
      if( activeEvent.notes ){
        setAddNotes(true)
      }
    } else {
      setFormValues( initEvent )
    }
    
  }, [activeEvent]);

  const handleInputChange = ({ target }) => {
    setFormValues({
      ...formValues,
      [target.name]: target.type === 'checkbox' ? target.checked : target.value
    })
  }

  const closeModal = () => {
    dispatch( uiCloseModal() );
    dispatch( eventClearActive() );
    setFormValues( initEvent );
    setAddNotes(false)
  }

  const handleStartDateChange = (e) => {
        
    if(e >= end){
      const startPlusOne = moment( e ).add( 1, 'hours').toDate();
      setFormValues({
        ...formValues,
        start: e,
        end: startPlusOne
      });
    } else {
      setFormValues({
        ...formValues,
        start: e
      });
    }
  }

  const handleEndDateChange = (e) => {
    setFormValues({
      ...formValues,
      end: e
    })
    
  }

  const handleSubmitForm = (e) => {
    e.preventDefault();
    
    const momentStart = moment( start );
    const momentEnd = moment( end ); 

    if( momentStart.isSameOrAfter( momentEnd ) ) {
      return Swal.fire('Error', 'La fecha fin debe ser mayor que la fecha de inicio', 'error');
    }

    if( title.trim().length < 2 ) {
      setTitleValid(false);
    }

    if( formValues.id ){
      dispatch( eventStartUpdate( formValues ) )
      
    } else {
      dispatch( eventStartAddNew( formValues ) );
    }

    setTitleValid(true)
    closeModal();
  }
  
  return (
    <Modal
      isOpen={ modalOpen }
      onRequestClose={ closeModal }
      style={ customStyles }
      closeTimeoutMS={ 200 }
      className="modal"
      overlayClassName="modal-fondo"
    >
      <h1> { (activeEvent) ? "Editar evento" : "Nuevo evento" } </h1>
      <hr />
      <form className="container" onSubmit={ handleSubmitForm }>

          <div className="form-group">
              <label>Fecha y hora inicio</label>
              <DateTimePicker
                onChange={ handleStartDateChange }
                value={ start }
                className="form-control"
              />
          </div>

          <div className="form-group">
              <label>Fecha y hora fin</label>
              <DateTimePicker
                onChange={ handleEndDateChange }
                value={ end }
                minDate={ start }
                className="form-control"
              />
          </div>

          <hr />
          <div className="form-group">
              <label>Titulo y notas</label>
              <input 
                  type="text" 
                  className={`form-control ${ !titleValid && 'is-invalid' }`}
                  placeholder="Título del evento"
                  name="title"
                  autoComplete="off"
                  value={ title }
                  onChange={ handleInputChange }
              />
              <small id="emailHelp" className="form-text text-muted">Una descripción corta</small>
          </div>

          {
            addNotes ? 
            (
              <div className="form-group">
                <textarea 
                    type="text" 
                    className="form-control"
                    placeholder="Notas"
                    rows="5"
                    name="notes"
                    value={ notes }
                    onChange={ handleInputChange }
                ></textarea>
                <small id="emailHelp" className="form-text text-muted">Información adicional</small>
              </div>
            ) :
            <button 
                onClick={ () => setAddNotes( true ) } 
                className="btn btn-outline-secondary btn-sm mb-2"
            > 
              Agregar nota 
            </button>
          }

          <div className="">
              <label>Evento fijo semanal</label>
              <input 
                  type="checkbox"
                  className="ml-2"
                  name="fixedEvent"
                  checked={ fixedEvent }
                  onChange={ handleInputChange }
              />
          </div>

          <button
              type="submit"
              className="btn btn-outline-primary btn-block"
          >
              <i className="far fa-save"></i>
              <span> Guardar</span>
          </button>

      </form>
    </Modal>
  )
}
