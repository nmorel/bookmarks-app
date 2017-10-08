import React from 'react';
import cn from 'classnames';

// The ellipsis to add in gaps
const gap = '...';
// Number of buttons at the start
const nbButtonStart = 1;
// Number of buttons at the end
const nbButtonEnd = 1;
// Number of buttons around the current page
const nbNeightbor = 2;
// Max number of buttons wanted
// + 3 for the current page and 2 ellipsis
const nbButtons = nbButtonStart + nbButtonEnd + nbNeightbor * 2 + 3;

/**
 * This function returns an array with the buttons for pagination.
 * We always want visible the first page, the last page, the current page and its 2 neighbors from left and right.
 * If there is more pages, we insert '...' between those values.
 * For example, If the current page is the 5th from 20, we will returns :
 * [1, '...', 4, 5, 6, 7, 8, '...', 20]
 * So in the "worst" case, we have 9 buttons (with 2 '...').
 *
 * If the number of pages is > 9, we fill the array to always get 9 buttons.
 * So, if the current page is the 2nd from 20, the result is :
 * [1, 2, 3, 4, '...', 17, 18, 19, 20]
 *
 * @param currentPage the current page (starting at 0)
 * @param nbPages the number of pages
 * @return {*}
 */
export const calculateButtonsPage = (currentPage, nbPages) => {
  if (!nbPages) {
    return [];
  }

  if (nbPages <= nbButtons) {
    // The number of pages is inferior to the max number of buttons.
    // So we just add all the pages
    const pagesToShow = [];
    for (let i = 0; i < nbPages; i++) {
      pagesToShow.push(i);
    }
    return pagesToShow;
  }

  // The current page is in the middle so we can safely
  // add the buttons at begin, end and around current page.

  // We use a set to remove duplicate
  const pagesToShow = new Set();

  // Add the buttons at the beginning
  for (let i = 0; i < nbButtonStart; i++) {
    pagesToShow.add(i);
  }

  // Add the current page and its neighbor
  for (let i = -nbNeightbor; i <= nbNeightbor; i++) {
    const page = currentPage + i;
    if (page >= 0 && page < nbPages) {
      pagesToShow.add(page);
    }
  }

  // Add the buttons at the end
  for (let i = 0; i < nbButtonEnd; i++) {
    pagesToShow.add(nbPages - 1 - i);
  }

  // Now, if the current page is close to the start or end (no gap)
  // we add buttons to the other side to get nbButtons

  if (currentPage <= nbButtonStart + nbNeightbor) {
    // The current page is close to the start
    // We add buttons at the end
    const nbButtonsToAdd = nbButtons - 1 - pagesToShow.size;
    for (let i = 0; i < nbButtonsToAdd + nbButtonEnd; i++) {
      pagesToShow.add(nbPages - 1 - i);
    }
  } else if (currentPage >= nbPages - 1 - nbButtonEnd - nbNeightbor) {
    // The current page is close to the end
    // We add buttons at the start
    const nbButtonsToAdd = nbButtons - 1 - pagesToShow.size;
    for (let i = 0; i < nbButtonsToAdd + nbButtonStart; i++) {
      pagesToShow.add(i);
    }
  }

  // Finally, we sort the values and add the gap between values
  return Array.from(pagesToShow)
    .sort((a, b) => a - b)
    .reduce((pages, page, index) => {
      if (!index) {
        // first page
        pages.push(page);
      } else {
        // If the previous value is not the ellipsis
        // and there is a gap between the previous value and the current,
        // we add the ellipsis
        if (pages[pages.length - 1] !== gap && pages[pages.length - 1] !== page - 1) {
          // There is a gap with the previous value
          // If the gap is > 1, we add an ellipsis
          if (page - pages[pages.length - 1] > 2) {
            pages.push(gap);
          } else {
            // The gap is only 1 page so we add it instead of ellipsis
            pages.push(page - 1);
          }
        }
        pages.push(page);
      }
      return pages;
    }, []);
};

export const Pagination = ({offset, limit, total, goToPage}) => {
  const currentPage = offset / limit;
  const nbPages = Math.ceil(total / limit);
  const pages = calculateButtonsPage(currentPage, nbPages);
  return (
    <div className="Pagination">
      {pages.map((page, index) => (
        <Button key={index} page={page} goToPage={goToPage} selected={page === currentPage} />
      ))}
    </div>
  );
};

const Button = ({page, goToPage, selected}) => {
  const fake = page === gap;
  const onClick = () => {
    goToPage(page);
    // We scroll back to top
    window.scroll(0, 0);
  };
  return (
    <button
      type="button"
      disabled={fake}
      onClick={onClick}
      className={cn('Pagination-Button', {fake, active: selected})}
    >
      {fake ? page : page + 1}
    </button>
  );
};
