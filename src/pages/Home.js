import React from 'react';
import {gql, graphql, compose} from 'react-apollo';
import {Link} from 'react-router-dom';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {goToPage} from '../ducks/bookmarkListVariables';
import {BookmarkCard} from '../components/BookmarkCard';
import {Pagination} from '../components/Pagination';
import {AddIcon} from '../components/Icon';

/**
 * Home page with the paginated bookmark's list.
 */
export function Home() {
  return (
    <div className="Home">
      <Link
        className="Home-AddButton"
        to={`/add`}
        title="Ajouter un favori"
        aria-label="Ajouter un favori"
      >
        <AddIcon />
      </Link>
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
      <ul className="Home-List">
        {loading
          ? [...Array(limit).keys()].map(index => (
              <li key={index} className="Home-List-Item">
                <BookmarkCard stub />
              </li>
            ))
          : bookmarks.map((bookmark, index) => (
              <li key={bookmark.id} className="Home-List-Item">
                <BookmarkCard bookmark={bookmark} stub={false} />
              </li>
            ))}
      </ul>
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
  // The pagination options are stored in redux
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
