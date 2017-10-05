import {calculateButtonsPage} from '../Pagination';

it(`returns empty array if no page`, () => {
  expect(calculateButtonsPage(0, 10, 0)).toEqual([]);
  expect(calculateButtonsPage(0, 10, NaN)).toEqual([]);
  expect(calculateButtonsPage(0, NaN, NaN)).toEqual([]);
  expect(calculateButtonsPage(NaN, NaN, NaN)).toEqual([]);
});

it(`returns all pages if pages < 10`, () => {
  expect(calculateButtonsPage(20, 10, 50)).toEqual([0, 1, 2, 3, 4]);
  expect(calculateButtonsPage(0, 10, 8)).toEqual([0]);
  expect(calculateButtonsPage(60, 10, 87)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
});

it(`returns 8 pages and 1 gap if current page close to beginning or end`, () => {
  expect(calculateButtonsPage(0, 2, 39)).toEqual([0, 1, 2, '...', 15, 16, 17, 18, 19]);
  expect(calculateButtonsPage(4, 2, 39)).toEqual([0, 1, 2, 3, 4, '...', 17, 18, 19]);
  expect(calculateButtonsPage(34, 2, 39)).toEqual([0, 1, 2, '...', 15, 16, 17, 18, 19]);
  expect(calculateButtonsPage(38, 2, 39)).toEqual([0, 1, 2, 3, 4, '...', 17, 18, 19]);
});

it(`returns 7 pages and 2 gap if current page in middle`, () => {
  expect(calculateButtonsPage(12, 2, 39)).toEqual([0, '...', 4, 5, 6, 7, 8, '...', 19]);
  expect(calculateButtonsPage(20, 2, 39)).toEqual([0, '...', 8, 9, 10, 11, 12, '...', 19]);
  expect(calculateButtonsPage(26, 2, 39)).toEqual([0, '...', 11, 12, 13, 14, 15, '...', 19]);
});
