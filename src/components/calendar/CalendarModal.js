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
  // title: "",
  players: [],
  start: now.toDate(),
  end: nowPlus1.toDate(),
  field: 0,
  fixedEvent: false
}

const days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
const numPlayers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']

export const CalendarModal = () => {
  
  // const [titleValid, setTitleValid] = useState(true)
  const [formValues, setFormValues] = useState( initEvent );
  const [addNotes, setAddNotes] = useState(false);
  const [user, setUser] = useState('')
  
  const { name } = useSelector(state => state.auth) 
  const { modalOpen } = useSelector(state => state.ui );
  const { activeEvent } = useSelector(state => state.calendar ); 
  const dispatch = useDispatch();
  
  const { players, start, end, field, fixedEvent } = formValues;

  useEffect(() => {
    if( activeEvent ){
      setFormValues(activeEvent)
      setUser( activeEvent.user ? activeEvent.user.name : name )
      if( activeEvent.players.length > 0 ){
        if( activeEvent.players.some( player => player !== "" ) ){
          setAddNotes(true)
        }
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

  const handleStartDateChange = (e) => {
        
    const startPlusOne = moment( e ).add( 1, 'hours').toDate();
    setFormValues({
      ...formValues,
      start: e,
      end: startPlusOne
    });
  }

  const closeModal = () => {
    dispatch( uiCloseModal() );
    dispatch( eventClearActive() );
    setFormValues( initEvent );
    setAddNotes(false)
  }

  const handlePlayerChange = ({target}) => {
    
    let auxPlayers = players;
    auxPlayers[target.name-1] = target.value
    setFormValues({
      ...formValues,
      players: auxPlayers
    })
  }

  // const getUser = () => {
  //   return activeEvent.user ? activeEvent.user.name : name
  // }

  const handleSubmitForm = (e) => {
    e.preventDefault();
    
    
    const momentStart = moment( start );
    const momentEnd = moment( end ); 

    if( momentStart.isSameOrAfter( momentEnd ) ) {
      return Swal.fire('Error', 'La fecha fin debe ser mayor que la fecha de inicio', 'error');
    }

    // if( title.trim().length < 2 ) {
    //   setTitleValid(false);
    // }
    
    let formValuesFixed = {
      ...formValues,
      field: parseInt(formValues.field) 
    }

    if( formValuesFixed.id ){
      dispatch( eventStartUpdate( formValuesFixed ) )
      
    } else {
      dispatch( eventStartAddNew( formValuesFixed ) );
    }

    // setTitleValid(true)
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
      <h2> { (activeEvent?.user) ? "Editar turno" : "Nuevo turno" } </h2>
      <hr />
      <div className="container-fluid">

      <form className="row g-3 justify-content-center" onSubmit={ handleSubmitForm }>

          <div className={`col-md-${ !activeEvent ? '8': '6'} mb-2`}>
              <label>Fecha</label>
              { !activeEvent ? 
                <DateTimePicker
                  onChange={ handleStartDateChange }
                  value={ start }
                  className="form-control"
                />
              :
                <div className="form-control" >
                  {`${ days[start.getDay()]} ${ start.getDate() } de ${ months[start.getMonth()] }` }
                </div>
              }
          </div>
          <div className={`col-md-${ !activeEvent ? '4': '6'} mb-2`}>
              <label>Hora</label>
              <div className="form-control" >
                {`${ start.getHours() } a ${ end.getHours() }hs`}
              </div>
              

          </div>

          <hr />
          {/* <div className="col-md-6">
              <label className="form-label">Titulo</label>
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
          </div> */}
          <div className="col-md-6 mb-2">
            <label className="form-label" >Cancha</label>
            <select 
              className="form-control" 
              id="inputState"
              type="number"
              name="field"
              value={ field }
              onChange={ handleInputChange }
            >
              <option defaultValue>Elegir...</option>
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
            </select>
          </div>
          <div className="col-md-6 mb-2">
              <label className="form-label">Nombre</label>
              <input 
                  type="text" 
                  className="form-control"
                  name="user"
                  value={ user }
                  readOnly
              />
          </div>
          <div className="col-md-6 mb-2">
            <div className="form-check">
              <input 
                  type="checkbox"
                  className="form-check-input"
                  id="gridCheck"
                  name="fixedEvent"
                  checked={ fixedEvent }
                  onChange={ handleInputChange }
              />
              <label className="form-check-label">Turno fijo semanal</label>

            </div>
          </div>

          {
            addNotes ? 
            (
              <div className="col-12">
                {numPlayers.map( (player, index) => {
                  return (
                        <div className="input-group mb-3" key={ player } >
                          <span className="input-group-text" id="basic-addon1">{player}</span>
                          <input 
                            type="text"
                            className="form-control"
                            name={ player }
                            value={ players[index] }
                            onChange={ handlePlayerChange }
                          />
                        </div>)
                } )}
              </div>
            ) :
            <div className="col-md-6 mb-2">
              <button 
                  onClick={ () => setAddNotes( true ) } 
                  className="btn btn-outline-secondary btn-sm mb-2"
              > 
                Anotar jugadores 
              </button>
            </div>
          }

          <div className="col-12 justify-content-center">
            <button
                type="submit"
                className="btn btn-outline-primary btn-block"
            >
                <i className="far fa-save"></i>
                <span> Guardar</span>
            </button>
          </div>


      </form>
      </div>
    </Modal>
  )
}
