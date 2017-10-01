import React, {Component} from 'react';
import {gql, graphql} from 'react-apollo';

export class HomeComponent extends Component {
  render() {
    const {data: {loading, allBookmarks}} = this.props;
    if (loading) {
      return null;
    }
    return (
      <div>
        <ul>{allBookmarks.map(bookmark => <li key={bookmark.id}>{bookmark.url}</li>)}</ul>
      </div>
    );
  }
}

const BookmarkQuery = gql`
  query allPosts {
    allBookmarks(orderBy: id_ASC) {
      id
      url
    }
  }
`;

export const Home = graphql(BookmarkQuery, {
  options: {
    fetchPolicy: 'network-only',
  },
})(HomeComponent);
