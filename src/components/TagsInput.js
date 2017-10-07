import React from 'react';
import RTagsInput from 'react-tagsinput';

/**
 * Input component to edit a list of tags.
 * It's a thin wrapper around {@link https://github.com/olahol/react-tagsinput|react-tagsinput}.
 */
export const TagsInput = props => (
  <RTagsInput
    addOnBlur={true}
    addOnPaste={true}
    inputProps={{placeholder: 'Ajouter un tag'}}
    {...props}
  />
);
