import React from 'react';
import {createStore, combineReducers, applyMiddleware, compose} from 'redux';
import {ApolloClient, ApolloProvider, createNetworkInterface} from 'react-apollo';
import reducers from './ducks';

const networkInterface = createNetworkInterface({
  uri: `https://api.graph.cool/simple/v1/cj8926he304gk0182i7ogz5ce`,
});
const client = new ApolloClient({
  networkInterface,
});

// Create a single Redux store with the reducers from Apollo and our own
const store = createStore(
  // Reducer
  combineReducers({
    apollo: client.reducer(),
    ...reducers,
  }),
  // Initial state
  {},
  // Middleware
  compose(
    applyMiddleware(client.middleware()),
    // Extension to get access to the store in DevTools
    typeof window.__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined'
      ? window.__REDUX_DEVTOOLS_EXTENSION__()
      : f => f
  )
);

export const ApolloAndReduxProvider = ({children}) => (
  <ApolloProvider store={store} client={client}>
    {children}
  </ApolloProvider>
);
