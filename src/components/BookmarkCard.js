import React from 'react';

export function BookmarkCard({bookmark, onEdit, onDelete}) {
  return (
    <div style={{display: 'flex', justifyContent: 'space-between'}}>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', width: '30%'}}>
        <a href={bookmark.url} target="_blank" rel="noopener noreferrer">
          <img src={bookmark.thumbnailMedium} alt={bookmark.title} style={{width: '100%'}} />
        </a>
      </div>
      <div style={{width: '68%'}}>
        <h1 style={{margin: '0 0 5px 0'}}>{bookmark.title}</h1>
        <a href={bookmark.url} target="_blank" rel="noopener noreferrer">
          <h4
            style={{margin: 0, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis'}}
          >
            {bookmark.url}
          </h4>
        </a>
        {!!bookmark.tags &&
          !!bookmark.tags.length && (
            <div style={{marginTop: 5}}>
              {bookmark.tags.map((tag, index) => (
                <span
                  key={index}
                  style={{
                    display: 'inline-block',
                    padding: 5,
                    marginRight: 5,
                    marginBottom: 5,
                    backgroundColor: 'lightgrey',
                    borderRadius: 4,
                    fontSize: 12,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
      </div>
    </div>
  );
}
