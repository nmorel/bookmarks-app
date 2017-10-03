import React from 'react';
import PropTypes from 'prop-types';
import {Route} from 'react-router-dom';
import {Modal} from './Modal';

export function ModalRoute({closeTo, component: Component, ...others}) {
  return (
    <Route
      {...others}
      render={props => (
        <Modal onClose={() => props.history.push(closeTo)}>
          <Component {...props} />
        </Modal>
      )}
    />
  );
}

ModalRoute.propTypes = {
  closeTo: PropTypes.string.isRequired,
  component: PropTypes.any.isRequired,
};
