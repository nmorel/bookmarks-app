import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {gql, graphql, compose} from 'react-apollo';
import {connect} from 'react-redux';
import {BookmarkCard} from '../components/BookmarkCard';
import {loadMetadataFromUrl} from '../services/metadata';
import {BookmarkForm} from '../components/BookmarkForm';
import {BookmarkListQuery} from '../pages/Home';

const stepUrl = 1;
const stepInfos = 2;

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

  onSubmit = async ev => {
    ev.preventDefault();

    this.setState({
      loading: true,
      error: null,
    });

    if (this.state.step === stepUrl) {
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
    } else {
      try {
        await this.props.addBookmark(this.state.bookmark);
        this.props.history.push('/');
      } catch (err) {
        this.setState({
          loading: false,
          error: err,
        });
      }
    }
  };

  onChangeValue = ev => {
    const name = ev.target.name;
    let value = ev.target.value;

    if (ev.target.type === 'number' && value) {
      // We only handle integer
      value = parseInt(value, 10);
    }

    this.setState(state => ({
      bookmark: {
        ...state.bookmark,
        [name]: value,
      },
      error: null,
    }));
  };

  onChange = bookmark => {
    this.setState({
      bookmark,
      error: null,
    });
  };

  render() {
    const {step, bookmark, loading, error} = this.state;

    if (step === stepUrl) {
      return (
        <form onSubmit={this.onSubmit}>
          <h3>Saisissez ou collez le lien</h3>

          <div>
            <label>
              <input
                ref={url => (this.url = url)}
                type="url"
                id="url"
                name="url"
                value={bookmark.url || ''}
                onChange={this.onChangeValue}
                required
                autoFocus={true}
                aria-describedby="urlHelpText"
                placeholder="https://vimeo.com/20853149"
              />
            </label>
            <p className="help-text" id="urlHelpText">
              Si vous saisissez un lien <a href="https://vimeo.com/">Vimeo</a> ou{' '}
              <a href="https://www.flickr.com/">Flickr</a>, les données associées (titre, image,
              auteur, etc...) seront automatiquement récupérées.
              <br />
              Exemple : https://vimeo.com/20853149
            </p>
          </div>

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
      return (
        <form onSubmit={this.onSubmit}>
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

          {!!error && (
            <p className="error">
              Une erreur est survenue durant la sauvegarde.
              <br />
              {error.message}
            </p>
          )}

          <BookmarkForm bookmark={bookmark} onChange={this.onChange} />

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
