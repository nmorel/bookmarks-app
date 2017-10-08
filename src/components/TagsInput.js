import React from 'react';
import RTagsInput from 'react-tagsinput';

/**
 * Input component to edit a list of tags.
 * It's a thin wrapper around {@link https://github.com/olahol/react-tagsinput|react-tagsinput}.
 * Just in case we change the component or do our own.
 */
export const TagsInput = props => (
  <RTagsInput
    addOnBlur={true}
    addOnPaste={true}
    {...props}
  />
);
