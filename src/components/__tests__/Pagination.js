import {calculateButtonsPage} from '../Pagination';

it(`returns empty array if no page`, () => {
  expect(calculateButtonsPage(0, 0)).toEqual([]);
  expect(calculateButtonsPage(0, NaN)).toEqual([]);
});

it(`returns all pages if pages < 10`, () => {
  expect(calculateButtonsPage(2, 5)).toEqual([0, 1, 2, 3, 4]);
  expect(calculateButtonsPage(0, 1)).toEqual([0]);
  expect(calculateButtonsPage(3, 9)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
});

it(`returns 8 pages and 1 gap if current page close to beginning or end`, () => {
  expect(calculateButtonsPage(0, 20)).toEqual([0, 1, 2, '...', 15, 16, 17, 18, 19]);
  expect(calculateButtonsPage(2, 20)).toEqual([0, 1, 2, 3, 4, '...', 17, 18, 19]);
  expect(calculateButtonsPage(17, 20)).toEqual([0, 1, 2, '...', 15, 16, 17, 18, 19]);
  expect(calculateButtonsPage(15, 20)).toEqual([0, '...', 13, 14, 15, 16, 17, 18, 19]);
  expect(calculateButtonsPage(19, 20)).toEqual([0, 1, 2, 3, 4, '...', 17, 18, 19]);
  expect(calculateButtonsPage(3, 20)).toEqual([0, 1, 2, 3, 4, 5, '...', 18, 19]);
  expect(calculateButtonsPage(4, 20)).toEqual([0, 1, 2, 3, 4, 5, 6, '...', 19]);
});

it(`returns 7 pages and 2 gap if current page in middle`, () => {
  expect(calculateButtonsPage(6, 20)).toEqual([0, '...', 4, 5, 6, 7, 8, '...', 19]);
  expect(calculateButtonsPage(10, 20)).toEqual([0, '...', 8, 9, 10, 11, 12, '...', 19]);
  expect(calculateButtonsPage(13, 20)).toEqual([0, '...', 11, 12, 13, 14, 15, '...', 19]);
});
