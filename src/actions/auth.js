import Swal from "sweetalert2";
import { fetchWithoutToken, fetchWithToken } from "../helpers/fetch";
import { types } from '../types/types';
import { eventLogout } from "./events";


export const startLogin = ( email, password ) => {
  return async( dispatch ) => {
    
    const resp = await fetchWithoutToken( 'auth', { email, password }, 'POST' );
    const { ok, token, uid, name, msg } = await resp.json();
    
    if( ok ){
      localStorage.setItem('token', token );
      localStorage.setItem('token-init-date', new Date().getTime() );
      dispatch( login({ uid, name }) );
    } else {
      Swal.fire('Error', msg, 'error');
    }
  }
}

export const startRegister = ( email, password, userName ) => {
  return async( dispatch ) => {
    
    const resp = await fetchWithoutToken( 'auth/new', { email, password, name: userName }, 'POST' );
    const { ok, token, uid, name, msg } = await resp.json();
    
    if( ok ){
      localStorage.setItem('token', token );
      localStorage.setItem('token-init-date', new Date().getTime() );
      dispatch( login({ uid, name }) );
    } else {
      Swal.fire('Error', msg, 'error');
    }
  }
}

export const startChecking = () => {
  return async( dispatch ) => {
    
    const resp = await fetchWithToken( 'auth/renew' );
    const { ok, token, uid, name, msg } = await resp.json();
    
    if( ok ){
      localStorage.setItem('token', token );
      localStorage.setItem('token-init-date', new Date().getTime() );
      dispatch( login({ uid, name }) );
    } else {
      dispatch( checkingFinish() );
    }
  }
}

const checkingFinish = () => ({ type: types.authCheckingFinish });

const login = ( user ) => ({
  type: types.authLogin,
  payload: user
});

export const startLogout = () => {
  return (dispatch) => {
    localStorage.clear();
    dispatch( logout() );
    dispatch( eventLogout() );
  }
}

const logout = () => ({ type: types.authLogout });