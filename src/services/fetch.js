import queryString from 'query-string';

export function get(url, queryParams) {
  return withQueryParams('GET', url, queryParams);
}

export function del(url, queryParams) {
  return withQueryParams('DELETE', url, queryParams);
}

function withQueryParams(method, url, queryParams) {
  const headers = getDefaultHeaders();

  if (queryParams) {
    url += '?' + queryString.stringify(queryParams);
  }

  return fetch(url, {
    method,
    headers,
  }).then(checkStatus);
}

export function post(url, body) {
  return withBody('POST', url, body);
}

export function patch(url, body) {
  return withBody('PATCH', url, body);
}

function withBody(method, url, body) {
  const headers = getDefaultHeaders();

  return fetch(url, {
    method,
    headers,
    body: JSON.stringify(body),
  });
}

function getDefaultHeaders() {
  return {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    if (response.status === 204) {
      return null;
    }
    return response.json();
  } else {
    return response
      .text()
      .then(message => ({message}))
      .catch(() => {
        throwError(response, {message: response.statusText});
      });
  }
}

function throwError(response, error) {
  const result = new Error(error.message);
  result.response = response;
  result.full = error;
  console.log(error);
  throw result;
}
