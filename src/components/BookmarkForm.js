import React, {Component} from 'react';
import {TagsInput} from './TagsInput';
import {FormInput} from './FormInput';

/**
 * Component to include inside a <form> that add all the inputs to edit a bookmark.
 */
export class BookmarkForm extends Component {
  url;

  componentDidMount() {
    if (!this.props.loading) {
      // The autoFocus does not work. Maybe a problem with portal ?
      setTimeout(() => {
        this.url.focus();
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.loading && !this.props.loading) {
      this.url.focus();
    }
  }

  onChangeTags = tags =>
    this.props.onChange({
      ...this.props.bookmark,
      tags,
    });

  render() {
    const {loading, bookmark, onChange} = this.props;

    return (
      <div>
        <FormInput
          property="url"
          model={bookmark}
          onChange={onChange}
          renderLabel={props => <label {...props}>Lien *</label>}
          renderInput={props => (
            <input
              {...props}
              ref={url => (this.url = url)}
              type="url"
              placeholder="https://vimeo.com/20853149"
              required
              disabled={loading}
              autoFocus={true}
            />
          )}
        />

        <FormInput
          property="title"
          model={bookmark}
          onChange={onChange}
          renderLabel={props => <label {...props}>Titre *</label>}
          renderInput={props => (
            <input {...props} placeholder="A title" required disabled={loading} />
          )}
        />

        <FormInput
          property="author"
          model={bookmark}
          onChange={onChange}
          renderLabel={props => <label {...props}>Auteur</label>}
          renderInput={props => <input {...props} placeholder="Alfred Dupont" disabled={loading} />}
        />

        {!!bookmark.kind &&
          bookmark.kind !== 'UNKNOWN' && [
            <FormInput
              key="width"
              property="width"
              model={bookmark}
              onChange={onChange}
              renderLabel={props => <label {...props}>Largeur</label>}
              renderInput={props => (
                <input {...props} type="number" placeholder="1920" disabled={loading} />
              )}
            />,
            <FormInput
              key="height"
              property="height"
              model={bookmark}
              onChange={onChange}
              renderLabel={props => <label {...props}>Hauteur</label>}
              renderInput={props => (
                <input {...props} type="number" placeholder="1080" disabled={loading} />
              )}
            />,
          ]}

        {bookmark.kind === 'VIDEO' && (
          <FormInput
            property="duration"
            model={bookmark}
            onChange={onChange}
            renderLabel={props => <label {...props}>Durée (en seconde)</label>}
            renderInput={props => (
              <input {...props} type="number" placeholder="127" disabled={loading} />
            )}
          />
        )}

        <FormInput
          property="tags"
          renderLabel={props => <label {...props}>Tags</label>}
          renderInput={props => (
            <TagsInput
              inputProps={{
                ...props,
                placeholder: 'Ajouter un tag',
              }}
              value={bookmark.tags || []}
              onChange={this.onChangeTags}
              disabled={loading}
            />
          )}
        />
      </div>
    );
  }
}
