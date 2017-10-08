import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {gql, graphql, compose} from 'react-apollo';
import {BookmarkCard} from '../components/BookmarkCard';
import {BookmarkForm} from '../components/BookmarkForm';

/**
 * Edition of a bookmark
 */
class BookmarkEditionComponent extends Component {
  state = {
    bookmark: {},
    loading: false,
    error: null,
  };

  componentWillMount() {
    // When the bookmark is loaded, we update the state with it
    if (!this.props.loading) {
      this.setState({
        bookmark: {
          ...this.props.bookmark,
        },
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    // When the bookmark is loaded, we update the state with it
    if (this.props.loading && !nextProps.loading) {
      this.setState({
        bookmark: {
          ...nextProps.bookmark,
        },
      });
    }
  }

  onChange = bookmark => {
    this.setState({
      bookmark,
      error: null,
    });
  };

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

  render() {
    const loading = this.props.loading || this.state.loading;
    const {bookmark, error} = this.state;

    return (
      <form onSubmit={this.onSubmit}>
        <BookmarkForm loading={loading} bookmark={bookmark} onChange={this.onChange} />
        <div className="ButtonGroup">
          <Link className="button hollow secondary" to={`/`}>
            Annuler
          </Link>
          <button type="submit" className="button" disabled={loading || !!error}>
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
      url
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
    // The modifications are stored automatically in Apollo store.
    // No need to refresh the home page list
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
