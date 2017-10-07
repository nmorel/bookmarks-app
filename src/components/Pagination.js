import React from 'react';
import cn from 'classnames';

const gap = '...';

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
 * @param offset the current offset
 * @param limit the number of item per page
 * @param total the total number of items
 * @return {*}
 */
// TODO Find a better way to calculate the array
export const calculateButtonsPage = (offset, limit, total) => {
  const nbPages = Math.ceil(total / limit);
  if (!nbPages) {
    return [];
  }

  const currentPage = offset / limit;

  let pagesToShow = [];
  if (nbPages <= 9) {
    for (let i = 0; i < nbPages; i++) {
      pagesToShow.push(i);
    }
  } else if (currentPage > 3 && currentPage < nbPages - 4) {
    pagesToShow.push(
      0,
      currentPage - 2,
      currentPage - 1,
      currentPage,
      currentPage + 1,
      currentPage + 2,
      nbPages - 1
    );
    if (currentPage === 4) {
      pagesToShow.push(1);
    } else if (currentPage === nbPages - 5) {
      pagesToShow.push(nbPages - 2);
    }
  } else if (currentPage <= 3) {
    for (let i = 0; i < currentPage + 3; i++) {
      pagesToShow.push(i);
    }
    const nbPageToAdd = 8 - pagesToShow.length;
    for (let i = 0; i < nbPageToAdd; i++) {
      pagesToShow.push(nbPages - (1 + i));
    }
  } else {
    for (let i = nbPages - 1; i > currentPage - 3; i--) {
      pagesToShow.push(i);
    }
    const nbPageToAdd = 8 - pagesToShow.length;
    for (let i = 0; i < nbPageToAdd; i++) {
      pagesToShow.push(i);
    }
  }

  // We sort the values
  pagesToShow = pagesToShow.sort((a, b) => a - b);

  // And finally add the gap between values
  return pagesToShow.reduce((acc, page, index) => {
    if (!index) {
      // first page
      acc.push(page);
    } else {
      if (acc[acc.length - 1] !== gap && acc[acc.length - 1] !== page - 1) {
        // There is a gap with the previous page
        acc.push(gap);
      }
      acc.push(page);
    }
    return acc;
  }, []);
};

export const Pagination = ({offset, limit, total, goToPage}) => {
  const pages = calculateButtonsPage(offset, limit, total);
  const currentPage = offset / limit;
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
