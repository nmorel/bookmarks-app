import React from 'react';
import algoliasearch from 'algoliasearch/lite';

const client = algoliasearch('0CB9ZWV3YA', 'a39f27459bf3a27e23ffb0060f62cd9a');

/**
 * HOC that search from Algolia. It tries to mimic the behaviour of Apollo graphql.
 * If there is no query, the search is skipped and nothing is passed to the component.
 * For documentation on Algolia, see {@link https://www.algolia.com/doc/api-client/search/}.
 */
export const algoliaSearch = ({index, options, props: mapStateToProps}) => {
  const algoliaIndex = client.initIndex(index);

  return Component => {
    class AlgoliaSearch extends React.Component {
      state = {
        loading: false,
        hits: [],
        nbHits: 0,
      };

      lastCallback;

      // No need to do it on mount because the query will be empty
      componentWillReceiveProps(nextProps) {
        const prevOptions = options(this.props);
        const nextOptions = options(nextProps);

        if (
          nextOptions.query !== prevOptions.query ||
          nextOptions.offset !== prevOptions.offset ||
          nextOptions.limit !== prevOptions.limit
        ) {
          this.setState(state => ({
            loading: !!nextOptions.query,
            hits: [],
            // we let the previous nbHits so it does not flash
            nbHits: nextOptions.query ? state.nbHits : 0,
          }));

          if (!nextOptions.query) {
            return;
          }

          const callback = (err, content) => {
            if (this.lastCallback !== callback) {
              // An previous callback responded after a new request has been made
              // We just ignore it
              return;
            }

            if (err) {
              console.error(err);
              this.setState({
                loading: false,
                hits: [],
                nbHits: 0,
              });
            } else {
              this.setState({
                loading: false,
                hits: content.hits,
                nbHits: content.nbHits,
              });
            }
          };
          this.lastCallback = callback;

          algoliaIndex.search(
            {
              query: nextOptions.query,
              offset: nextOptions.offset,
              length: nextOptions.limit,
              attributesToRetrieve: '*',
            },
            callback
          );
        }
      }

      render() {
        let props = this.props;
        if (options(this.props).query) {
          props = {
            ...props,
            ...mapStateToProps({search: this.state}),
          };
        }
        return <Component {...props} />;
      }
    }

    return AlgoliaSearch;
  };
};
