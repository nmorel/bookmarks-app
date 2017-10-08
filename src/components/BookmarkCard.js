import React, {Component} from 'react';
import {gql, graphql, compose} from 'react-apollo';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {search} from '../ducks/bookmarkListVariables';
import {Link} from 'react-router-dom';
import {EditIcon, DeleteIcon} from './Icon';
import {Modal} from './Modal';
import {BookmarkListQuery} from '../pages/Home';
import {Image} from './Image';
import {formatDuration} from '../services/format';
import cn from 'classnames';

/**
 * If the bookmark come from search, we map the highlight results to react component
 */
const mapHighlightResults = bookmark => {
  if (!bookmark._highlightResult) {
    return bookmark;
  }

  const mapHighlight = highlight => {
    if (highlight) {
      if (highlight.value && highlight.matchedWords && highlight.matchedWords.length) {
        return <span dangerouslySetInnerHTML={{__html: highlight.value}} />;
      } else {
        return highlight.value;
      }
    }
  };

  const highlight = bookmark._highlightResult;
  const result = {
    title: mapHighlight(highlight.title) || bookmark.title,
    author: mapHighlight(highlight.author) || bookmark.author,
  };
  const tags = (highlight.tags || []).map(mapHighlight).filter(tag => !!tag);
  result.tags = tags.length ? tags : bookmark.tags;
  return result;
};

/**
 * Component that shows a bookmark informations in a "card" (mainly used inside list)
 */
class BookmarkCardComponent extends Component {
  state = {
    showDelete: false,
    deleteError: null,
  };

  onShowDelete = () => this.setState({showDelete: true, deleteError: null});
  onCancelDelete = () => this.setState({showDelete: false, deleteError: null});
  onDelete = () =>
    this.props.deleteBookmark(this.props.bookmark).catch(err => {
      console.error('An error occured on deletion', err);
      this.setState({deleteError: err});
    });

  render() {
    let {bookmark, stub} = this.props;
    if (stub) {
      bookmark = {};
    }

    const highlightResult = mapHighlightResults(bookmark);

    return (
      <div className={cn('BookmarkCard', {stub})} aria-hidden={!!stub}>
        {this.state.showDelete && (
          <Modal onClose={this.onCancelDelete}>
            <h4>Confirmer la suppression de {bookmark.title} ?</h4>
            <p>La suppression est définitive.</p>
            {!!this.state.deleteError && (
              <p className="error">
                Une erreur est survenue durant la récupération des informations.
                <br />
                {this.state.deleteError.message}
              </p>
            )}
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
                    {highlightResult.title}
                  </a>
                ) : (
                  highlightResult.title
                )}
              </h2>

              <div className="BookmarkCard-Author">
                {!!bookmark.createdAt &&
                  `Ajouté le ${new Date(bookmark.createdAt).toLocaleDateString()}`}
                {!!highlightResult.author && (
                  <span>
                    {' - '}
                    {highlightResult.author}
                  </span>
                )}
                {!!bookmark.width && !!bookmark.height && ` - ${bookmark.width}x${bookmark.height}`}
                {!!bookmark.duration && ` - ${formatDuration(bookmark.duration)}`}
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

          {!!highlightResult.tags &&
            !!highlightResult.tags.length && (
              <div className="BookmarkCard-Tags">
                {highlightResult.tags.map((tag, index) => (
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

const fragments = {
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
      updatedAt
    }
  `,
};

const getBookmark = gql`
  query getBookmark($id: ID!) {
    bookmark: Bookmark(id: $id) {
      ...BookmarkCard
    }
  }

  ${fragments.bookmark}
`;

const deleteBookmarkMutation = gql`
  mutation deleteBookmark($id: ID!) {
    deleteBookmark(id: $id) {
      id
    }
  }
`;

export const BookmarkCard = compose(
  graphql(getBookmark, {
    // If it's a stub or we already got the bookmark from Apollo, we skip the request
    // If the bookmark has an objectID, it came from Algolia
    // Even if Algolia gave us all the data, we still retrieve the bookmark from GraphQL
    // to put it in cache and update the view automatically when we edit it
    skip: props => props.stub || !props.bookmark || !props.bookmark.objectID,
    options({bookmark}) {
      return {variables: {id: bookmark && bookmark.id}};
    },
    props({data, ownProps}) {
      if (!data.bookmark) {
        // The bookmark is not loaded
        return {
          bookmark: ownProps.bookmark,
        };
      }

      // If the updatedAt does not match, it means the bookmark has been edited
      // We return the bookmark from GraphQL to get the real values
      // We lose highlight but it's not a big issue
      if (
        !ownProps.bookmark ||
        !ownProps.bookmark.objectID ||
        ownProps.bookmark.updatedAt !== data.bookmark.updatedAt
      ) {
        return {
          bookmark: data.bookmark,
        };
      }

      // The date match, we merge the bookmark from GraphQL with the one from search
      return {
        bookmark: {
          ...data.bookmark,
          _highlightResult: ownProps.bookmark && ownProps.bookmark._highlightResult,
        },
      };
    },
  }),
  connect(
    ({bookmarkListVariables}) => ({bookmarkListVariables}),
    dispatch => bindActionCreators({search}, dispatch)
  ),
  graphql(deleteBookmarkMutation, {
    props({mutate, ownProps: {bookmarkListVariables, search}}) {
      return {
        deleteBookmark(bookmark) {
          if (bookmarkListVariables.query) {
            // We reset the query after the mutation
            return mutate({
              variables: bookmark,
            }).then(() => search(''));
          } else {
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
          }
        },
      };
    },
  })
)(BookmarkCardComponent);
BookmarkCard.fragments = fragments;
