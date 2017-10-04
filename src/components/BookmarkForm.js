import React from 'react';

export const BookmarkForm = ({bookmark, onChange}) => {
  const onChangeValue = ev => {
    const name = ev.target.name;
    let value = ev.target.value;

    if (ev.target.type === 'number' && value) {
      // We only handle integer
      value = parseInt(value, 10);
    }

    onChange({
      ...bookmark,
      [name]: value,
    });
  };

  return (
    <div>
      <div>
        <label htmlFor="title">Titre *</label>
        <input
          type="text"
          id="title"
          name="title"
          value={bookmark.title || ''}
          onChange={onChangeValue}
          required
          style={{boxSizing: 'border-box', width: '100%', padding: 5, fontSize: 18}}
          autoFocus={true}
        />
      </div>

      <div>
        <label htmlFor="author">Auteur</label>
        <input
          type="text"
          id="author"
          name="author"
          value={bookmark.author || ''}
          onChange={onChangeValue}
          style={{boxSizing: 'border-box', width: '100%', padding: 5, fontSize: 18}}
        />
      </div>

      {!!bookmark.kind &&
        bookmark.kind !== 'UNKNOWN' && [
          <div key="width">
            <label htmlFor="width">Largeur</label>
            <input
              type="number"
              id="width"
              name="width"
              value={bookmark.width || ''}
              onChange={onChangeValue}
              style={{boxSizing: 'border-box', width: '100%', padding: 5, fontSize: 18}}
            />
          </div>,
          <div key="height">
            <label htmlFor="height">Hauteur</label>
            <input
              type="number"
              id="height"
              name="height"
              value={bookmark.height || ''}
              onChange={onChangeValue}
              style={{boxSizing: 'border-box', width: '100%', padding: 5, fontSize: 18}}
            />
          </div>,
        ]}

      {bookmark.kind === 'VIDEO' && (
        <div>
          <label htmlFor="duration">Durée (en seconde)</label>
          <input
            type="number"
            id="duration"
            name="duration"
            value={bookmark.duration || ''}
            onChange={onChangeValue}
            style={{boxSizing: 'border-box', width: '100%', padding: 5, fontSize: 18}}
          />
        </div>
      )}
    </div>
  );
};