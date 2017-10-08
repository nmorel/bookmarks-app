## Description
This application is a [React](https://reactjs.org/) frontend bootstrapped with [create-react-app](https://github.com/facebookincubator/create-react-app).
The bookmarks are stored on [Graphcool](https://www.graph.cool/), a GraphQL server.
It uses [Apollo](https://www.apollodata.com/) as GraphQL client.

The application is hosted on [Firebase](https://firebase.google.com/) and available at [bookmarks.morel.pro](https://bookmarks.morel.pro/).

## Bookmark GraphQL Schema
```graphql
type Bookmark implements Node {
  author: String
  createdAt: DateTime!
  duration: Int
  height: Int! @defaultValue(value: 0)
  id: ID! @isUnique
  kind: BookmarkKind! @defaultValue(value: UNKNOWN)
  tags: [String!]
  thumbnailLarge: String
  thumbnailMedium: String
  thumbnailSmall: String
  title: String!
  updatedAt: DateTime!
  url: String! @isUnique
  width: Int! @defaultValue(value: 0)
}
```

## How to run locally
```bash
yarn install
yarn start
```
or
```bash
npm install
npm start
```
and open [http://localhost:3000](http://localhost:3000).

## Deployment
```bash
yarn run deploy
```
or
```bash
npm run deploy
```

