import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {gql, graphql, compose} from 'react-apollo';
import {BookmarkCard} from '../components/BookmarkCard';
import {BookmarkForm} from '../components/BookmarkForm';

class BookmarkEditionComponent extends Component {
  state = {
    bookmark: null,
    loading: false,
    error: null,
  };

  componentWillMount() {
    if (!this.props.loading) {
      this.setState({
        bookmark: {
          ...this.props.bookmark,
        },
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.loading && !nextProps.loading) {
      this.setState({
        bookmark: {
          ...nextProps.bookmark,
        },
      });
    }
  }

  onSubmit = async ev => {
    ev.preventDefault();

    this.setState({
      loading: true,
      error: null,
    });

    try {
      await this.props.updateBookmark(this.state.bookmark);
      this.props.history.push('/');
    } catch (err) {
      this.setState({
        loading: false,
        error: err,
      });
    }
  };

  onChange = bookmark => {
    this.setState({
      bookmark,
      error: null,
    });
  };

  render() {
    if (this.props.loading) {
      return null;
    }

    const {bookmark, loading, error} = this.state;

    return (
      <form onSubmit={this.onSubmit}>
        <BookmarkForm bookmark={bookmark} onChange={this.onChange} />

        <div style={{marginTop: 10, textAlign: 'right'}}>
          <Link to={`/`}>Annuler</Link>
          <button type="submit" disabled={loading || !!error}>
            Modifier
          </button>
        </div>
      </form>
    );
  }
}

const getBookmark = gql`
  query getBookmark($id: ID!) {
    bookmark: Bookmark(id: $id) {
      id
      kind
      title
      author
      width
      height
      duration
      tags
    }
  }
`;

const editBookmarkMutation = gql`
  mutation updateBookmark(
    $id: ID!
    $title: String!
    $author: String
    $width: Int
    $height: Int
    $duration: Int
    $tags: [String!]
  ) {
    updateBookmark(
      id: $id
      title: $title
      author: $author
      width: $width
      height: $height
      duration: $duration
      tags: $tags
    ) {
      ...BookmarkCard
    }
  }
  
  ${BookmarkCard.fragments.bookmark}
`;

export const BookmarkEdition = compose(
  graphql(getBookmark, {
    options({match: {params}}) {
      return {variables: {id: params.id}};
    },
    props({data}) {
      return {
        loading: data.loading,
        bookmark: data.bookmark,
      };
    },
  }),
  graphql(editBookmarkMutation, {
    props({mutate}) {
      return {
        updateBookmark(bookmark) {
          return mutate({
            variables: bookmark,
          });
        },
      };
    },
  })
)(BookmarkEditionComponent);
