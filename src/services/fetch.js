import queryString from 'query-string';

/**
 * Make a GET request to the given url and params.
 * It expects a json response.
 *
 * @param {String} url The url to call
 * @param {Object} [queryParams] Params to append to the url
 * @return {Promise} A promise returning the JSON result
 */
export function get(url, queryParams) {
  if (queryParams) {
    url += '?' + queryString.stringify(queryParams);
  }

  return fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
    credentials: 'same-origin',
  }).then(response => {
    if (response.status >= 200 && response.status < 300) {
      if (response.status === 204) {
        return null;
      }
      return response.json();
    } else {
      return response
        .text()
        .catch(err => {
          console.error('Cannot parse the response', err);
          return 'Une erreur est survenue';
        })
        .then(message => {
          throw new Error(message);
        });
    }
  });
}
