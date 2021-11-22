export const fetchHandlerError = {
  REQUEST_ERROR: 'requestError',
  SUCCESS: 'success',
  INTERNAL_ERROR: 'internalError',
}

export function fetchRequest(url, requestOptions, params={}){
  let endpoint = new URL(url);

  for(var key in params){
    if (!params.hasOwnProperty(key)) continue;
    endpoint.searchParams.append(key, params[key]);
  }
  const data = fetch(endpoint, requestOptions)
    .then(async (response) => {
      if(response.status === 204){
        return {type: fetchHandlerError.SUCCESS}
      }
      const isJson = response.headers.get('content-type')?.includes('application/json');
      const payload = isJson && await response.json();
      if (!response.ok) {
        const error = payload || response.status;
        return {type: fetchHandlerError.REQUEST_ERROR, payload: error.Error};
      }
      return {type: fetchHandlerError.SUCCESS, payload: payload};
    })
    .catch((error) => {
      console.error(error);
      return {type: fetchHandlerError.INTERNAL_ERROR, payload: 'Ha ocurrido un error'};
    });
  return data;
}
