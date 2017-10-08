import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {search} from '../ducks/bookmarkListVariables';
import {SearchIcon} from './Icon';

/**
 * App header
 */
export const Header = connect(
  ({bookmarkListVariables}) => ({bookmarkListVariables}),
  dispatch => bindActionCreators({search}, dispatch)
)(({bookmarkListVariables: {query}, search}) => {
  return (
    <header className="Header">
      <h1>Mes favoris</h1>
      <div className="SearchContainer">
        <input
          type="text"
          placeholder="Rechercher un favori..."
          value={query || ''}
          onChange={ev => search(ev.target.value)}
        />
        <SearchIcon />
      </div>
    </header>
  );
});
