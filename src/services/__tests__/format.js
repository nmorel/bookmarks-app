import {formatDuration} from '../format';

describe('formatDuration', () => {
  it(`returns 0:00 if no duration`, () => {
    expect(formatDuration()).toEqual('0:00');
    expect(formatDuration(0)).toEqual('0:00');
    expect(formatDuration(NaN)).toEqual('0:00');
  });

  it(`returns a correct duration`, () => {
    expect(formatDuration(45)).toEqual('0:45');
    expect(formatDuration(145)).toEqual('2:25');
    expect(formatDuration(67)).toEqual('1:07');
    expect(formatDuration(70)).toEqual('1:10');
    expect(formatDuration(3596)).toEqual('59:56');
    expect(formatDuration(3600)).toEqual('60:00');
    expect(formatDuration(7231)).toEqual('120:31');
  });
});
