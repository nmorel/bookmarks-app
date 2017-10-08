import React from 'react';
import PropTypes from 'prop-types';
import {Route} from 'react-router-dom';
import {Modal} from './Modal';

/**
 * A custom route that render the page inside a modal.
 */
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
  // Location to go to if the user clicks outside the modal or the close button
  closeTo: PropTypes.string.isRequired,
  // The component to render in modal
  component: PropTypes.any.isRequired,
};
