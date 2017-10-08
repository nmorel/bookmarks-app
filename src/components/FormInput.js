import React from 'react';
import PropTypes from 'prop-types';

/**
 * Helper component to render an input with label and help text.
 * The props of label, input and help text are computed from default values
 * and its own props and then passed to render props.
 *
 * It's mainly here to test the render props pattern. It's gaining momentum
 * since {@link https://blog.kentcdodds.com/introducing-downshift-for-react-b1de3fca0817|Downshift}
 * but was used since some times in {@link https://github.com/chenglou/react-motion|react-motion} for exemple.
 */
export const FormInput = ({
  property,
  model,
  onChange,
  renderLabel,
  renderInput,
  renderHelpText,
}) => {
  return (
    <div>
      {renderLabel && renderLabel({htmlFor: property})}
      {renderInput({
        type: 'text',
        id: property,
        name: property,
        value: model && onChange ? model[property] || '' : undefined,
        onChange:
          model && onChange
            ? ev => {
                let value = ev.target.value;

                if (ev.target.type === 'number' && value) {
                  // We only handle integer
                  value = parseInt(value, 10);
                }

                onChange(
                  {
                    ...model,
                    [property]: value,
                  },
                  {
                    property,
                    value,
                  }
                );
              }
            : undefined,
        'aria-describedby': renderHelpText ? `${property}HelpText` : undefined,
      })}
      {renderHelpText && renderHelpText({className: 'help-text', id: `${property}HelpText`})}
    </div>
  );
};
FormInput.propTypes = {
  // The name of the property (will be used as id and name for the input)
  property: PropTypes.string.isRequired,

  // How to render the input. Its default props will be passed to the function.
  renderInput: PropTypes.func.isRequired,

  // If model and onChange are set, the input becomes controlled
  // The renderInput is given the value prop set with model[property] and the onChange prop.
  model: PropTypes.object,
  // A function expecting 2 parameters.
  // The first one is a new model with the modified value.
  // The second one is an object with property and value properties.
  onChange: PropTypes.func,

  // How to render the label. Its default props will be passed to the function.
  renderLabel: PropTypes.func,

  // How to render the help text. Its default props will be passed to the function.
  renderHelpText: PropTypes.func,
};
