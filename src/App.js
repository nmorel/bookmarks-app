import React, {Component} from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import {ApolloProvider, ApolloClient, createNetworkInterface} from 'react-apollo';
import {ModalRoute} from './components/ModalRoute';
import {Home} from './pages/Home';
import {BookmarkCreation} from './pages/BookmarkCreation';

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
              {/* Home page containing the list is always visible */}
              <Route path="/" component={Home} />
              {/* The other routes open inside a modal */}
              <Switch>
                <ModalRoute exact={true} path={`/add`} closeTo={`/`} component={BookmarkCreation} />
              </Switch>
            </main>
          </div>
        </Router>
      </ApolloProvider>
    );
  }
}

export default App;
