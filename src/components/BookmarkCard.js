import React, {Component} from 'react';
import {gql, graphql, compose} from 'react-apollo';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {EditIcon, DeleteIcon} from './Icon';
import {Modal} from './Modal';
import {BookmarkListQuery} from '../pages/Home';
import {Image} from './Image';
import {formatDuration} from '../services/format';
import cn from 'classnames';

/**
 * Component that shows a bookmark informations in a "card" (mainly used inside list)
 */
class BookmarkCardComponent extends Component {
  static fragments = {
    bookmark: gql`
      fragment BookmarkCard on Bookmark {
        id
        kind
        url
        title
        author
        width
        height
        duration
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
    let {bookmark, stub} = this.props;
    if (stub) {
      bookmark = {};
    }

    return (
      <div className={cn('BookmarkCard', {stub})} aria-hidden={!!stub}>
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

        <div className={cn('BookmarkCard-ImageContainer', {noimage: !bookmark.thumbnailMedium})}>
          <a href={bookmark.url} target="_blank" rel="noopener noreferrer">
            <Image src={bookmark.thumbnailMedium} alt={bookmark.title} />
          </a>
        </div>

        <div className="BookmarkCard-InfosContainer">
          <div className="BookmarkCard-InfosWrapper">
            <div className="BookmarkCard-Infos">
              <h2 className="BookmarkCard-Title">
                {bookmark.url ? (
                  <a href={bookmark.url} target="_blank" rel="noopener noreferrer">
                    {bookmark.title}
                  </a>
                ) : (
                  bookmark.title
                )}
              </h2>

              <div className="BookmarkCard-Author">
                {!!bookmark.createdAt &&
                  `Ajouté le ${new Date(bookmark.createdAt).toLocaleDateString()}`}
                {!!bookmark.author && ` - ${bookmark.author}`}
                {bookmark.width && bookmark.height && ` - ${bookmark.width}x${bookmark.height}`}
                {bookmark.duration && ` - ${formatDuration(bookmark.duration)}`}
              </div>
              <div className="BookmarkCard-Url">
                <a href={bookmark.url} target="_blank" rel="noopener noreferrer">
                  {bookmark.url}
                </a>
              </div>
            </div>
            {!stub && (
              <div className="BookmarkCard-Actions">
                <Link
                  to={`/${bookmark.id}/edit`}
                  title="Éditer"
                  aria-label={`Éditer le favori ${bookmark.title}`}
                >
                  <EditIcon />
                </Link>
                <button
                  type="button"
                  onClick={this.onShowDelete}
                  title="Supprimer"
                  aria-label={`Supprimer le favori ${bookmark.title}`}
                >
                  <DeleteIcon />
                </button>
              </div>
            )}
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
            // We update the home page list
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
