import { mockOne, mockTwo, mockThree, unmockedFunction } from './index';

jest.mock('./index', () => {
  const originalModule =
    jest.requireActual<typeof import('./index')>('./index');

  return {
    __esModule: true,
    ...originalModule,
    mockOne: jest.fn(() => 'mockOne'),
    mockTwo: jest.fn(() => 'mockTwo'),
    mockThree: jest.fn(() => 'mockThree'),
  };
});

describe('partial mocking', () => {
  afterAll(() => {
    jest.unmock('./index');
  });

  test('mockOne, mockTwo, mockThree should not log into console', () => {
    const mockConsole = jest.spyOn(console, 'log');
    mockOne();
    mockTwo();
    mockThree();
    expect(mockOne).toBeCalled();
    expect(mockTwo).toBeCalled();
    expect(mockThree).toBeCalled();
    expect(mockConsole).not.toBeCalled();
    mockConsole.mockRestore();
  });

  test('unmockedFunction should log into console', () => {
    const mockConsole = jest.spyOn(console, 'log');
    unmockedFunction();
    expect(mockConsole).toBeCalled();
    expect(mockConsole).toBeCalledWith('I am not mocked');
    mockConsole.mockRestore();
  });
});
