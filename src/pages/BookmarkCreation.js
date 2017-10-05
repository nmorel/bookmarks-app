import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {gql, graphql, compose} from 'react-apollo';
import {connect} from 'react-redux';
import {BookmarkCard} from '../components/BookmarkCard';
import {loadMetadataFromUrl} from '../services/metadata';
import {BookmarkForm} from '../components/BookmarkForm';
import {BookmarkListQuery} from '../pages/Home';

class BookmarkCreationComponent extends Component {
  state = {
    step: 0,
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

    if (step === 0) {
      return (
        <form onSubmit={this.onSubmit}>
          <h1 style={{margin: '0 0 10px 0'}}>(1) Saisissez ou collez l'url</h1>

          <div>
            <input
              ref={url => (this.url = url)}
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

          <BookmarkForm bookmark={bookmark} onChange={this.onChange} />

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
