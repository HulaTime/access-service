import { stripNullResponseValues } from '../../src/routers';

describe('#stripNullResponseValues', () => {
  test('It should remove attributes from an object if they have a null value', () => {
    const sut = { foo: 'bar', bad: null };
    const stripped = stripNullResponseValues(sut);
    expect(stripped).toEqual({ foo: 'bar' });
  });

  test('It should remove attributes from an object if they have an undefined value', () => {
    const sut = { foo: 'bar', bad: undefined };
    const stripped = stripNullResponseValues(sut);
    expect(stripped).toEqual({ foo: 'bar' });
  });

  test('It can optionally be disabled', () => {
    const sut = { foo: 'bar', bad: undefined };
    const stripped = stripNullResponseValues(sut, true);
    expect(stripped).toEqual(sut);
  });
});
