import React from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import {ApolloAndReduxProvider} from './ApolloAndReduxProvider';
import {ModalRoute} from './components/ModalRoute';
import {Header} from './components/Header';
import {AlgoliaIcon, GraphcoolIcon} from './components/Icon';
import {Home} from './pages/Home';
import {BookmarkCreation} from './pages/BookmarkCreation';
import {BookmarkEdition} from './pages/BookmarkEdition';

export const App = () => (
  <ApolloAndReduxProvider>
    <Router>
      <div className="App">
        <Header />
        <main>
          {/* Home page containing the list is always visible */}
          <Route path="/" component={Home} />
          {/* The other routes open inside a modal */}
          <Switch>
            <ModalRoute exact={true} path={`/add`} closeTo={`/`} component={BookmarkCreation} />
            <ModalRoute exact={true} path={`/:id/edit`} closeTo={`/`} component={BookmarkEdition} />
          </Switch>
        </main>
        <footer className="Footer">
          Powered by :
          <GraphcoolIcon />
          <AlgoliaIcon />
        </footer>
      </div>
    </Router>
  </ApolloAndReduxProvider>
);
