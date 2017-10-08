import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {gql, graphql, compose} from 'react-apollo';
import {connect} from 'react-redux';
import {BookmarkCard} from '../components/BookmarkCard';
import {loadMetadataFromUrl} from '../services/metadata';
import {BookmarkForm} from '../components/BookmarkForm';
import {BookmarkListQuery} from '../pages/Home';
import {FormInput} from '../components/FormInput';

const stepUrl = 1;
const stepInfos = 2;

/**
 * Page used to create a new bookmark
 */
class BookmarkCreationComponent extends Component {
  state = {
    step: stepUrl,
    bookmark: {kind: 'UNKNOWN'},
    loading: false,
    error: null,
  };

  componentDidMount() {
    // The autoFocus does not work. Maybe a problem with portal ?
    setTimeout(() => {
      this.url.focus();
    });
  }

  onChange = bookmark => {
    this.setState({
      bookmark,
      error: null,
    });
  };

  /**
   * Submit the first step with the url.
   * The url is parsed in order to fetch its metadata if possible.
   */
  onSubmitUrl = async ev => {
    ev.preventDefault();

    this.setState({
      loading: true,
      error: null,
    });

    if (this.state.error) {
      this.setState({step: stepInfos, loading: false});
      return;
    }

    try {
      const bookmark = await loadMetadataFromUrl(this.state.bookmark.url);
      this.setState({
        step: stepInfos,
        bookmark,
        loading: false,
      });
    } catch (err) {
      this.setState({
        loading: false,
        error: err,
      });
    }
  };

  /**
   * Submit the final step with the full bookmark
   */
  onSubmitInfos = async ev => {
    ev.preventDefault();

    this.setState({
      loading: true,
      error: null,
    });

    try {
      await this.props.addBookmark(this.state.bookmark);
      this.props.history.push('/');
    } catch (err) {
      console.error('An error occured on creation', err);
      this.setState({
        loading: false,
        error: err,
      });
    }
  };

  render() {
    const {step, bookmark, loading, error} = this.state;

    if (step === stepUrl) {
      // First step
      // The form contains a single input for the url.
      return (
        <form onSubmit={this.onSubmitUrl}>
          <h3>Saisissez ou collez le lien</h3>

          <FormInput
            property="url"
            model={bookmark}
            onChange={this.onChange}
            renderInput={props => (
              <input
                {...props}
                ref={url => (this.url = url)}
                type="url"
                placeholder="https://vimeo.com/20853149"
                required
                autoFocus={true}
              />
            )}
            renderHelpText={props => (
              <p {...props}>
                Si vous saisissez un lien <a href="https://vimeo.com/">Vimeo</a> ou{' '}
                <a href="https://www.flickr.com/">Flickr</a>, les données associées (titre, image,
                auteur, etc...) seront automatiquement récupérées.
                <br />
                Exemple : https://vimeo.com/20853149
              </p>
            )}
          />

          {!!error && (
            <p className="error">
              Une erreur est survenue durant la récupération des informations.
              <br />
              Vérifiez votre url ou poursuivez pour saisir les informations manuellement.
            </p>
          )}

          <div className="ButtonGroup">
            <Link className="button hollow secondary" to={`/`}>
              Annuler
            </Link>
            <button type="submit" className="button" disabled={loading}>
              {error ? `Saisir les infos manuellement` : `Valider`}
            </button>
          </div>
        </form>
      );
    } else {
      // Second and final step
      // The form has all the editable fields of a bookmark
      return (
        <form onSubmit={this.onSubmitInfos}>
          <h3>
            {bookmark.service
              ? `Vérifiez les informations obtenues de ${bookmark.service}`
              : `Saisissez les informations du lien`}
          </h3>
          {bookmark.service ? (
            <p>Les informations suivantes ont été obtenues de {bookmark.service}.</p>
          ) : (
            <p>Aucune information n'a pu être extraite du lien.</p>
          )}

          <BookmarkForm bookmark={bookmark} onChange={this.onChange} />

          {!!error && (
            <p className="error">
              Une erreur est survenue durant la sauvegarde.
              <br />
              {error.message}
            </p>
          )}

          <div className="ButtonGroup">
            <button
              type="button"
              className="button hollow left"
              onClick={() => this.setState({step: stepUrl})}
            >
              &larr; Revenir
            </button>
            <Link className="button hollow secondary" to={`/`}>
              Annuler
            </Link>
            <button type="submit" className="button" disabled={loading}>
              {error ? `Saisir les infos manuellement` : `Ajouter`}
            </button>
          </div>
        </form>
      );
    }
  }
}

const addBookmarkMutation = gql`
  mutation addBookmark(
    $kind: BookmarkKind!
    $url: String!
    $title: String!
    $author: String
    $width: Int
    $height: Int
    $duration: Int
    $tags: [String!]
    $thumbnailSmall: String
    $thumbnailMedium: String
    $thumbnailLarge: String
  ) {
    createBookmark(
      kind: $kind
      url: $url
      title: $title
      author: $author
      width: $width
      height: $height
      duration: $duration
      tags: $tags
      thumbnailSmall: $thumbnailSmall
      thumbnailMedium: $thumbnailMedium
      thumbnailLarge: $thumbnailLarge
    ) {
      ...BookmarkCard
    }
  }

  ${BookmarkCard.fragments.bookmark}
`;

export const BookmarkCreation = compose(
  connect(({bookmarkListVariables}) => ({bookmarkListVariables})),
  graphql(addBookmarkMutation, {
    props({mutate, ownProps: {bookmarkListVariables}}) {
      return {
        addBookmark(bookmark) {
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
)(BookmarkCreationComponent);
