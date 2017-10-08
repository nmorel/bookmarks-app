import React, {Component} from 'react';

/**
 * Render a default image if no image or image is loading or an error occurred loading the image.
 * Otherwise render the image specified.
 */
export class Image extends Component {
  state = {
    loaded: false,
    showDefault: true,
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.src !== this.props.src) {
      this.setState({
        loaded: false,
        showDefault: true,
      });
    }
  }

  onImageLoaded = () =>
    this.setState({
      loaded: true,
      showDefault: false,
    });

  onImageError = () =>
    this.setState({
      loaded: true,
      showDefault: true,
    });

  render() {
    const {loaded, showDefault} = this.state;

    const result = [];

    if (showDefault) {
      result.push(
        // Cannot make it work with a data uri so here is plain svg.
        // And the xlink:href is not supported in React so html injection
        <svg
          key="default"
          viewBox="0 0 240 162"
          dangerouslySetInnerHTML={{
            __html: `
              <defs>
                <symbol id="a" viewBox="0 0 90 66" opacity="0.3">
                  <path d="M85 5v56H5V5h80m5-5H0v66h90V0z" />
                  <circle cx="18" cy="20" r="6" />
                  <path d="M56 14L37 39l-8-6-17 23h67z" />
                </symbol>
              </defs>
              <rect width="100%" height="100%" fill="#f0f0f0" />
              <use xlink:href="#a" width="20%" x="40%" />
          `,
          }}
        />
      );
    }
    if (this.props.src && (!loaded || !showDefault)) {
      let props = this.props;
      if (!loaded) {
        props = {
          ...props,
          style: {display: 'none'},
          onLoad: this.onImageLoaded,
          onError: this.onImageError,
        };
      }
      result.push(<img key="real" {...props} alt={this.props.alt} />);
    }

    return result;
  }
}
