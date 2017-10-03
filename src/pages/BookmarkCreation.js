import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {gql, graphql} from 'react-apollo';
import {loadMetadataFromUrl} from '../services/metadata';

class BookmarkCreationComponent extends Component {
  state = {
    step: 0,
    bookmark: {kind: 'UNKNOWN'},
    loading: false,
    error: null,
  };

  onSubmit = async ev => {
    ev.preventDefault();

    this.setState({
      loading: true,
      error: null,
    });

    if (this.state.step === 0) {
      if (this.state.error) {
        this.setState({step: 1, loading: false});
        return;
      }

      try {
        const bookmark = await loadMetadataFromUrl(this.state.bookmark.url);
        this.setState({
          step: 1,
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
        await this.props.addBookmark({variables: this.state.bookmark});
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

  render() {
    const {step, bookmark, loading, error} = this.state;

    if (step === 0) {
      return (
        <form onSubmit={this.onSubmit}>
          <h1 style={{margin: '0 0 10px 0'}}>(1) Saisissez ou collez l'url</h1>

          <div>
            <input
              type="url"
              id="url"
              name="url"
              value={bookmark.url || ''}
              onChange={this.onChangeValue}
              required
              style={{boxSizing: 'border-box', width: '100%', padding: 5, fontSize: 18}}
              autoFocus={true}
            />
          </div>

          {!!error && (
            <p style={{color: 'red'}}>
              Une erreur est survenue durant la récupération des informations.
              <br />
              Vérifiez votre url ou poursuivez pour saisir les informations manuellement.
            </p>
          )}

          <div style={{marginTop: 10, textAlign: 'right'}}>
            <Link to={`/`}>Annuler</Link>
            <button type="submit" disabled={loading}>
              {error ? `Saisir les infos manuellement` : `Valider`}
            </button>
          </div>
        </form>
      );
    } else {
      return (
        <form onSubmit={this.onSubmit}>
          <h1 style={{margin: '0 0 10px 0'}}>(2) Vérifiez les informations</h1>

          {!!error && (
            <p style={{color: 'red'}}>
              Une erreur est survenue durant la sauvegarde.
              <br />
              {error.message}
            </p>
          )}

          <div>
            <label htmlFor="title">Titre *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={bookmark.title || ''}
              onChange={this.onChangeValue}
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
              onChange={this.onChangeValue}
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
                  onChange={this.onChangeValue}
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
                  onChange={this.onChangeValue}
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
                onChange={this.onChangeValue}
                style={{boxSizing: 'border-box', width: '100%', padding: 5, fontSize: 18}}
              />
            </div>
          )}

          <div style={{marginTop: 10, textAlign: 'right'}}>
            <Link to={`/`}>Annuler</Link>
            <button type="submit" disabled={loading}>
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
      id
    }
  }
`;

export const BookmarkCreation = graphql(addBookmarkMutation, {name: 'addBookmark'})(
  BookmarkCreationComponent
);
