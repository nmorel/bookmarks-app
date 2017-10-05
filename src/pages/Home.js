import React from 'react';
import {gql, graphql, compose} from 'react-apollo';
import {Link} from 'react-router-dom';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {goToPage} from '../ducks/bookmarkListVariables';
import {BookmarkCard} from '../components/BookmarkCard';
import {Pagination} from '../components/Pagination';

export function Home() {
  return (
    <div>
      <div style={{textAlign: 'right'}}>
        <Link to={`/add`}>Ajouter un lien</Link>
      </div>
      <List />
    </div>
  );
}

const ListComponent = ({
  loading,
  bookmarks = [],
  bookmarkListVariables: {offset, limit},
  total,
  goToPage,
}) => {
  const pagination = <Pagination offset={offset} limit={limit} total={total} goToPage={goToPage} />;
  return (
    <div>
      {pagination}
      {bookmarks.length ? (
        <ul style={{listStyle: 'none', margin: 0, padding: 0}}>
          {bookmarks.map((bookmark, index) => (
            <li
              key={bookmark.id}
              style={index > 0 ? {marginTop: 10, paddingTop: 10, borderTop: '1px solid grey'} : {}}
            >
              <BookmarkCard bookmark={bookmark} />
            </li>
          ))}
        </ul>
      ) : loading ? (
        <div>Chargement...</div>
      ) : null}
      {pagination}
    </div>
  );
};

export const BookmarkListQuery = gql`
  query allBookmarks($offset: Int, $limit: Int) {
    bookmarksCount: _allBookmarksMeta {
      count
    }
    bookmarks:  allBookmarks(
      first: $limit
      skip: $offset
      orderBy: createdAt_DESC
    ) {
      ...BookmarkCard
    }
  }
  
  ${BookmarkCard.fragments.bookmark}
`;

const List = compose(
  connect(
    ({bookmarkListVariables}) => ({bookmarkListVariables}),
    dispatch => bindActionCreators({goToPage}, dispatch)
  ),
  graphql(BookmarkListQuery, {
    options({bookmarkListVariables}) {
      return {
        variables: bookmarkListVariables,
        fetchPolicy: 'network-only',
      };
    },
    props({data}) {
      const {loading, bookmarks = [], bookmarksCount = {count: 0}} = data;
      return {
        bookmarks,
        loading,
        total: bookmarksCount.count,
      };
    },
  })
)(ListComponent);
