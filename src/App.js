import React, {Component} from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import {ApolloAndReduxProvider} from './ApolloAndReduxProvider';
import {ModalRoute} from './components/ModalRoute';
import {Home} from './pages/Home';
import {BookmarkCreation} from './pages/BookmarkCreation';
import {BookmarkEdition} from './pages/BookmarkEdition';

class App extends Component {
  render() {
    return (
      <ApolloAndReduxProvider>
        <Router>
          <div className="App">
            <header>
              <h1>Mes bookmarks</h1>
            </header>
            <main>
              {/* Home page containing the list is always visible */}
              <Route path="/" component={Home} />
              {/* The other routes open inside a modal */}
              <Switch>
                <ModalRoute exact={true} path={`/add`} closeTo={`/`} component={BookmarkCreation} />
                <ModalRoute
                  exact={true}
                  path={`/:id/edit`}
                  closeTo={`/`}
                  component={BookmarkEdition}
                />
              </Switch>
            </main>
          </div>
        </Router>
      </ApolloAndReduxProvider>
    );
  }
}

export default App;
