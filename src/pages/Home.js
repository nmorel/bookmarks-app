import React, {Component} from 'react';
import {gql, graphql} from 'react-apollo';
import {Link} from 'react-router-dom';
import {BookmarkCard} from '../components/BookmarkCard';

export class HomeComponent extends Component {
  componentWillReceiveProps(nextProps) {
    if (
      this.props.location.key !== nextProps.location.key &&
      nextProps.location.pathname === nextProps.match.path
    ) {
      // The key changed so a modal has been opened or closed and the next location match this component path.
      // It means a modal has been closed. We refetch the bookmarks in case a modification has been made.
      this.props.data.refetch();
    }
  }

  render() {
    const {data: {loading, allBookmarks}} = this.props;

    return (
      <div>
        <div style={{textAlign: 'right'}}>
          <Link to={`/add`}>Ajouter un lien</Link>
        </div>
        {!loading && (
          <ul style={{listStyle: 'none', margin: 0, padding: 0}}>
            {allBookmarks.map((bookmark, index) => (
              <li
                key={bookmark.id}
                style={
                  index > 0 ? {marginTop: 10, paddingTop: 10, borderTop: '1px solid grey'} : {}
                }
              >
                <BookmarkCard bookmark={bookmark} />
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
}

const BookmarkQuery = gql`
  query allPosts {
    allBookmarks(orderBy: createdAt_DESC) {
      id
      url
      title
      thumbnailMedium
      tags
    }
  }
`;

export const Home = graphql(BookmarkQuery, {
  options: {
    fetchPolicy: 'network-only',
  },
})(HomeComponent);
