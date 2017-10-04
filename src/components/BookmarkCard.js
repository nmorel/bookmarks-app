import React, {Component} from 'react';
import {gql, graphql} from 'react-apollo';
import {Link} from 'react-router-dom';
import {EditIcon, DeleteIcon} from './Icon';
import {Modal} from './Modal';

class BookmarkCardComponent extends Component {
  static fragments = {
    bookmark: gql`
      fragment BookmarkCard on Bookmark {
        id
        url
        title
        author
        thumbnailMedium
        tags
        createdAt
      }
    `,
  };

  state = {
    showDelete: false,
  };

  onShowDelete = () => this.setState({showDelete: true});
  onCancelDelete = () => this.setState({showDelete: false});
  onDelete = () => this.props.deleteBookmark(this.props.bookmark);

  render() {
    const {bookmark} = this.props;
    return (
      <div style={{display: 'flex', justifyContent: 'space-between'}}>
        {this.state.showDelete && (
          <Modal onClose={this.onCancelDelete}>
            <p>Confirmer la suppression de {bookmark.title} ?</p>
            <div style={{marginTop: 10, textAlign: 'right'}}>
              <button type="button" onClick={this.onCancelDelete}>
                Annuler
              </button>
              <button
                type="button"
                autoFocus={true}
                style={{backgroundColor: 'red'}}
                onClick={this.onDelete}
              >
                Supprimer
              </button>
            </div>
          </Modal>
        )}

        <div
          style={{display: 'flex', alignItems: 'center', justifyContent: 'center', width: '30%'}}
        >
          <a href={bookmark.url} target="_blank" rel="noopener noreferrer">
            <img src={bookmark.thumbnailMedium} alt={bookmark.title} style={{width: '100%'}} />
          </a>
        </div>
        <div
          style={{
            width: '68%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{color: 'inherit', textDecoration: 'none', overflow: 'hidden'}}
            >
              <h1 style={{margin: '0 0 5px 0'}}>{bookmark.title}</h1>
              <div style={{fontSize: 14, color: '#AEAEAE'}}>
                Ajouté le {new Date(bookmark.createdAt).toLocaleDateString()}
                {!!bookmark.author && ` - Auteur : ${bookmark.author}`}
              </div>
              <div
                style={{
                  margin: 0,
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  fontStyle: 'italic',
                }}
              >
                {bookmark.url}
              </div>
            </a>
            <div>
              <Link to={`/${bookmark.id}/edit`} style={{display: 'block'}}>
                <EditIcon />
              </Link>
              <div style={{cursor: 'pointer'}} onClick={this.onShowDelete}>
                <DeleteIcon />
              </div>
            </div>
          </div>
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
}

const deleteBookmarkMutation = gql`
  mutation deleteBookmark($id: ID!) {
    deleteBookmark(id: $id) {
      id
    }
  }
`;

export const BookmarkCard = graphql(deleteBookmarkMutation, {
  props({mutate}) {
    return {
      deleteBookmark(bookmark) {
        return mutate({
          variables: bookmark,
        });
      },
    };
  },
})(BookmarkCardComponent);
