import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { startLogout } from '../../actions/auth';
import { eventsStartLoading } from '../../actions/events';


export const Navbar = () => {
  
  const [formValues, setFormValues] = useState( {
    field: "0",
    fixedEvent: false
  } );
  // const [field, setField] = useState(0)
  const [showFilters, setShowFilters] = useState(false)

  const { name } = useSelector(state => state.auth);

  const dispatch = useDispatch();

  const { field, fixedEvent } = formValues;

  const handleInputChange = ({ target }) => {
    // let params = formValues;
    setFormValues({
      ...formValues,
      [target.name]: target.type === 'checkbox' ? target.checked : target.value
    })
    let params = {
      ...formValues,
      [target.name]: target.type === 'checkbox' ? target.checked : target.value
    }
    
    if( params.field === "0" ){
      delete params.field
    }
    if( params.fixedEvent === false ){
      delete params.fixedEvent
    }
    
    dispatch( eventsStartLoading( params ) )
  }

  // const handleFieldChange = ({ target }) => {
  //   setField( target.value )
    
  //   let params = target.value !== "0" ? { field: target.value } : {}
    
  //   dispatch( eventsStartLoading( params ) )
  // }

  const handleLogout = () => {
    dispatch( startLogout() );
  }

  return (
    <div className="navbar navbar-dark bg-dark mb-4" >
      <span className="navbar-brand" >
          { `${name.charAt(0).toUpperCase()}${ name.substr( 1, name.length ) }` }    
      </span>
      { !showFilters ? 
          <button 
            className="btn btn-outline-secondary text-white"
            onClick={ () => setShowFilters(!showFilters) }
          >
            Filtros
          </button>
        :
        <div className="d-flex flex-row pt-2">
          
          <select 
            className="form-control" 
            id="inputState"
            type="number"
            name="field"
            value={ field }
            onChange={ handleInputChange }
          >
            <option defaultValue value="0">Todas las canchas</option>
            <option value="1">Cancha 1</option>
            <option value="2">Cancha 2</option>
            <option value="3">Cancha 3</option>
          </select>
          <div className="form-check form-switch ml-4 text-white">
            <input 
              className="form-check-input" 
              type="checkbox" 
              id="flexSwitchCheckDefault"
              name="fixedEvent"
              checked={ fixedEvent }
              onChange={ handleInputChange }
              />
            <label className="form-check-label" htmlFor="flexSwitchCheckDefault">Turnos fijos</label>
          </div>
        </div>
        }
      <button 
        className="btn btn-outline-danger"
        onClick={ handleLogout }
      >
        <i className="fas fa-sign-out-alt" />
        <span> Salir</span>
      </button>
    </div>
  )
}
