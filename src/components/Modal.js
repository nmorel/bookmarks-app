import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

const modalRoot = document.getElementById('modal');

// When a modal is open, we want to remove the scroll from the body.
// Otherwise, the user will be able to scroll the content below the modal.
// We keep the counter outside the modal because multiple modal can be open at same time.
let counterModalOpen = 0;
const updateBody = () => {
  if (counterModalOpen > 0) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = 'auto';
  }
};

/**
 * Component using React 16 createPortal API.
 * @see {@link https://reactjs.org/docs/portals.html}
 */
export class Modal extends Component {
  static propTypes = {
    onClose: PropTypes.func.isRequired,
  };

  el = document.createElement('div');

  componentDidMount() {
    counterModalOpen++;
    updateBody();
    modalRoot.appendChild(this.el);
  }

  componentWillUnmount() {
    counterModalOpen--;
    updateBody();
    modalRoot.removeChild(this.el);
  }

  render() {
    return ReactDOM.createPortal(
      <div className="Modal" onClick={this.props.onClose}>
        <div className="Modal-Panel" onClick={ev => ev.stopPropagation()}>
          <button
            className="close-button"
            aria-label="Close alert"
            type="button"
            onClick={this.props.onClose}
          >
            <span aria-hidden="true">&times;</span>
          </button>
          {this.props.children}
        </div>
      </div>,
      this.el
    );
  }
}
