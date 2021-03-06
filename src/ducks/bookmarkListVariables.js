// This duck is used to handle filter and pagination on bookmark list
// They are stored in redux because we need them to get the graphql query from Apollo cache
// and to be able to refetch/update it.
// http://dev.apollodata.com/react/api-mutations.html#graphql-mutation-options-refetchQueries

const defaultState = {
  offset: 0,
  limit: 10,
  query: '',
};

const GO_TO_PAGE = 'bookmarkListVariables/GO_TO_PAGE';
const SEARCH = 'bookmarkListVariables/SEARCH';

export function goToPage(page) {
  return {
    type: GO_TO_PAGE,
    payload: {
      page,
    },
  };
}

export function search(query) {
  return {
    type: SEARCH,
    payload: {
      query,
    },
  };
}

export default function reducer(state = defaultState, action = {}) {
  switch (action.type) {
    case GO_TO_PAGE:
      return applyGoToPage(state, action);
    case SEARCH:
      return applySearch(state, action);

    default:
      return state;
  }
}

function applyGoToPage(state, action) {
  return {
    ...state,
    offset: (action.payload.page || 0) * state.limit,
  };
}

function applySearch(state, action) {
  return {
    // we apply the default state at each new query to come back to first page
    ...defaultState,
    query: action.payload.query,
  };
}
