import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { startLogout } from '../../actions/auth';


export const Navbar = () => {
  
  const { name } = useSelector(state => state.auth);

  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch( startLogout() );
  }

  return (
    <div className="navbar navbar-dark bg-dark mb-4" >
      <span className="navbar-brand" >
          { `${name.charAt(0).toUpperCase()}${ name.substr( 1, name.length ) }` }    
      </span>
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
