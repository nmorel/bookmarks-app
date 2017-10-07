import React, {Component} from 'react';
import {gql, graphql, compose} from 'react-apollo';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {EditIcon, DeleteIcon} from './Icon';
import {Modal} from './Modal';
import {BookmarkListQuery} from '../pages/Home';

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
      <div className="BookmarkCard">
        {this.state.showDelete && (
          <Modal onClose={this.onCancelDelete}>
            <h4>Confirmer la suppression de {bookmark.title} ?</h4>
            <p>La suppression est définitive.</p>
            <div className="ButtonGroup">
              <button
                type="button"
                className="button hollow secondary"
                onClick={this.onCancelDelete}
              >
                Annuler
              </button>
              <button
                type="button"
                className="button alert"
                autoFocus={true}
                onClick={this.onDelete}
              >
                Supprimer
              </button>
            </div>
          </Modal>
        )}

        <div className="BookmarkCard-ImageContainer">
          <a href={bookmark.url} target="_blank" rel="noopener noreferrer">
            <img src={bookmark.thumbnailMedium} alt={bookmark.title} style={{width: '100%'}} />
          </a>
        </div>

        <div className="BookmarkCard-InfosContainer">
          <div className="BookmarkCard-InfosWrapper">
            <div className="BookmarkCard-Infos">
              <h2 className="BookmarkCard-Title">
                <a href={bookmark.url} target="_blank" rel="noopener noreferrer">
                  {bookmark.title}
                </a>
              </h2>

              <div className="BookmarkCard-Author">
                Ajouté le {new Date(bookmark.createdAt).toLocaleDateString()}
                {!!bookmark.author && ` - Auteur : ${bookmark.author}`}
              </div>
              <div className="BookmarkCard-Url">
                <a href={bookmark.url} target="_blank" rel="noopener noreferrer">
                  {bookmark.url}
                </a>
              </div>
            </div>
            <div className="BookmarkCard-Actions">
              <Link to={`/${bookmark.id}/edit`}>
                <EditIcon />
              </Link>
              <button type="button" onClick={this.onShowDelete}>
                <DeleteIcon />
              </button>
            </div>
          </div>

          {!!bookmark.tags &&
            !!bookmark.tags.length && (
              <div className="BookmarkCard-Tags">
                {bookmark.tags.map((tag, index) => (
                  <span key={index} className="BookmarkCard-Tag">
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

export const BookmarkCard = compose(
  connect(({bookmarkListVariables}) => ({bookmarkListVariables})),
  graphql(deleteBookmarkMutation, {
    props({mutate, ownProps: {bookmarkListVariables}}) {
      return {
        deleteBookmark(bookmark) {
          return mutate({
            variables: bookmark,
            refetchQueries: [
              {
                query: BookmarkListQuery,
                variables: bookmarkListVariables,
              },
            ],
          });
        },
      };
    },
  })
)(BookmarkCardComponent);
