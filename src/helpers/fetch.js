import axios from 'axios';

const baseUrl = process.env.REACT_APP_API_URL;

export const fetchWithoutToken = ( endpoint, data, method = 'GET' ) => {
  const url = `${ baseUrl }/${ endpoint }`;

  if( method === 'GET' ){
    return fetch( url );
  } else {
    return fetch( url, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify( data )
    } );
  }
}

export const fetchWithToken = ( endpoint, data, method = 'GET' ) => {
  const url = `${ baseUrl }/${ endpoint }`;
  const token = localStorage.getItem('token') || '';

  if( method === 'GET' ){
    return fetch( url, {
      method,
      headers: {
        'x-token': token
      }
    } );
  } else {
    return fetch( url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'x-token': token
      },
      body: JSON.stringify( data )
    } );
  }
}

export const fetchAxios = ( endpoint, data, method = 'GET' ) => {
  const url = `${ baseUrl }/${ endpoint }`;
  const token = localStorage.getItem('token') || '';
  let paramsRequest = {
    url,
    method,
    headers: {
      'content-type': 'application/json;charset=utf-8',
      // 'authorization': `Bearer ${token}`,
      'x-token': token
    },
  };

  if( method === 'GET' ){
    paramsRequest = {
      ...paramsRequest,
      params: data
    }
  } else {
    paramsRequest = {
      ...paramsRequest,
      data
    }
  }
  
    return axios( paramsRequest );
}