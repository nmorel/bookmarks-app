import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

const modalRoot = document.getElementById('modal');

/**
 * Component using React 16 createPortal API.
 * @see https://reactjs.org/docs/portals.html
 */
export class Modal extends Component {
  static propTypes = {
    onClose: PropTypes.func.isRequired,
  };

  el = document.createElement('div');

  componentDidMount() {
    modalRoot.appendChild(this.el);
  }

  componentWillUnmount() {
    modalRoot.removeChild(this.el);
  }

  render() {
    return ReactDOM.createPortal(
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(10, 10, 10, 0.45)',
          overflowY: 'scroll',
          zIndex: 1000,
        }}
        onClick={this.props.onClose}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
          }}
        >
          <div
            style={{
              backgroundColor: '#fff',
              position: 'relative',
              padding: 20,
              minWidth: 400,
            }}
            onClick={ev => ev.stopPropagation()}
          >
            <div
              style={{
                position: 'absolute',
                top: 5,
                right: 5,
                cursor: 'pointer',
              }}
              onClick={this.props.onClose}
            >
              X
            </div>
            {this.props.children}
          </div>
        </div>
      </div>,
      this.el
    );
  }
}
