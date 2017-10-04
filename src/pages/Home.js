import React, {Component} from 'react';
import {gql, graphql} from 'react-apollo';
import {Link} from 'react-router-dom';
import {BookmarkCard} from '../components/BookmarkCard';

const limit = 10;

export class Home extends Component {
  state = {
    // The list is sorted by creation date. If we request more items while an item has been added
    // we may have an item twice
    maxCreatedAt: new Date(),
  };

  componentWillReceiveProps(nextProps) {
    if (
      this.props.location.key !== nextProps.location.key &&
      nextProps.location.pathname === nextProps.match.path
    ) {
      // We come back to this page after a modal has been closed
      // We refresh the page
      this.setState({
        maxCreatedAt: new Date(),
      });
    }
  }

  render() {
    return (
      <div>
        <div style={{textAlign: 'right'}}>
          <Link to={`/add`}>Ajouter un lien</Link>
        </div>
        <List maxCreatedAt={this.state.maxCreatedAt} />
      </div>
    );
  }
}

const ListComponent = ({data: {loading, allBookmarks = [], loadMoreEntries, hasMore}}) => {
  if (!allBookmarks.length) {
    return null;
  }

  return (
    <div>
      <ul style={{listStyle: 'none', margin: 0, padding: 0}}>
        {allBookmarks.map((bookmark, index) => (
          <li
            key={bookmark.id}
            style={index > 0 ? {marginTop: 10, paddingTop: 10, borderTop: '1px solid grey'} : {}}
          >
            <BookmarkCard bookmark={bookmark} />
          </li>
        ))}
      </ul>
      {hasMore && (
        <button type="button" onClick={loadMoreEntries}>
          Voir plus
        </button>
      )}
    </div>
  );
};

const BookmarkQuery = gql`
  query allPosts($offset: Int, $limit: Int, $maxCreatedAt: DateTime) {
    _allBookmarksMeta(filter: {createdAt_lte: $maxCreatedAt}) {
      count
    }
    allBookmarks(
      first: $limit
      skip: $offset
      orderBy: createdAt_DESC
      filter: {createdAt_lte: $maxCreatedAt}
    ) {
      id
      url
      title
      thumbnailMedium
      tags
    }
  }
`;

const List = graphql(BookmarkQuery, {
  options({maxCreatedAt}) {
    return {
      variables: {
        offset: 0,
        limit,
        maxCreatedAt,
      },
      fetchPolicy: 'network-only',
    };
  },
  props({data}) {
    const {allBookmarks = [], _allBookmarksMeta = {count: 0}} = data;
    return {
      data: {
        ...data,
        hasMore:
          allBookmarks.length <=
          _allBookmarksMeta.count -
            (_allBookmarksMeta.count % limit ? _allBookmarksMeta.count % limit : limit),
        loadMoreEntries() {
          return data.fetchMore({
            variables: {
              offset: allBookmarks.length,
              limit,
            },
            updateQuery: (previousResult, {fetchMoreResult}) => {
              if (!fetchMoreResult) {
                return previousResult;
              }
              return {
                ...previousResult,
                // Append the new bookmarks to the old ones
                allBookmarks: [...previousResult.allBookmarks, ...fetchMoreResult.allBookmarks],
              };
            },
          });
        },
      },
    };
  },
})(ListComponent);
