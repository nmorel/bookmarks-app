import React, {Component} from 'react';
import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom';
import {ApolloProvider, ApolloClient, createNetworkInterface} from 'react-apollo';
import {Home} from './pages/Home';

const networkInterface = createNetworkInterface({
  uri: `https://api.graph.cool/simple/v1/cj8926he304gk0182i7ogz5ce`,
});
const client = new ApolloClient({
  networkInterface,
});

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <Router>
          <div className="App">
            <header className="App-header">
              <h1 className="App-title">Mes bookmarks</h1>
            </header>
            <main>
              <Switch>
                <Route path="/" component={Home} />
                <Redirect to="/" />
              </Switch>
            </main>
          </div>
        </Router>
      </ApolloProvider>
    );
  }
}

export default App;
